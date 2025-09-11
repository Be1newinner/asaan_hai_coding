from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar("T")


class ListResponse(BaseModel, Generic[T]):
    total: int
    limit: int
    skip: int
    items: list[T]
