import uuid

from fastapi import APIRouter, BackgroundTasks, Request
from fastapi.responses import RedirectResponse

from app.service.alias_cache import alias_cache
from app.service.visit_recorder import VisitRecorder
from common.config import conf
from common.db_model.models import LinkModel, UnsubscribeEmailModel
from common.enums import DBOperator
from common.serializers import DBQuery, FilterQuery
from common.serializers.payload import SingleLinkResponse

router = APIRouter(tags=["public"])


@router.post("/create/link", response_model=LinkModel.payload)
async def create_link_public(body: LinkModel.payload):
    setattr(body, "password_hash", str(uuid.uuid4()))
    link = await LinkModel.add_or_find_update_single("add", body)
    return link


@router.get("/report/{password_hash}", response_model=SingleLinkResponse)
async def report_public_password_hash(password_hash: str):
    return await LinkModel.view_single(
        filter_query=FilterQuery(
            query=[
                DBQuery(
                    key=LinkModel.table.password_hash.key,
                    opt=DBOperator.eq,
                    value=password_hash,
                )
            ]
        )
    )


@router.get("/unsubscribe/{email}", response_model=str)
async def unsubscribe_email(email: str):
    obj = await UnsubscribeEmailModel.add_update(
        UnsubscribeEmailModel.table(email=email)
    )
    return obj.email


@router.get("/{alias}")
async def redirect_alias(alias: str, request: Request, bg: BackgroundTasks):
    link = await alias_cache.get(alias)

    if not link:
        return RedirectResponse(url=f"{conf.FRONTEND_URL}/error", status_code=307)

    bg.add_task(VisitRecorder.record, link.id, request)

    return RedirectResponse(
        url=link.url, status_code=307, headers={"Cache-Control": "no-store"}
    )
