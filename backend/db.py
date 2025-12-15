from typing import AsyncGenerator, Any

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine
from sqlalchemy.orm import sessionmaker

DB_URL: str = "sqlite+aiosqlite:///./eternalgpt.db"
engine: AsyncEngine = create_async_engine(DB_URL, echo=True)
AsyncSessionLocal: sessionmaker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[Any, Any]:
    async with AsyncSessionLocal() as session:
        yield session
