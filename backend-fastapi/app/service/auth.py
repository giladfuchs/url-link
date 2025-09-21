import secrets
from datetime import datetime, timedelta
from urllib.parse import urlencode

import httpx
from fastapi import Body, Depends, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from common.config import conf
from common.db_model.models import UserModel
from common.enums import AuthProvider, DBOperator
from common.serializers import DBQuery, FilterQuery, Token
from common.utils.errors import ErrorService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class Auth(ErrorService):
    @staticmethod
    async def jwt_required(token: str = Depends(oauth2_scheme)) -> UserModel.table:
        return await Auth.validate_token(token)

    @staticmethod
    def user_filtered_query(field_name: str = conf.AUTH_PARENT_FIELD):
        def _inject_user_filter(
            filter_query: FilterQuery = Body(default=FilterQuery()),
            user_auth: UserModel.table = Depends(Auth.jwt_required),
        ) -> FilterQuery:
            if not user_auth.is_superuser:
                filter_query.query.append(
                    DBQuery(key=field_name, opt=DBOperator.eq, value=int(user_auth.id))
                )
            return filter_query

        return Depends(_inject_user_filter)

    @classmethod
    def google_login(cls, request: Request):
        request.session["oauth_mode"] = "popup"
        state = secrets.token_urlsafe(24)
        request.session["oauth_state"] = state
        redirect_uri = conf.GOOGLE_REDIRECT_URI
        params = {
            "client_id": conf.GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "include_granted_scopes": "true",
            "state": state,
        }
        url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
        return RedirectResponse(url)

    @classmethod
    async def google_callback_issue_token(cls, request: Request) -> Token:
        code = request.query_params.get("code")
        if not code:
            cls.error_400(f"google_oauth_error:no_code")

        data = {
            "code": code,
            "client_id": conf.GOOGLE_CLIENT_ID,
            "client_secret": conf.GOOGLE_CLIENT_SECRET,
            "redirect_uri": conf.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            tok_res = await client.post(
                "https://oauth2.googleapis.com/token", data=data
            )
        if tok_res.status_code != 200:
            cls.error_400(f"google_oauth_error:token_exchange_failed:{tok_res.text}")

        token_payload = tok_res.json()
        id_token = token_payload.get("id_token")
        access_token = token_payload.get("access_token")
        if not id_token:
            cls.error_400(f"google_oauth_error:no_id_token")

        async with httpx.AsyncClient(timeout=10.0) as client:
            verify = await client.get(
                "https://oauth2.googleapis.com/tokeninfo", params={"id_token": id_token}
            )
        if verify.status_code != 200:
            cls.error_400(f"google_oauth_error:id_token_verify_failed")

        info = verify.json()
        aud = info.get("aud")
        iss = info.get("iss")
        if aud != conf.GOOGLE_CLIENT_ID or iss not in (
            "https://accounts.google.com",
            "accounts.google.com",
        ):
            cls.error_400(f"google_oauth_error:aud_iss_mismatch")

        user = UserModel.payload(
            provider=AuthProvider.GOOGLE,
            provider_user_id=info.get("sub"),
            name=info.get("name", info.get("given_name")),
            email=info.get("email"),
            image_url=info.get("picture"),
        )

        if not user.email:
            if access_token:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    ui = await client.get(
                        "https://openidconnect.googleapis.com/v1/userinfo",
                        headers={"Authorization": f"Bearer {access_token}"},
                    )
                if ui.status_code == 200:
                    ui_json = ui.json()
                    user["email"] = ui_json.get("email")
                    user["image_url"] = user["image_url"] or ui_json.get("picture")
            if not user["email"]:
                cls.error_400(f"google_oauth_error:no_email")

        return await cls.authenticate_user(user=user)

    @classmethod
    async def authenticate_user(cls, user=UserModel.payload) -> Token:
        filter_query = FilterQuery(
            query=[
                DBQuery(
                    key=UserModel.table.provider.key,
                    opt=DBOperator.eq,
                    value=user.provider.value,
                ),
                DBQuery(
                    key=UserModel.table.provider_user_id.key,
                    opt=DBOperator.eq,
                    value=user.provider_user_id,
                ),
            ]
        )
        db_user: UserModel.table | None = await UserModel.fetch_rows(
            filter_query=filter_query, limit=1
        )
        if not db_user:
            db_user: UserModel.table = await UserModel.add_update(
                UserModel.table(**user.model_dump())
            )
        return cls.create_token(db_user.id)

    @classmethod
    async def validate_token(cls, token: str) -> UserModel.table:
        try:
            payload = jwt.decode(
                token, conf.JWT_SECRET, algorithms=[conf.JWT_ALGORITHM]
            )
            _id = payload.get("id")
            user: UserModel.table = await UserModel.get_by_id(_id=_id)
            if not user:
                raise cls.error_authenticate()
            return user
        except (JWTError, Exception):
            raise cls.error_authenticate()

    @classmethod
    def create_token(cls, _id: int) -> Token:
        now = datetime.utcnow()
        payload = {
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(seconds=int(conf.JWT_EXP)),
            "id": _id,
        }
        token = jwt.encode(payload, conf.JWT_SECRET, algorithm=conf.JWT_ALGORITHM)
        return Token(token=token)
