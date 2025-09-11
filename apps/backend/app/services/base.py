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
    Iterable,
)
from uuid import UUID
from pydantic import BaseModel
from sqlalchemy import select, func, and_, true, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Mapped, Load
from sqlalchemy.sql import ColumnElement
from fastapi import HTTPException, status
from app.db.base import BaseModel
from pydantic import BaseModel

from sqlalchemy import and_, select, func


class HasId(Protocol):
    id: Final[int | UUID | Mapped[Any]]


ModelT = TypeVar("ModelT", bound=HasId)
CreateT = TypeVar("CreateT", bound=BaseModel)
UpdateT = TypeVar("UpdateT", bound=BaseModel)


def _build_predicates(model, kv: dict[str, Any]):
    preds = []
    for k, v in kv.items():
        if not hasattr(model, k):
            continue
        col = getattr(model, k)

        if v is None:
            preds.append(col.is_(None))
            continue

        if isinstance(v, (list, tuple, set)):
            values = list(v)
            if not values:
                continue
            non_null = [x for x in values if x is not None]
            has_null = any(x is None for x in values)
            parts = []
            if non_null:
                parts.append(col.in_(non_null))
            if has_null:
                parts.append(col.is_(None))
            if parts:
                preds.append(or_(*parts))
            continue

        preds.append(col == v)
    return preds


class CRUDBase(Generic[ModelT, CreateT, UpdateT]):
    def __init__(self, model: Type[ModelT]):
        self.model = model

    async def list(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 1001,
        projection: list[str] | None = None,
        filter_by_key_value: dict[str, Any] | None = None,
        options: Iterable[Any] = (),
    ):
        predicates = _build_predicates(self.model, filter_by_key_value or {})
        if projection:
            cols = [getattr(self.model, name) for name in projection]
            stmt = select(*cols)
        else:
            stmt = select(self.model)

        if predicates:
            stmt = stmt.where(and_(*predicates))

        if options:
            stmt = stmt.options(*options)

        stmt = stmt.offset(skip).limit(limit)

        result = await db.execute(stmt)
        if projection:
            rows = result.all()
            items = [dict(zip(projection, row)) for row in rows]
        else:
            items = result.scalars().all()

        # Count with the same filter
        base_count = select(self.model)
        if predicates:
            base_count = base_count.where(and_(*predicates))
        count_stmt = select(func.count()).select_from(
            base_count.order_by(None).subquery()
        )
        total = await db.scalar(count_stmt)

        return {"items": items, "total": total, "skip": skip, "limit": limit}

    async def get(
        self,
        db: AsyncSession,
        obj_id: int | UUID,
        options: Iterable[Any] = (),
    ) -> Optional[ModelT]:

        stmt = select(self.model)

        if options:
            stmt = stmt.options(*options)

        stmt = stmt.where(cast("ColumnElement[bool]", self.model.id == obj_id))

        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, obj_in: CreateT) -> ModelT:
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        try:
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        except IntegrityError:
            await db.rollback()
            raise
        except SQLAlchemyError:
            await db.rollback()
            raise

    async def create_bulk(
        self, db: AsyncSession, data_list: List[CreateT]
    ) -> List[ModelT]:
        db_objects = [self.model(**data.model_dump()) for data in data_list]
        db.add_all(db_objects)

        try:
            await db.commit()
        except IntegrityError as e:
            await db.rollback()
            print(e.orig)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="One or more items failed due to a unique constraint violation.",
            )
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"A database error occurred: {e}",
            )
        return db_objects

    async def update(self, db: AsyncSession, db_obj: ModelT, obj_in: UpdateT) -> ModelT:
        for field, value in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, field, value)
        try:
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        except IntegrityError:
            await db.rollback()
            raise
        except SQLAlchemyError:
            await db.rollback()
            raise

    async def delete(self, db: AsyncSession, obj_id: int | UUID) -> None:
        obj = await self.get(db, obj_id)
        if obj:
            await db.delete(obj)
            await db.commit()
