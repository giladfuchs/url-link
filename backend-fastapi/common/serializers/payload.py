from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field

from common.enums import AuthProvider


class UserPayload(BaseModel):
    id: int | None = Field(default=None)
    provider: AuthProvider
    provider_user_id: str
    name: str
    email: str | None
    image_url: str | None


class LinkPayload(BaseModel):
    id: int | None = Field(default=None)
    alias: str | None
    url: str
    password_hash: Optional[str] = None
    expires_at: Optional[datetime] = None
    active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class Totals(BaseModel):
    clicks: int
    uniques: int


class FullLinkPayload(LinkPayload, Totals):
    pass


DataPoint = tuple[datetime, int]


class Series(BaseModel):
    uniques: list[DataPoint]
    clicks: list[DataPoint]


class Breakdown(Totals):
    value: str


class Breakdowns(BaseModel):
    country: list[Breakdown]
    region: list[Breakdown]
    city: list[Breakdown]
    referrer: list[Breakdown]
    device: list[Breakdown]
    os: list[Breakdown]
    browser: list[Breakdown]


class Report(BaseModel):
    series: Series
    breakdowns: Breakdowns
    totals: Totals


class SingleLinkResponse(BaseModel):
    report: Report
    link: LinkPayload


class VisitPayload(BaseModel):
    id: int | None = Field(default=None)
    link_id: int
    ip_hash: Optional[str] = None
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    device: Optional[str] = None
    os: Optional[str] = None
    browser: Optional[str] = None
    is_unique: bool = False
    created_at: datetime
