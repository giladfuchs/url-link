from enum import Enum


class EnumBase(str, Enum):
    def __get__(self, instance, ownerclass=None):
        if instance is None:
            return self.value

    @classmethod
    def values(cls):
        return [_.value for _ in cls]


class AuthProvider(EnumBase):
    FACEBOOK = "facebook"
    GOOGLE = "google"


class ModelType(EnumBase):
    user = "user"
    link = "link"
    visit = "visit"


class DBOperator(EnumBase):
    eq = "eq"
    ne = "ne"
    lt = "lt"
    le = "le"
    gt = "gt"
    ge = "ge"
    like = "like"
    ilike = "ilike"  # PostgreSQL only
    in_ = "in_"
    not_in = "not_in"
    is_null = "is_null"
