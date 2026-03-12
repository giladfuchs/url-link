import secrets
from datetime import UTC, datetime
from typing import Any
from urllib.parse import urlparse

import regex
from pydantic import BaseModel


class Helper:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789"

    @classmethod
    def generate_random_alias(cls, length: int = 6) -> str:
        n = secrets.choice(range(length - 1, length + 2))
        return "".join(secrets.choice(cls.alphabet) for _ in range(n))

    ALIAS_RE = regex.compile(r"^[\p{L}0-9_.-]+$", flags=regex.UNICODE)

    @classmethod
    def _alias(cls, alias: str) -> None:
        if not alias:
            cls.error_400("validate.alias.required")
        if len(alias) > 30:
            cls.error_400("validate.alias.length")
        if not cls.ALIAS_RE.match(alias):
            cls.error_400("validate.alias.charset")

    @classmethod
    def _url(cls, url: str) -> None:
        try:
            parsed = urlparse(url)
        except Exception as ex:
            cls.logger.error(ex)
            cls.error_400("validate.url.problem")
        if (
            not parsed.scheme
            or not parsed.netloc
            or parsed.scheme not in ("http", "https")
        ):
            cls.error_400("validate.url.problem")

    @classmethod
    def validate_link(cls, link: BaseModel | dict[str, Any]) -> None:
        cls._alias(cls._get(body=link, key="alias"))
        cls._url(cls._get(body=link, key="url"))

    @classmethod
    def _get(
        cls, body: BaseModel | dict[str, Any], key: str, strip: bool = False
    ) -> Any:
        if isinstance(body, dict):
            value = body.get(key)
        else:
            value = getattr(body, key, None)

        if strip:
            return (value or "").strip()

        return value

    @classmethod
    def _set(cls, body: BaseModel | dict[str, Any], key: str, value: Any) -> None:
        if isinstance(body, dict):
            body[key] = value
        else:
            setattr(body, key, value)

    @classmethod
    def utcnow(cls) -> datetime:
        return datetime.now(UTC)
