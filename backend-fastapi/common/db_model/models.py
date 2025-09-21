import secrets
from datetime import date, datetime, timedelta
from typing import Any

from sqlalchemy import Date, bindparam, text
from sqlmodel import Integer, and_, func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from common.db_model import DBModel
from common.enums import ModelType
from common.serializers import FilterQuery
from common.serializers import payload as _payload
from common.serializers import table_model


class UserModel(DBModel):
    model_type = ModelType.user
    table = table_model.User
    payload = _payload.UserPayload


class LinkModel(DBModel):
    model_type = ModelType.link
    table = table_model.Link
    payload = _payload.LinkPayload
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789"

    @classmethod
    def generate_random_alias(cls, length: int = 6) -> str:
        n = secrets.choice(range(length - 1, length + 2))
        return "".join(secrets.choice(cls.alphabet) for _ in range(n))

    @classmethod
    def _get_alias(cls, body: Any) -> str:
        if isinstance(body, dict):
            return (body.get("alias") or "").strip()
        return (getattr(body, "alias", None) or "").strip()

    @classmethod
    def _set_alias(cls, body: Any, alias: str) -> None:
        if isinstance(body, dict):
            body["alias"] = alias
        else:
            setattr(body, "alias", alias)

    @classmethod
    async def add_or_find_update_single(
        cls,
        add_or_id: str | int,
        body: _payload.LinkPayload | dict[str, Any],
        **kwargs: Any,
    ) -> "cls.table":
        if add_or_id == "add" and not cls._get_alias(body):
            cls._set_alias(body, cls.generate_random_alias())
        from app.service.alias_cache import alias_cache
        from app.service.validate import Validate

        Validate.validate_link(link=body)
        link = await super().add_or_find_update_single(
            add_or_id=add_or_id, body=body, **kwargs
        )

        alias_cache.set(link=link)
        return link

    @classmethod
    async def fetch_rows_with_totals(
        cls,
        filter_query: FilterQuery,
        offset: int,
        limit: int,
        **kwargs,
    ):
        days = int(kwargs.get("days", 200))
        since = datetime.utcnow() - timedelta(days=days)

        ids_stmt = cls.build_query(
            filter_query, offset=offset, limit=limit
        ).with_only_columns(cls.table.id)

        stmt = (
            select(
                cls.table,
                func.count(VisitModel.table.id).label("clicks"),
                func.coalesce(
                    func.sum(func.cast(VisitModel.table.is_unique, Integer)), 0
                ).label("uniques"),
            )
            .select_from(cls.table)
            .outerjoin(
                VisitModel.table,
                and_(
                    VisitModel.table.link_id == cls.table.id,
                    VisitModel.table.created_at >= since,
                ),
            )
            .where(cls.table.id.in_(select(ids_stmt.subquery().c.id)))
            .group_by(cls.table.id)
            .order_by(cls.table.updated_at.desc(), cls.table.id.desc())
        )

        async with AsyncSession(cls.engine) as session:
            res = await session.exec(stmt)
            out = []
            for link, clicks, uniques in res:
                d = link.model_dump()
                d["clicks"] = int(clicks or 0)
                d["uniques"] = int(uniques or 0)
                out.append(d)
            return out

    @classmethod
    async def view_single(cls, filter_query: FilterQuery, **kwargs):

        link: cls.table = await cls.fetch_rows(
            filter_query=filter_query, limit=1, error=True, **kwargs
        )
        report = await VisitModel.fetch_report(link_id=link.id)
        return {"link": link, "report": report}


