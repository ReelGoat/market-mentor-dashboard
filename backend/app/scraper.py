
import requests
from bs4 import BeautifulSoup
import asyncio
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ForexFactoryScraper:
    def __init__(self):
        self.base_url = "https://www.forexfactory.com/calendar"
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        ]

    async def scrape_calendar(self) -> List[Dict[str, Any]]:
        """
        Scrape the Forex Factory calendar for economic events.
        
        Returns:
            List[Dict[str, Any]]: A list of economic events
        """
        try:
            # Add a random delay to avoid detection
            delay = random.uniform(1, 3)
            logger.info(f"Adding random delay of {delay:.2f} seconds before scraping")
            await asyncio.sleep(delay)
            
            # Set headers with a random user agent
            headers = {
                "User-Agent": random.choice(self.user_agents),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
                "Referer": "https://www.google.com/",  # Add a common referer
            }
            
            logger.info("Making request to Forex Factory calendar")
            # Make the request
            response = requests.get(self.base_url, headers=headers)
            response.raise_for_status()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the calendar table
            table = soup.find("table", class_="calendar__table")
            if not table:
                logger.error("Calendar table not found in the HTML response")
                raise Exception("Calendar table not found")

            events = []
            rows = table.find_all("tr", class_="calendar__row")
            
            logger.info(f"Found {len(rows)} event rows to process")
            
            for row in rows:
                try:
                    # Extract event data
                    time_cell = row.find("td", class_="calendar__time")
                    currency_cell = row.find("td", class_="calendar__currency")
                    event_cell = row.find("td", class_="calendar__event")
                    impact_cell = row.find("td", class_="calendar__impact")
                    actual_cell = row.find("td", class_="calendar__actual")
                    forecast_cell = row.find("td", class_="calendar__forecast")
                    previous_cell = row.find("td", class_="calendar__previous")

                    if not all([time_cell, currency_cell, event_cell, impact_cell]):
                        continue

                    # Extract impact level
                    impact = "Low"
                    impact_icon = impact_cell.find("span", class_="high")
                    if impact_icon:
                        impact = "High"
                    else:
                        impact_icon = impact_cell.find("span", class_="medium")
                        if impact_icon:
                            impact = "Medium"

                    event = {
                        "time": time_cell.text.strip() if time_cell else "",
                        "currency": currency_cell.text.strip() if currency_cell else "",
                        "title": event_cell.text.strip() if event_cell else "",
                        "impact": impact,
                        "actual": actual_cell.text.strip() if actual_cell and actual_cell.text.strip() else None,
                        "forecast": forecast_cell.text.strip() if forecast_cell and forecast_cell.text.strip() else None,
                        "previous": previous_cell.text.strip() if previous_cell and previous_cell.text.strip() else None
                    }
                    
                    events.append(event)
                except Exception as e:
                    logger.error(f"Error parsing row: {e}")
                    continue

            logger.info(f"Successfully scraped {len(events)} events")
            return events

        except Exception as e:
            logger.error(f"Error scraping calendar: {e}")
            raise
