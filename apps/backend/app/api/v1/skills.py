from fastapi import APIRouter, Depends, HTTPException
from app.services.skills import skill_service
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from app.api.deps import get_current_admin
from app.schemas.profile import SkillCreate, SkillUpdate, SkillOut
from app.schemas.common import ListResponse

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/", response_model=ListResponse[SkillOut])
async def get_skills(db: AsyncSession = Depends(get_async_session)):
    return await skill_service.list(db)


@router.get("/{skill_id}", response_model=SkillOut)
async def get_skill(skill_id: int, db: AsyncSession = Depends(get_async_session)):
    if not skill_id:
        return HTTPException(status_code=404, detail="Skill not found")
    return await skill_service.get(db, skill_id, options=[])


@router.post("/", dependencies=[Depends(get_current_admin)], response_model=SkillOut)
async def create_skill(
    skills_create: SkillCreate, db: AsyncSession = Depends(get_async_session)
):
    return await skill_service.create(db, skills_create)


@router.patch(
    "/{skill_id}", dependencies=[Depends(get_current_admin)], response_model=SkillOut
)
async def update_skill(
    skills_update: SkillUpdate,
    skill_id: int,
    db: AsyncSession = Depends(get_async_session),
):
    data = await skill_service.get(db, skill_id)
    if not data:
        return HTTPException(status_code=404, detail="Skill not found")
    return await skill_service.update(db, data, skills_update)


@router.delete("/{skill_id}", dependencies=[Depends(get_current_admin)])
async def delete_skill(skill_id: int, db: AsyncSession = Depends(get_async_session)):
    if not skill_id:
        return HTTPException(status_code=404, detail="Skill not found")
    return await skill_service.delete(db, skill_id)
