from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from datetime import datetime, timedelta
import asyncio
from typing import List, Optional
from pydantic import BaseModel # type: ignore
from .scraper import ForexFactoryScraper
from .database import Database

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8082"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database and scraper
db = Database()
scraper = ForexFactoryScraper()

class CalendarEvent(BaseModel):
    time: str
    currency: str
    title: str
    impact: str
    actual: Optional[str] = None
    forecast: Optional[str] = None
    previous: Optional[str] = None

class CalendarResponse(BaseModel):
    events: List[CalendarEvent]
    last_updated: str
    cached: bool

@app.get("/api/calendar", response_model=CalendarResponse)
async def get_calendar_events():
    try:
        # Check if we have cached data that's less than 15 minutes old
        cached_data = await db.get_latest_events()
        if cached_data and (datetime.now() - cached_data['timestamp']) < timedelta(minutes=15):
            return CalendarResponse(
                events=cached_data['events'],
                last_updated=cached_data['timestamp'].isoformat(),
                cached=True
            )

        # If no recent cache, scrape new data
        events = await scraper.scrape_calendar()
        timestamp = datetime.now()
        
        # Cache the new data
        await db.save_events(events, timestamp)
        
        return CalendarResponse(
            events=events,
            last_updated=timestamp.isoformat(),
            cached=False
        )
    except Exception as e:
        # If scraping fails, try to return cached data
        cached_data = await db.get_latest_events()
        if cached_data:
            return CalendarResponse(
                events=cached_data['events'],
                last_updated=cached_data['timestamp'].isoformat(),
                cached=True
            )
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    # Initialize the database
    await db.init() 