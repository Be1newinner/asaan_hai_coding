from typing import Any, Iterable, Mapping
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.inspection import inspect
from sqlalchemy.orm import RelationshipProperty


async def _assign_many_to_many_by_ids(
    db: AsyncSession,
    parent_obj: Any,
    rel_name: str,
    target_model: type,
    ids: list[int],
) -> None:
    if not ids:
        setattr(parent_obj, rel_name, [])
        return
    result = await db.scalars(select(target_model).where(target_model.id.in_(ids)))
    setattr(parent_obj, rel_name, list(result))


def _update_one_to_many_inplace(
    parent_obj: Any,
    rel_name: str,
    incoming: list[Mapping[str, Any]],
    scalar_fields: Iterable[str] | None = None,
    replace: bool = True,
) -> None:
    current_list = getattr(parent_obj, rel_name) or []
    by_id = {
        getattr(item, "id"): item
        for item in current_list
        if getattr(item, "id", None) is not None
    }

    seen_ids: set[int] = set()
    new_items = []

    for payload in incoming:
        item_id = payload.get("id")
        if item_id is not None and item_id in by_id:
            obj = by_id[item_id]
            # update scalar columns only
            for k, v in payload.items():
                if k == "id":
                    continue
                if scalar_fields is None or k in scalar_fields:
                    setattr(obj, k, v)
            seen_ids.add(item_id)
        else:
            child_class = type(current_list) if current_list else None
            if child_class is None:
                rel_prop: RelationshipProperty = inspect(
                    type(parent_obj)
                ).relationships[rel_name]
                child_class = rel_prop.mapper.class_
            new_obj = child_class(**{k: v for k, v in payload.items() if k != "id"})
            new_items.append(new_obj)

    current_list.extend(new_items)

    if replace:
        remaining = [
            obj
            for obj in current_list
            if getattr(obj, "id", None) in seen_ids
            or getattr(obj, "id", None) is None
            or getattr(obj, "id", None) == 0
        ]
        to_keep = set(seen_ids)
        result_list = []
        for obj in current_list:
            oid = getattr(obj, "id", None)
            if oid is None or oid in to_keep or obj in new_items:
                result_list.append(obj)
        setattr(parent_obj, rel_name, result_list)
    else:
        setattr(parent_obj, rel_name, current_list)


def _relationship_names(model_cls: type) -> set[str]:
    return {rel.key for rel in inspect(model_cls).relationships}


def _relationship_prop(model_cls: type, name: str) -> RelationshipProperty:
    return inspect(model_cls).relationships[name]
