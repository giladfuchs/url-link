from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from app.service.auth import Auth
from common.serializers import Token

router = APIRouter(prefix="/login", tags=["login"])


@router.get("/google_login")
async def google_login(request: Request):
    return Auth.google_login(request)


@router.get("/google_callback", response_model=Token)
async def google_callback(request: Request):
    tok = await Auth.google_callback_issue_token(request)
    html = f"""<!doctype html><meta charset="utf-8" />
<script>
try {{
  window.opener && window.opener.postMessage({{ token: "{tok.token}" }}, "*");
}} catch (e) {{}}
window.close();
</script>"""
    return HTMLResponse(html)
