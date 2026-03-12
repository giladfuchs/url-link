from contextlib import asynccontextmanager
from typing import Any, Type

from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import selectinload
from sqlmodel import SQLModel, and_, select, update
from sqlmodel.ext.asyncio.session import AsyncSession

from common.config import conf
from common.enums import DBOperator, ModelType
from common.serializers import BaseTable, DBQuery, FilterQuery, RowLike
from common.utils import BaseUtils

opts = {
    DBOperator.eq: "__eq__",
    DBOperator.ne: "__ne__",
    DBOperator.in_: "in_",
    DBOperator.not_in: "notin_",
    DBOperator.is_null: "is_",
}


class DBModel(BaseUtils):
    table: Type[BaseTable] | None = None
    payload: Type[BaseModel] | None = None
    model_type: ModelType | None = None

    engine = create_async_engine(
        conf.POSTGRES_DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_recycle=1800,
        pool_size=20,
        max_overflow=5,
        connect_args={
            "prepare_threshold": None,
            "connect_timeout": 10,
        },
    )

    async_session = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )
    _public_schema_forced = False

    @classmethod
    def force_public_schema(cls):
        if cls._public_schema_forced:
            return
        for t in SQLModel.metadata.tables.values():
            t.schema = "public"
        cls._public_schema_forced = True

    @classmethod
    @asynccontextmanager
    async def get_session(cls):
        cls.force_public_schema()
        session = cls.async_session()
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

    @classmethod
    def _raise_db_error(cls, ex, row=None):
        dump = (
            row
            if isinstance(row, dict)
            else (row.model_dump() if hasattr(row, "model_dump") else None)
        )
        if dump:
            cls.logger.error(f"{dump}: {ex}")
        else:
            cls.logger.error(str(ex))
        if isinstance(ex, IntegrityError):
            orig = str(getattr(ex, "orig", ""))
            if "duplicate key value" in orig:
                field = "unique"
                if "Key (" in orig:
                    try:
                        field = orig.split("Key (")[1].split(")=")[0]
                    except Exception:
                        pass
                cls.error_400(details=f"unique:{field}")
        cls.error_400(details=ex)

    @classmethod
    async def add_update(cls, row: BaseTable | list[BaseTable]):
        async with cls.get_session() as session:
            try:
                if isinstance(row, list):
                    merged_rows = []
                    async with session.begin():
                        for obj in row:
                            merged = await session.merge(obj)
                            merged_rows.append(merged)
                    for obj in merged_rows:
                        await session.refresh(obj)
                    return merged_rows
                else:
                    async with session.begin():
                        session.add(row)
                    await session.refresh(row)
                    return row
            except Exception as ex:
                cls._raise_db_error(ex, row)

    @classmethod
    async def update_exist_bulk(cls, filter_query: FilterQuery, values: dict) -> int:
        statement = update(cls.table).values(**values)

        conditions = cls.generate_where_query(filter_query.query)

        if conditions:
            statement = statement.where(and_(*conditions))

        try:
            async with cls.get_session() as session:
                results = await session.exec(statement)
                return results.rowcount
        except Exception as ex:
            cls._raise_db_error(ex, values)

    @classmethod
    async def add_or_find_update_single(
        cls,
        add_or_id: str | int,
        body: BaseModel,
        **kwargs: Any,
    ) -> BaseTable:
        user_auth = kwargs.get("user_auth")

        if add_or_id != "add":
            _id = int(add_or_id)
            query = [DBQuery(key=cls.table.id.key, opt=DBOperator.eq, value=_id)]

            if user_auth and not user_auth.is_superuser:
                query.append(
                    DBQuery(
                        key=conf.AUTH_PARENT_FIELD,
                        opt=DBOperator.eq,
                        value=user_auth.id,
                    )
                )

            body_dict = body.model_dump()
            values = {
                key: value
                for key, value in body_dict.items()
                if key not in {"id", "created_at", "updated_at"}
            }

            updated = await cls.update_exist_bulk(
                filter_query=FilterQuery(query=query),
                values=values,
            )

            if not updated:
                cls.error_400(details="not found")

            body_dict["id"] = _id
            new_obj = cls.table(**body_dict)

        else:
            db_obj = cls.table(**body.model_dump())
            if user_auth and hasattr(db_obj, conf.AUTH_PARENT_FIELD):
                setattr(db_obj, conf.AUTH_PARENT_FIELD, user_auth.id)

            new_obj = await cls.add_update(row=db_obj)

        return new_obj

    # Generate SQLAlchemy filter conditions with AND logic from a list of DBQuery objects
    @classmethod
    def generate_where_query(cls, query: list[DBQuery]):
        # Build a tuple of SQLAlchemy expressions by applying the operator (e.g., ==, >=) on each field
        ans = tuple(
            getattr(getattr(cls.table, q.key), opts.get(q.opt, q.opt))(q.value)
            for q in query
            if hasattr(cls.table, q.key)
            and hasattr(getattr(cls.table, q.key), opts.get(q.opt, q.opt))
        )
        return ans

    @classmethod
    def build_query(cls, filter_query: FilterQuery, offset: int = 0, limit: int = 1000):
        statement = select(cls.table)

        if filter_query.query:
            statement = statement.where(*cls.generate_where_query(filter_query.query))

        if filter_query.relation_model:
            statement = statement.options(selectinload("*"))

        if filter_query.sort:
            try:
                field, direction = filter_query.sort.split(":")
                col = getattr(cls.table, field, None)
                if col:
                    direction = direction.lower()
                    statement = statement.order_by(
                        col.asc() if direction == "asc" else col.desc()
                    )
            except Exception:
                raise ValueError(
                    f"Invalid sort format: '{filter_query.sort}'. Expected 'field:asc' or 'field:desc'"
                )

        if offset:
            statement = statement.offset(offset)

        if limit:
            statement = statement.limit(limit)

        return statement

    @classmethod
    async def fetch_rows(
        cls,
        filter_query: FilterQuery = FilterQuery(),
        offset: int = 0,
        limit: int = 1000,
        **kwargs,
    ) -> RowLike | list[RowLike]:
        statement = cls.build_query(filter_query, offset, limit)

        try:
            async with cls.get_session() as session:
                results = await session.exec(statement)
                res = (
                    [
                        _.model_dump(include_relations=filter_query.relation_model)
                        for _ in results
                    ]
                    if kwargs.get("as_dict", False) or filter_query.relation_model
                    else list(results)
                )
        except Exception as ex:
            cls.error_400(details=ex)

        if not res:
            if kwargs.get("error", False):
                cls.error_400(details="not found")
            return res
        if limit == 1:
            return res[0]
        return res

    @classmethod
    async def delete_rows(
        cls, filter_query: FilterQuery = FilterQuery(), offset: int = 0
    ):
        try:
            async with cls.get_session() as session:

                select_stmt = cls.build_query(filter_query, offset, limit=0)
                results = (await session.exec(select_stmt)).all()
                if not results:
                    cls.error_400(details="nothing to delete")
                for obj in results:
                    await session.delete(obj)

                return results
        except Exception as ex:
            cls._raise_db_error(ex)

    @classmethod
    async def get_by_id(cls, _id: str | int, **kwargs):
        filter_query = FilterQuery(
            query=[DBQuery(key=cls.table.id.key, opt=DBOperator.eq, value=int(_id))],
            relation_model=kwargs.get("relation_model", False),
        )
        return await cls.fetch_rows(filter_query=filter_query, limit=1, **kwargs)
