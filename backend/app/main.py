
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import asyncio
from typing import List, Optional
from pydantic import BaseModel
import logging
from .scraper import ForexFactoryScraper
from .database import Database

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8082"],  # Add your frontend URLs
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
        logger.info("Calendar API endpoint called")
        
        # Check if we have cached data that's less than 15 minutes old
        cached_data = await db.get_latest_events()
        
        if cached_data and (datetime.now() - cached_data['timestamp']) < timedelta(minutes=15):
            logger.info(f"Returning cached data from {cached_data['timestamp']}")
            return CalendarResponse(
                events=cached_data['events'],
                last_updated=cached_data['timestamp'].isoformat(),
                cached=True
            )

        # If no recent cache, scrape new data
        logger.info("No recent cache found, scraping new data")
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
        logger.error(f"Error in calendar API: {e}")
        
        # If scraping fails, try to return cached data
        try:
            cached_data = await db.get_latest_events()
            if cached_data:
                logger.info(f"Scraping failed, returning cached data from {cached_data['timestamp']}")
                return CalendarResponse(
                    events=cached_data['events'],
                    last_updated=cached_data['timestamp'].isoformat(),
                    cached=True
                )
        except Exception as cache_error:
            logger.error(f"Failed to get cached data as fallback: {cache_error}")
            
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application")
    # Initialize the database
    await db.init() 
    
    # Pre-fetch calendar data on startup
    try:
        logger.info("Pre-fetching calendar data")
        events = await scraper.scrape_calendar()
        await db.save_events(events, datetime.now())
        logger.info("Initial calendar data fetch successful")
    except Exception as e:
        logger.error(f"Failed to pre-fetch calendar data: {e}")
