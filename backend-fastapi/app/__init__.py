from fastapi import FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic.error_wrappers import ValidationError
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse

from app.routers import router
from common.config import IS_LOCAL, conf


def create_app(docs=False) -> FastAPI:
    app = (
        FastAPI(title=conf.SERVER_NAME)
        if docs
        else FastAPI(title=conf.SERVER_NAME, docs_url=None, redoc_url=None)
    )

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

    app.include_router(router)

    @app.get("/")
    async def root():
        if docs and IS_LOCAL:

            return RedirectResponse(url="/docs")
        return RedirectResponse(url=conf.FRONTEND_URL)

    @app.exception_handler(HTTPException)
    async def validation_exception_handler(request, exc: HTTPException):
        return JSONResponse(
            content=dict(message=f"{exc.detail}"),
            status_code=exc.status_code,
        )

    @app.exception_handler(ValidationError)
    async def validation_exception_handler(request, exc: ValidationError):
        return JSONResponse(
            content=dict(message=f"{exc}"),
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc: RequestValidationError):
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
