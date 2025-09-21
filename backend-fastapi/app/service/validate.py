from typing import Any
from urllib.parse import urlparse

import regex

from common.serializers.payload import LinkPayload
from common.utils.errors import ErrorService
from common.utils.log import logger


class Validate(ErrorService):
    ALIAS_RE = regex.compile(r"^[\p{L}0-9_.-]+$", flags=regex.UNICODE)

    @classmethod
    def alias(cls, alias: str) -> None:
        if not alias:
            cls.error_400("validate.alias.required")
        if len(alias) > 30:
            cls.error_400("validate.alias.length")
        if not Validate.ALIAS_RE.match(alias):
            cls.error_400("validate.alias.charset")

    @classmethod
    def url(cls, url: str) -> None:
        try:
            parsed = urlparse(url)
        except Exception as ex:
            logger.error(ex)
            cls.error_400("validate.url.problem")
        if (
            not parsed.scheme
            or not parsed.netloc
            or parsed.scheme not in ("http", "https")
        ):
            cls.error_400("validate.url.problem")

    @classmethod
    def validate_link(cls, link: LinkPayload | dict[str, Any]) -> None:
        alias = link.alias if isinstance(link, LinkPayload) else link.get("alias")
        url = link.url if isinstance(link, LinkPayload) else link.get("url")
        cls.alias(alias)
        cls.url(url)
