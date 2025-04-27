from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
import json

Base = declarative_base()

class CalendarCache(Base):
    __tablename__ = "calendar_cache"

    id = Column(Integer, primary_key=True)
    events = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Database:
    def __init__(self):
        self.engine = create_async_engine("sqlite+aiosqlite:///calendar_cache.db")
        self.async_session = sessionmaker(
            self.engine, class_=AsyncSession, expire_on_commit=False
        )

    async def init(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def save_events(self, events: list, timestamp: datetime):
        async with self.async_session() as session:
            # Clear old cache
            await session.execute("DELETE FROM calendar_cache")
            
            # Save new cache
            cache_entry = CalendarCache(
                events=events,
                timestamp=timestamp
            )
            session.add(cache_entry)
            await session.commit()

    async def get_latest_events(self):
        async with self.async_session() as session:
            result = await session.execute(
                "SELECT events, timestamp FROM calendar_cache ORDER BY timestamp DESC LIMIT 1"
            )
            row = result.fetchone()
            if row:
                return {
                    "events": row[0],
                    "timestamp": row[1]
                }
            return None 