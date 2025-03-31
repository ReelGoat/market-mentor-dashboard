
import { EconomicEvent } from '@/types';

// We'll need to parse the HTML from ForexFactory since they don't provide a public API
export const fetchEconomicEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Use a CORS proxy to access the Forex Factory website
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const forexFactoryUrl = 'https://www.forexfactory.com/calendar.php?week=this';
    const response = await fetch(`${proxyUrl}${encodeURIComponent(forexFactoryUrl)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch economic events');
    }
    
    const html = await response.text();
    
    // Parse the HTML to extract the economic events
    const events = parseForexFactoryHtml(html);
    return events;
  } catch (error) {
    console.error('Error fetching economic events:', error);
    throw error;
  }
};

// Function to parse the HTML and extract the economic events
const parseForexFactoryHtml = (html: string): EconomicEvent[] => {
  // For now, return an empty array as parsing HTML is complex
  // We'll implement this in a real-world scenario using a DOM parser
  // Here's a simplified implementation:
  
  const events: EconomicEvent[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Select all calendar event rows
  const eventRows = doc.querySelectorAll('.calendar_row');
  
  let currentDate = new Date();
  
  eventRows.forEach((row, index) => {
    // Extract date if available
    const dateElement = row.querySelector('.calendar__date');
    if (dateElement && dateElement.textContent?.trim()) {
      const dateText = dateElement.textContent.trim();
      // Parse date (this is simplified)
      const dateParts = dateText.split(' ');
      if (dateParts.length > 1) {
        const month = getMonthNumber(dateParts[0]);
        const day = parseInt(dateParts[1], 10);
        if (!isNaN(day) && month !== -1) {
          currentDate = new Date(new Date().getFullYear(), month, day);
        }
      }
    }
    
    // Extract time
    const timeElement = row.querySelector('.calendar__time');
    const timeText = timeElement?.textContent?.trim() || '';
    
    // Set time on current date
    const eventDate = new Date(currentDate);
    if (timeText && timeText !== 'All Day') {
      const [hours, minutes] = timeText.split(':').map(part => parseInt(part, 10));
      if (!isNaN(hours) && !isNaN(minutes)) {
        eventDate.setHours(hours, minutes);
      }
    }
    
    // Extract currency
    const currencyElement = row.querySelector('.calendar__currency');
    const currency = currencyElement?.textContent?.trim() || '';
    
    // Extract impact
    const impactElement = row.querySelector('.calendar__impact');
    const impactClass = impactElement?.className || '';
    let impact: 'high' | 'medium' | 'low' = 'low';
    if (impactClass.includes('high')) {
      impact = 'high';
    } else if (impactClass.includes('medium')) {
      impact = 'medium';
    }
    
    // Extract event title
    const titleElement = row.querySelector('.calendar__event');
    const title = titleElement?.textContent?.trim() || '';
    
    // Extract forecast, previous, and actual
    const forecastElement = row.querySelector('.calendar__forecast');
    const previousElement = row.querySelector('.calendar__previous');
    const actualElement = row.querySelector('.calendar__actual');
    
    const forecast = forecastElement?.textContent?.trim() || '';
    const previous = previousElement?.textContent?.trim() || '';
    const actual = actualElement?.textContent?.trim() || '';
    
    if (title && currency) {
      events.push({
        id: `event-${index}`,
        title,
        date: eventDate,
        impact,
        forecast,
        previous,
        actual,
        currency,
        description: `${currency} ${title} data release`
      });
    }
  });
  
  return events;
};

// Helper function to convert month name to number
const getMonthNumber = (monthName: string): number => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());
};
