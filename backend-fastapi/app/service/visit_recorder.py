import hashlib
import pathlib
import re
from datetime import datetime
from typing import ClassVar, Optional, Tuple

import geoip2.database
from fastapi import Request
from user_agents import parse as parse_ua

from common.db_model.models import VisitModel
from common.enums import DBOperator
from common.serializers import DBQuery, FilterQuery


class VisitRecorder:
    _geo: ClassVar[Optional[geoip2.database.Reader]] = None

    @classmethod
    def init(cls) -> None:
        if cls._geo is None:
            root = pathlib.Path(__file__).resolve().parents[2]
            db_path = root / "data" / "GeoLite2-City.mmdb"
            cls._geo = geoip2.database.Reader(db_path)

    @classmethod
    def ip(cls, req: Request) -> Optional[str]:
        xff = req.headers.get("x-forwarded-for")
        if xff:
            return xff.split(",")[0].strip()
        return req.client.host if req.client else None

    @classmethod
    def hash_ip(cls, ip: Optional[str]) -> Optional[str]:
        return hashlib.sha1(ip.encode()).hexdigest()[:40] if ip else None

    @classmethod
    def ua_info(
        cls, ua_str: Optional[str]
    ) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        ua = parse_ua(ua_str or "")
        device = "mobile" if ua.is_mobile else "tablet" if ua.is_tablet else "desktop"
        return device, (ua.os.family or None), (ua.browser.family or None)

    @classmethod
    def geo_info(
        cls, ip: Optional[str]
    ) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        if not cls._geo or not ip:
            return None, None, None
        try:
            resp = cls._geo.city(ip)
            country = resp.country.name or None
            region = resp.subdivisions.most_specific.name or None
            city = resp.city.name or None
            return country, region, city
        except Exception as e:

            return None, None, None

    @classmethod
    async def is_unique(
        cls, link_id: int, ip_hash: str | None, user_agent: str | None
    ) -> bool:
        if not ip_hash:
            return True
        if not ip_hash:
            return False
        link = await VisitModel.fetch_rows(
            filter_query=FilterQuery(
                query=[
                    DBQuery(
                        key=VisitModel.table.link_id.key,
                        opt=DBOperator.eq,
                        value=link_id,
                    ),
                    DBQuery(
                        key=VisitModel.table.ip_hash.key,
                        opt=DBOperator.eq,
                        value=ip_hash,
                    ),
                    DBQuery(
                        key=VisitModel.table.user_agent.key,
                        opt=DBOperator.eq,
                        value=user_agent,
                    ),
                ]
            ),
            limit=1,
        )
        return not bool(link)

    BOT_PATTERNS = [
        r"\b(bot|crawler|spider)\b",
        r"facebookexternalhit",
        r"perplexitybot",
        r"googleother",
        r"whatsapp/",
    ]

    @classmethod
    def is_bot(cls, visit) -> bool:
        ua = visit.user_agent.lower()
        br = visit.browser.lower()

        for p in cls.BOT_PATTERNS:
            if re.search(p, ua) or re.search(p, br):
                return True

        return False

    @classmethod
    async def record(cls, link_id: int, req: Request) -> None:
        cls.init()
        ip = cls.ip(req)
        ip_hash = cls.hash_ip(ip)
        device, os_name, browser = cls.ua_info(req.headers.get("user-agent"))
        country, region, city = cls.geo_info(ip)
        user_agent = req.headers.get("user-agent")
        visit = VisitModel.table(
            link_id=link_id,
            ip_hash=ip_hash,
            country=country,
            region=region,
            city=city,
            referrer=req.headers.get("referer"),
            user_agent=user_agent,
            device=device,
            os=os_name,
            browser=browser,
            created_at=datetime.utcnow(),
        )
        if cls.is_bot(visit=visit):
            return
        visit.is_unique = await cls.is_unique(link_id, ip_hash, user_agent)
        await VisitModel.add_update(visit)
