import asyncio
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.db.session import engine, AsyncSessionLocal
from app.db.base import BaseModel


# ──────────────────────────────────────────────────────────────────
async def init_db() -> None:
    """Create all tables & seed the initial ADMIN user if configured."""
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)

    if settings.FIRST_SUPERUSER and settings.FIRST_SUPERUSER_PASSWORD:
        async with AsyncSessionLocal() as session:
            await _ensure_admin(session)


# ------------------------------------------------------------------
async def _ensure_admin(session: AsyncSession) -> None:
    stmt = select(User).where(User.email == settings.FIRST_SUPERUSER)
    result = await session.execute(stmt)
    admin = result.scalar_one_or_none()

    if admin:
        return

    admin_username: str | None = None
    if settings.FIRST_SUPERUSER and settings.FIRST_SUPERUSER_PASSWORD:
        admin_username = settings.FIRST_SUPERUSER.split("@")[0]
    else:
        return

    admin = User(
        username=admin_username,
        email=settings.FIRST_SUPERUSER,
        full_name="Super Admin",
        password_hash=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
        role=UserRole.ADMIN,
        created_at=datetime.now(timezone.utc),
    )
    session.add(admin)
    await session.commit()
    print(" Seeded initial ADMIN user:", admin.email)


# ------------------------------------------------------------------
if __name__ == "__main__":
    asyncio.run(init_db())