class VisitModel(DBModel):
    model_type = ModelType.visit
    table = table_model.Visit
    payload = _payload.VisitPayload

    @classmethod
    async def fetch_report(cls, link_id: int, days: int = 30):
        since_date = datetime.utcnow().date() - timedelta(days=days - 1)
        sql = """
        WITH base AS (
          SELECT
            date_trunc('day', created_at)::date AS day,
            NULLIF(BTRIM(country), '')  AS country,
            NULLIF(BTRIM(region),  '')  AS region,
            NULLIF(BTRIM(city),    '')  AS city,
            NULLIF(BTRIM(referrer), '') AS referrer,
            NULLIF(BTRIM(device),  '')  AS device,
            NULLIF(BTRIM(os),      '')  AS os,
            NULLIF(BTRIM(browser), '')  AS browser,
            (is_unique::int)             AS is_unique
          FROM {table}
          WHERE link_id = :link_id AND created_at >= :since
        )
        SELECT
          GROUPING(day)      AS g_day,
          GROUPING(country)  AS g_country,
          GROUPING(region)   AS g_region,
          GROUPING(city)     AS g_city,
          GROUPING(referrer) AS g_referrer,
          GROUPING(device)   AS g_device,
          GROUPING(os)       AS g_os,
          GROUPING(browser)  AS g_browser,
          day, country, region, city, referrer, device, os, browser,
          COUNT(*) AS clicks,
          COALESCE(SUM(is_unique),0) AS uniques
        FROM base
        GROUP BY GROUPING SETS (
          (day),
          (country),
          (region),
          (city),
          (referrer),
          (device),
          (os),
          (browser),
          ()
        )
        """
        sql = sql.format(table=cls.table.__tablename__)
        stmt = text(sql).bindparams(
            bindparam("link_id", type_=Integer),
            bindparam("since", type_=Date),
        )
        async with AsyncSession(cls.engine) as session:
            rows = (
                await session.execute(stmt, {"link_id": link_id, "since": since_date})
            ).all()

        dims = ("country", "region", "city", "referrer", "device", "os", "browser")
        by_day: dict[date, dict[str, int]] = {}
        breakdowns: dict[str, list[dict[str, int | str]]] = {d: [] for d in dims}
        totals = {"clicks": 0, "uniques": 0}

        for (
            g_day,
            g_country,
            g_region,
            g_city,
            g_referrer,
            g_device,
            g_os,
            g_browser,
            day,
            country,
            region,
            city,
            referrer,
            device,
            os,
            browser,
            clicks,
            uniques,
        ) in rows:
            c = int(clicks or 0)
            u = int(uniques or 0)
            if g_day == 0:
                by_day[day] = {"clicks": c, "uniques": u}
                continue
            if (
                g_day == 1
                and g_country == 1
                and g_region == 1
                and g_city == 1
                and g_referrer == 1
                and g_device == 1
                and g_os == 1
                and g_browser == 1
            ):
                totals = {"clicks": c, "uniques": u}
                continue
            mapping = {
                "referrer": (g_referrer, referrer),
                "device": (g_device, device),
                "os": (g_os, os),
                "browser": (g_browser, browser),
                "country": (g_country, country),
                "region": (g_region, region),
                "city": (g_city, city),
            }
            for dim, (g, val) in mapping.items():
                if g == 0:
                    breakdowns[dim].append(
                        {"value": val or "Unknown", "clicks": c, "uniques": u}
                    )
                    break

        out_uniques, out_clicks = [], []
        d = since_date
        today = datetime.utcnow().date()
        while d <= today:
            vals = by_day.get(d, {"clicks": 0, "uniques": 0})
            iso = d.isoformat() + "T00:00:00Z"
            out_uniques.append([iso, vals["uniques"]])
            out_clicks.append([iso, vals["clicks"]])
            d += timedelta(days=1)

        for k in breakdowns:
            breakdowns[k].sort(key=lambda x: x["clicks"], reverse=True)

        return {
            "series": {"uniques": out_uniques, "clicks": out_clicks},
            "breakdowns": breakdowns,
            "totals": totals,
        }


class UnsubscribeEmailModel(DBModel):
    table = table_model.UnsubscribeEmail


if __name__ == "__main__":
    import asyncio

    from common.enums import DBOperator, ModelType
    from common.serializers import DBQuery, FilterQuery

    async def main():
        a = await LinkModel.view_single(
            filter_query=FilterQuery(
                query=[
                    DBQuery(
                        key=LinkModel.table.alias.key,
                        opt=DBOperator.eq,
                        value="seaxD",
                    )
                ]
            )
        )
        # a = await VisitModel.fetch_report(link_id=1)
        print()
        # a = await VisitModel.fetch_rows(as_dict=True)
        # from pprint import pprint
        # pprint(a[-1])

    asyncio.run(main())
