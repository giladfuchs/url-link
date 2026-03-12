from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic.error_wrappers import ValidationError
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse

from app.routers import router
from common.config import IS_LOCAL, conf


def create_app() -> FastAPI:
    app = FastAPI(title=conf.SERVER_NAME)
    app.add_middleware(
        SessionMiddleware,
        secret_key=conf.JWT_SECRET,
        same_site="lax",
        https_only=not IS_LOCAL,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    async def security_headers_middleware(request: Request, call_next):
        response = await call_next(request)

        response.headers["Strict-Transport-Security"] = (
            "max-age=63072000; includeSubDomains; preload"
        )
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"

        return response

    app.add_middleware(BaseHTTPMiddleware, dispatch=security_headers_middleware)

    app.include_router(router)

    @app.get("/")
    async def root():
        if IS_LOCAL:
            return RedirectResponse(url="/docs")
        return RedirectResponse(url=conf.FRONTEND_URL)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc: HTTPException):
        return JSONResponse(
            content=dict(message=f"{exc.detail}"),
            status_code=exc.status_code,
        )

    @app.exception_handler(ValidationError)
    async def pydantic_validation_exception_handler(request, exc: ValidationError):
        return JSONResponse(
            content=dict(message=f"{exc}"),
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    @app.exception_handler(RequestValidationError)
    async def request_validation_exception_handler(
        request, exc: RequestValidationError
    ):
        errors = []
        for err in exc.errors():
            loc = err["loc"]
            field = ".".join(
                str(x) for x in (loc[1:] if loc and loc[0] == "body" else loc)
            )
            short_type = err["type"].split(".")[-1]
            errors.append({"field": field, "error": short_type})

        return JSONResponse(
            content={"errors": errors},
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    return app
