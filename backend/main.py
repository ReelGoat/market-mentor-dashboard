from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from cachetools import TTLCache
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache for calendar data (15 minutes TTL)
calendar_cache = TTLCache(maxsize=100, ttl=900)  # 900 seconds = 15 minutes

class CalendarEvent(BaseModel):
    time: str
    currency: str
    title: str
    impact: str
    actual: Optional[str]
    forecast: Optional[str]
    previous: Optional[str]

async def scrape_forex_factory():
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Set user agent to mimic a real browser
            await page.set_extra_http_headers({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            })
            
            # Navigate to Forex Factory calendar
            await page.goto("https://www.forexfactory.com/calendar")
            
            # Wait for the calendar to load
            await page.wait_for_selector(".calendar__row")
            
            # Get the page content
            content = await page.content()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(content, 'html.parser')
            events = []
            
            # Find all calendar rows
            rows = soup.find_all("tr", class_="calendar__row")
            
            for row in rows:
                try:
                    # Extract event data
                    time = row.find("td", class_="calendar__time").text.strip()
                    currency = row.find("td", class_="calendar__currency").text.strip()
                    title = row.find("td", class_="calendar__event").text.strip()
                    
                    # Get impact level
                    impact_cell = row.find("td", class_="calendar__impact")
                    impact = "Low"
                    if impact_cell:
                        impact_icons = impact_cell.find_all("span", class_="high")
                        if len(impact_icons) == 3:
                            impact = "High"
                        elif len(impact_icons) == 2:
                            impact = "Medium"
                    
                    # Get actual, forecast, and previous values
                    actual = row.find("td", class_="calendar__actual").text.strip()
                    forecast = row.find("td", class_="calendar__forecast").text.strip()
                    previous = row.find("td", class_="calendar__previous").text.strip()
                    
                    event = CalendarEvent(
                        time=time,
                        currency=currency,
                        title=title,
                        impact=impact,
                        actual=actual if actual != "" else None,
                        forecast=forecast if forecast != "" else None,
                        previous=previous if previous != "" else None
                    )
                    events.append(event)
                except Exception as e:
                    print(f"Error parsing row: {e}")
                    continue
            
            await browser.close()
            return events
    except Exception as e:
        print(f"Error scraping Forex Factory: {e}")
        return None

@app.get("/api/calendar")
async def get_calendar():
    try:
        # Check cache first
        cached_data = calendar_cache.get("calendar_data")
        if cached_data:
            return {
                "events": cached_data,
                "last_updated": calendar_cache.get("last_updated"),
                "cached": True
            }
        
        # If not in cache, scrape new data
        events = await scrape_forex_factory()
        if events:
            # Update cache
            calendar_cache["calendar_data"] = events
            calendar_cache["last_updated"] = datetime.now().isoformat()
            return {
                "events": events,
                "last_updated": datetime.now().isoformat(),
                "cached": False
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch calendar data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 