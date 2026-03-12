from enum import Enum


class EnumBase(str, Enum):
    def __get__(self, instance, ownerclass=None):
        if instance is None:
            return self.value

    @classmethod
    def values(cls):
        return [_.value for _ in cls]


class AuthProvider(EnumBase):
    GOOGLE = "google"


class ModelType(EnumBase):
    user = "user"
    link = "link"
    visit = "visit"


class DBOperator(EnumBase):
    eq = "eq"
    ne = "ne"
    in_ = "in_"
    not_in = "not_in"
    is_null = "is_null"
