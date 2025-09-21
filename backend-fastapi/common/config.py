import os

from pydantic_settings import BaseSettings

# load .env locally if present (won't affect server)
try:
    from dotenv import load_dotenv  # type: ignore

    load_dotenv()
except ImportError:
    pass

# Local debug flag (match USER with USER_LOCAL from .env)
# USER_LOCAL=your_computer_username   # e.g. value from os.getenv("USER")
IS_LOCAL = os.getenv("USER", "1") == os.environ.get("USER_LOCAL")

DATABASE_URL_LOCAL = "postgresql+asyncpg://admin:admin@0.0.0.0:5437/postgres"

DATABASE_URL_PROD = os.environ.get("DATABASE_URL")
BASE_URL_PROD = os.environ.get("BASE_URL")
FRONTEND_URL_PROD = os.environ.get("FRONTEND_URL")

DATABASE_URL = DATABASE_URL_LOCAL if IS_LOCAL else DATABASE_URL_PROD
BASE_URL: str = "http://localhost:5007" if IS_LOCAL else BASE_URL_PROD
_FRONTEND_URL: str = "http://localhost:5555" if IS_LOCAL else FRONTEND_URL_PROD
if IS_LOCAL:
    # DATABASE_URL = DATABASE_URL
    # DATABASE_URL = DATABASE_URL_PROD
    print(DATABASE_URL)


class Settings(BaseSettings):
    SERVER_NAME: str = "URL-LINK"
    JWT_ALGORITHM: str = "HS256"
    JWT_SECRET: str = os.environ.get("JWT_SECRET")
    JWT_EXP: int = 15552000  # 6 months in seconds
    POSTGRES_DATABASE_URL: str = DATABASE_URL
    FRONTEND_URL: str = _FRONTEND_URL

    AUTH_PARENT_FIELD: str = "owner_id"

    GOOGLE_CLIENT_ID: str = os.environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = os.environ.get("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = f"{BASE_URL}/login/google_callback"


conf = Settings()
