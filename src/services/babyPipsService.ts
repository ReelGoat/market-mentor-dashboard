
import { EconomicEvent, MarketCategory } from '@/types';

/**
 * Fetches economic calendar events from BabyPips using a CORS proxy
 */
export const fetchBabyPipsEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Use CORS proxy to access the BabyPips calendar
    const response = await fetch('https://corsproxy.io/?https%3A%2F%2Fwww.babypips.com%2Feconomic-calendar');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch BabyPips data: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse the events from the HTML
    return parseEventsFromHtml(html);
  } catch (error) {
    console.error('Error fetching BabyPips economic calendar:', error);
    return [];
  }
};

/**
 * Parse economic events from the BabyPips HTML content
 */
const parseEventsFromHtml = (html: string): EconomicEvent[] => {
  const events: EconomicEvent[] = [];
  
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find the event elements - this selector may need adjustment based on BabyPips' actual HTML structure
    const eventElements = doc.querySelectorAll('.economic-calendar-item, .economic-calendar__item');
    
    if (eventElements.length === 0) {
      console.warn('No calendar items found in the BabyPips HTML. The selector may need to be updated.');
    }
    
    // For each event element, extract the data
    eventElements.forEach((element, index) => {
      try {
        // These selectors need to match BabyPips' HTML structure - they may need adjustment
        const titleElement = element.querySelector('.event-title, .event__title');
        const dateElement = element.querySelector('.event-date, .event__date');
        const timeElement = element.querySelector('.event-time, .event__time');
        const currencyElement = element.querySelector('.event-currency, .event__currency');
        const impactElement = element.querySelector('.event-impact, .event__impact');
        const previousElement = element.querySelector('.event-previous, .event__previous');
        const forecastElement = element.querySelector('.event-forecast, .event__forecast');
        const actualElement = element.querySelector('.event-actual, .event__actual');
        
        if (!titleElement || !dateElement) {
          console.warn(`Incomplete data for event at index ${index}, skipping`);
          return;
        }
        
        const title = titleElement.textContent?.trim() || 'Unknown Event';
        const dateText = dateElement.textContent?.trim() || '';
        const timeText = timeElement?.textContent?.trim() || '00:00';
        const currency = currencyElement?.textContent?.trim() || 'Unknown';
        
        // Parse the date and time
        const dateMatch = dateText.match(/(\w+)\s+(\d+),\s+(\d{4})/);
        const date = dateMatch 
          ? new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]} ${timeText}`) 
          : new Date();
        
        // Determine impact level from classes or text
        let impact: 'high' | 'medium' | 'low' = 'low';
        if (impactElement) {
          const impactClass = impactElement.className.toLowerCase();
          const impactText = impactElement.textContent?.toLowerCase() || '';
          
          if (impactClass.includes('high') || impactText.includes('high')) {
            impact = 'high';
          } else if (impactClass.includes('med') || impactText.includes('med')) {
            impact = 'medium';
          }
        }
        
        // Add the event to our list
        events.push({
          id: `babypips-${index}`,
          title,
          date,
          impact,
          currency,
          previous: previousElement?.textContent?.trim() || '',
          forecast: forecastElement?.textContent?.trim() || '',
          actual: actualElement?.textContent?.trim() || '',
          description: '',
          source: 'BabyPips',
          categories: determineCategoriesFromCurrency(currency)
        });
      } catch (err) {
        console.error(`Error parsing event at index ${index}:`, err);
      }
    });
    
  } catch (error) {
    console.error('Error parsing BabyPips HTML:', error);
  }
  
  return events;
};

/**
 * Determine market categories based on currency
 */
const determineCategoriesFromCurrency = (currency: string): MarketCategory[] => {
  const categories: MarketCategory[] = [];
  const currencyLower = currency.toLowerCase();
  
  // Common forex currencies
  if (['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'nzd'].includes(currencyLower)) {
    categories.push('forex');
  }
  
  // Metals
  if (['xau', 'xag', 'gold', 'silver'].includes(currencyLower)) {
    categories.push('metals');
  }
  
  // Crypto
  if (['btc', 'eth', 'crypto'].includes(currencyLower)) {
    categories.push('crypto');
  }
  
  // Indices
  if (['spx', 'dji', 'ndx', 'dax'].includes(currencyLower)) {
    categories.push('indices');
  }
  
  // Commodities
  if (['wti', 'oil', 'gas', 'brent'].includes(currencyLower)) {
    categories.push('commodities');
  }
  
  // Default category if none matched
  if (categories.length === 0) {
    categories.push('other');
  }
  
  return categories;
};
