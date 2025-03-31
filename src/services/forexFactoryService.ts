
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
  // Create an array to store the economic events
  const events: EconomicEvent[] = [];
  
  try {
    // Parse date strings
    const dateRegex = /<span class="date">([^<]+)<\/span>/g;
    const dateMatches = [...html.matchAll(dateRegex)];
    
    // Parse calendar rows
    const rowRegex = /<tr class="calendar_row.*?<\/tr>/gs;
    const rows = [...html.matchAll(rowRegex)].map(match => match[0]);

    let currentDate = new Date();
    
    // Process each row
    rows.forEach((row, index) => {
      // Check if the row contains a new date
      const dateElement = row.match(/<td class="calendar__date.*?>(.*?)<\/td>/s);
      if (dateElement && dateElement[1] && !dateElement[1].includes("&nbsp;")) {
        const dateText = dateElement[1].replace(/<[^>]*>/g, '').trim();
        if (dateText) {
          // Extract month and day
          const monthMatch = dateText.match(/([A-Za-z]{3})/);
          const dayMatch = dateText.match(/(\d{1,2})/);
          
          if (monthMatch && dayMatch) {
            const month = getMonthNumber(monthMatch[1]);
            const day = parseInt(dayMatch[1], 10);
            
            if (!isNaN(day) && month !== -1) {
              currentDate = new Date(new Date().getFullYear(), month, day);
            }
          }
        }
      }
      
      // Extract time
      const timeMatch = row.match(/<td class="calendar__time.*?>(.*?)<\/td>/s);
      let timeText = '';
      if (timeMatch && timeMatch[1]) {
        timeText = timeMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      // Set time on current date
      const eventDate = new Date(currentDate);
      if (timeText && timeText !== 'All Day' && !timeText.includes('Tentative')) {
        // Parse time in format like '8:30am'
        const timeRegex = /(\d+):?(\d+)?([ap]m)?/i;
        const timeMatches = timeText.match(timeRegex);
        
        if (timeMatches) {
          let hours = parseInt(timeMatches[1], 10);
          const minutes = timeMatches[2] ? parseInt(timeMatches[2], 10) : 0;
          const ampm = timeMatches[3]?.toLowerCase();
          
          // Convert to 24-hour format if needed
          if (ampm === 'pm' && hours < 12) {
            hours += 12;
          } else if (ampm === 'am' && hours === 12) {
            hours = 0;
          }
          
          if (!isNaN(hours) && !isNaN(minutes)) {
            eventDate.setHours(hours, minutes);
          }
        }
      }
      
      // Extract currency
      const currencyMatch = row.match(/<td class="calendar__currency.*?>(.*?)<\/td>/s);
      let currency = '';
      if (currencyMatch && currencyMatch[1]) {
        currency = currencyMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      // Extract impact
      const impactMatch = row.match(/<td class="calendar__impact.*?>(.*?)<\/td>/s);
      let impact: 'high' | 'medium' | 'low' = 'low';
      
      if (impactMatch) {
        if (impactMatch[0].includes('high')) {
          impact = 'high';
        } else if (impactMatch[0].includes('medium')) {
          impact = 'medium';
        }
      }
      
      // Extract event title
      const titleMatch = row.match(/<td class="calendar__event.*?>(.*?)<\/td>/s);
      let title = '';
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      // Extract forecast, previous, and actual
      const forecastMatch = row.match(/<td class="calendar__forecast.*?>(.*?)<\/td>/s);
      const previousMatch = row.match(/<td class="calendar__previous.*?>(.*?)<\/td>/s);
      const actualMatch = row.match(/<td class="calendar__actual.*?>(.*?)<\/td>/s);
      
      const forecast = forecastMatch && forecastMatch[1] ? forecastMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      const previous = previousMatch && previousMatch[1] ? previousMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      const actual = actualMatch && actualMatch[1] ? actualMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      
      // Only add valid events
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
    
    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    
  } catch (error) {
    console.error('Error parsing ForexFactory HTML:', error);
  }
  
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
