import os
from datetime import datetime, timedelta
from random import choice, randint
from uuid import uuid4

from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel

from common.config import conf
from common.db_model.models import LinkModel, UserModel, VisitModel
from common.enums import AuthProvider

fake = Faker()


def random_created_at(days_back: int = 30) -> datetime:
    return datetime.utcnow() - timedelta(
        days=randint(0, days_back), hours=randint(0, 23), minutes=randint(0, 59)
    )


class FactoryModel:
    @classmethod
    def user(cls) -> dict:
        return {
            "provider": choice(AuthProvider.values()),
            "provider_user_id": str(uuid4()),
            "name": fake.name(),
            "email": fake.unique.email(),
            "image_url": fake.image_url(width=16, height=16),
            "created_at": random_created_at(),
        }

    @classmethod
    def link(cls, owner_id: int) -> dict:
        return {
            "alias": fake.unique.lexify(text="?????"),
            "url": fake.url(),
            "owner_id": owner_id,
            "active": True,
            "created_at": random_created_at(),
            "updated_at": random_created_at(),
        }

    @classmethod
    def visit(cls, link_id: int) -> dict:
        return {
            "link_id": link_id,
            "ip_hash": fake.sha1()[:16],
            "country": fake.country(),
            "region": fake.state(),
            "city": fake.city(),
            "referrer": fake.url(),
            "user_agent": fake.user_agent(),
            "device": choice(["mobile", "desktop", "tablet"]),
            "os": choice(["Windows", "Linux", "macOS", "iOS", "Android"]),
            "browser": choice(["Chrome", "Firefox", "Safari", "Edge"]),
            "is_unique": choice([True, False]),
            "created_at": random_created_at(),
        }


async def reset_postgres_schema():
    engine = create_async_engine(
        conf.POSTGRES_DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        connect_args={"statement_cache_size": 0},
    )

    # from sqlalchemy import text
    # async with engine.begin() as conn:
    #     # ⚠️ this will wipe the whole public schema
    #     await conn.execute(text("DROP SCHEMA public CASCADE;"))
    #     await conn.execute(text("CREATE SCHEMA public;"))

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)


async def create_fake_data():
    await reset_postgres_schema()
    if os.environ.get("provider_user_id"):
        await UserModel.add_update(
            UserModel.table(
                **{
                    "name": "super user",
                    "is_superuser": True,
                    "provider": "google",
                    "provider_user_id": os.environ.get("provider_user_id", "123"),
                    "email": os.environ.get("email", "user@gmail.com"),
                    "image_url": "https://lh3.googleusercontent.com/a/image",
                }
            )
        )
    # return

    # Users
    users_rows = [UserModel.table(**FactoryModel.user()) for _ in range(1)]
    users = await UserModel.add_update(users_rows)

    # Links
    links_rows = []
    for _ in range(2):
        user = choice(users)
        links_rows.append(LinkModel.table(**FactoryModel.link(owner_id=user.id)))
    links = await LinkModel.add_update(links_rows)

    # Visits
    visits_rows = []
    for _ in range(21110):
        link = choice(links)
        visits_rows.append(VisitModel.table(**FactoryModel.visit(link_id=link.id)))
    await VisitModel.add_update(visits_rows)

    print("Fake data inserted successfully!")


if __name__ == "__main__":
    import asyncio

    asyncio.run(create_fake_data())

"""
This script generates random users, links, and visit statistics.
You can also run only reset_postgres_schema() to recreate tables.

- Emails and provider IDs are created randomly for demo purposes.

If you want to make YOUR account a superuser:
1. Start the app and log in once with Google.
2. Open the database and check the "users" table
   to find your provider_user_id and email.
3. Add them to .env:
      provider_user_id=105532042821592835555
      email=youremail@gmail.com
4. Run the script.
"""
