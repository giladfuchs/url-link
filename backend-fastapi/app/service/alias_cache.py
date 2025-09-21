import asyncio
from collections import OrderedDict

from common.db_model.models import LinkModel
from common.enums import DBOperator
from common.serializers import DBQuery, FilterQuery


class AliasCache:
    def __init__(self, maxsize: int = 10_000):
        self.maxsize = maxsize
        self._data = OrderedDict()
        self._locks: dict[str, asyncio.Lock] = {}

    async def get(self, alias: str):
        v = self._data.get(alias)
        if v is not None:
            self._data.move_to_end(alias)
            return v

        lock = self._locks.setdefault(alias, asyncio.Lock())
        async with lock:
            v = self._data.get(alias)
            if v is not None:
                self._data.move_to_end(alias)
                return v

            link: LinkModel.table = await LinkModel.fetch_rows(
                filter_query=FilterQuery(
                    query=[
                        DBQuery(
                            key=LinkModel.table.alias.key,
                            opt=DBOperator.eq,
                            value=alias,
                        ),
                        DBQuery(
                            key=LinkModel.table.active.key,
                            opt=DBOperator.eq,
                            value=True,
                        ),
                    ]
                ),
                limit=1,
            )
            if link:
                self.set(link=link)
            return link

    def set(self, link: LinkModel.table):
        self._data[link.alias] = link
        self._data.move_to_end(link.alias)
        if len(self._data) > self.maxsize:
            self._data.popitem(last=False)

    def clear(self):
        self._data.clear()
        self._locks.clear()


alias_cache = AliasCache()
