from datetime import datetime
from typing import List, Optional

from sqlmodel import DateTime, Field, Index, Relationship, String, UniqueConstraint

from common.enums import AuthProvider
from common.serializers import IdBaseTable


class TimeStampedBase(IdBaseTable, table=False):
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"nullable": False},
        sa_type=DateTime,
    )


class UnsubscribeEmail(TimeStampedBase, table=True):
    email: str = Field(index=True, unique=True, nullable=False)


class User(TimeStampedBase, table=True):
    __table_args__ = (
        UniqueConstraint("provider", "provider_user_id", name="uniq_provider_user"),
    )

    provider: AuthProvider = Field(sa_type=String, nullable=False)
    provider_user_id: str
    name: str
    email: str | None = None
    image_url: str | None = None
    is_superuser: bool = False

    links: List["Link"] | None = Relationship(
        sa_relationship_kwargs={"cascade": "all, delete"},
        back_populates="owner",
    )


class Link(TimeStampedBase, table=True):
    __table_args__ = (UniqueConstraint("alias", name="uniq_alias"),)

    owner_id: int | None = Field(default=None, foreign_key="user.id", nullable=True)
    owner: Optional["User"] = Relationship(back_populates="links")

    alias: str = Field(sa_type=String, nullable=False, index=True)
    url: str = Field(sa_type=String, nullable=False)
    password_hash: Optional[str] = Field(default=None, sa_type=String, nullable=True)
    expires_at: Optional[datetime] = Field(default=None)
    active: bool = True

    visits: Optional[List["Visit"]] = Relationship(
        sa_relationship_kwargs={"cascade": "all, delete"},
        back_populates="link",
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"nullable": False, "onupdate": datetime.utcnow},
        sa_type=DateTime,
    )


class Visit(TimeStampedBase, table=True):
    __table_args__ = (
        UniqueConstraint(
            "link_id",
            "created_at",
            "ip_hash",
            "user_agent",
            name="uniq_link_time_ip_user_agent",
        ),
        Index("ix_visit_link_created", "link_id", "created_at"),
        Index("ix_visit_link_ip", "link_id", "ip_hash"),
        Index("ix_visit_link_user_agent", "link_id", "user_agent"),
    )
    link_id: int = Field(foreign_key="link.id")
    link: "Link" = Relationship(back_populates="visits")
    ip_hash: str | None = Field(default=None, sa_type=String)
    user_agent: str | None = Field(default=None, sa_type=String)
    country: str | None = Field(default=None, sa_type=String)
    region: str | None = Field(default=None, sa_type=String)
    city: str | None = Field(default=None, sa_type=String)
    referrer: str | None = Field(default=None, sa_type=String)
    device: str | None = Field(default=None, sa_type=String)
    os: str | None = Field(default=None, sa_type=String)
    browser: str | None = Field(default=None, sa_type=String)
    is_unique: bool = True
