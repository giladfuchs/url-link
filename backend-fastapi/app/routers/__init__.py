from fastapi import APIRouter

from app.routers import link, login, public

router = APIRouter()

for route in [public, link, login]:
    router.include_router(route.router)
