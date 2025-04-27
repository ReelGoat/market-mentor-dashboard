import requests
from bs4 import BeautifulSoup
import asyncio
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
import time

class ForexFactoryScraper:
    def __init__(self):
        self.base_url = "https://www.forexfactory.com/calendar"
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
        ]

    async def scrape_calendar(self) -> List[Dict[str, Any]]:
        try:
            # Add a random delay to avoid detection
            await asyncio.sleep(random.uniform(1, 3))
            
            # Set headers with a random user agent
            headers = {
                "User-Agent": random.choice(self.user_agents),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
            }
            
            # Make the request
            response = requests.get(self.base_url, headers=headers)
            response.raise_for_status()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the calendar table
            table = soup.find("table", class_="calendar__table")
            if not table:
                raise Exception("Calendar table not found")

            events = []
            rows = table.find_all("tr", class_="calendar__row")
            
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
                    impact_icon = impact_cell.find("span", class_="high")
                    impact = "High" if impact_icon else "Low"
                    if not impact_icon:
                        impact_icon = impact_cell.find("span", class_="medium")
                        if impact_icon:
                            impact = "Medium"

                    event = {
                        "time": time_cell.text.strip(),
                        "currency": currency_cell.text.strip(),
                        "title": event_cell.text.strip(),
                        "impact": impact,
                        "actual": actual_cell.text.strip() if actual_cell else None,
                        "forecast": forecast_cell.text.strip() if forecast_cell else None,
                        "previous": previous_cell.text.strip() if previous_cell else None
                    }
                    
                    events.append(event)
                except Exception as e:
                    print(f"Error parsing row: {e}")
                    continue

            return events

        except Exception as e:
            print(f"Error scraping calendar: {e}")
            raise 