
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, DateTime, JSON, desc, select
from datetime import datetime
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
        self.cache_duration_minutes = 15

    async def init(self):
        """Initialize the database"""
        try:
            logger.info("Creating database tables if they don't exist")
            async with self.engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database initialization complete")
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
            raise

    async def save_events(self, events: list, timestamp: datetime):
        """Save events to the database cache"""
        try:
            logger.info(f"Saving {len(events)} events to cache")
            async with self.async_session() as session:
                # Clear old cache entries
                await session.execute("DELETE FROM calendar_cache")
                
                # Save new cache
                cache_entry = CalendarCache(
                    events=events,
                    timestamp=timestamp
                )
                session.add(cache_entry)
                await session.commit()
                logger.info(f"Events cached successfully at {timestamp}")
        except Exception as e:
            logger.error(f"Error saving events to cache: {e}")
            raise

    async def get_latest_events(self):
        """Get the latest events from the cache"""
        try:
            logger.info("Retrieving latest events from cache")
            async with self.async_session() as session:
                stmt = select(CalendarCache).order_by(desc(CalendarCache.timestamp)).limit(1)
                result = await session.execute(stmt)
                row = result.scalar_one_or_none()
                
                if row:
                    logger.info(f"Cache found from {row.timestamp}")
                    return {
                        "events": row.events,
                        "timestamp": row.timestamp
                    }
                
                logger.info("No cached events found")
                return None
        except Exception as e:
            logger.error(f"Error retrieving events from cache: {e}")
            raise
