from typing import (
    TypeVar,
    Generic,
    Type,
    List,
    Optional,
    Protocol,
    cast,
    Final,
    Any,
    Sequence,
)
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.sql import ColumnElement
from uuid import UUID
from sqlalchemy.orm import Mapped


class HasId(Protocol):
    id: Final[int | UUID | Mapped[Any]]


ModelT = TypeVar("ModelT", bound=HasId)
CreateT = TypeVar("CreateT", bound=BaseModel)
UpdateT = TypeVar("UpdateT", bound=BaseModel)


class CRUDBase(Generic[ModelT, CreateT, UpdateT]):
    def __init__(self, model: Type[ModelT]):
        self.model = model

    async def list(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[ModelT]:
        stmt = select(self.model).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get(self, db: AsyncSession, obj_id: int | UUID) -> Optional[ModelT]:
        stmt = select(self.model).where(
            cast("ColumnElement[bool]", self.model.id == obj_id)
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, obj_in: CreateT) -> ModelT:
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, db_obj: ModelT, obj_in: UpdateT) -> ModelT:
        for field, value in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, obj_id: int | UUID) -> None:
        obj = await self.get(db, obj_id)
        if obj:
            await db.delete(obj)
            await db.commit()
