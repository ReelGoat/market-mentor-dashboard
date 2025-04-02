import { EconomicEvent } from '@/types';

// We need to use a CORS proxy since we're scraping from the browser
const CORS_PROXY = 'https://corsproxy.io/?';
const FOREX_FACTORY_URL = 'https://www.forexfactory.com/calendar.php?week=this';

export const fetchEconomicEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Use the CORS proxy to access the Forex Factory website
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(FOREX_FACTORY_URL)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch economic events: ${response.status} ${response.statusText}`);
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
    // Create a DOM parser to work with the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Get all the calendar rows (each row is an event)
    const rows = doc.querySelectorAll('.calendar_row');
    
    // Keep track of the current date
    let currentDate = new Date();
    
    // Process each row
    rows.forEach((row, index) => {
      try {
        // Check if this row contains a date
        const dateCell = row.querySelector('.calendar__date');
        if (dateCell && dateCell.textContent && dateCell.textContent.trim() !== '') {
          const dateText = dateCell.textContent.trim();
          if (dateText) {
            const parts = dateText.split(' ');
            if (parts.length >= 2) {
              const monthName = parts[0];
              const day = parseInt(parts[1], 10);
              
              if (!isNaN(day)) {
                const month = getMonthNumber(monthName);
                if (month !== -1) {
                  // Set the current date to the parsed date
                  currentDate = new Date(new Date().getFullYear(), month, day);
                }
              }
            }
          }
        }
        
        // Extract time
        const timeCell = row.querySelector('.calendar__time');
        let time = '';
        let eventDate = new Date(currentDate);
        
        if (timeCell) {
          time = timeCell.textContent?.trim() || '';
          
          // Set the time on the current date
          if (time && time !== 'All Day' && !time.includes('Tentative')) {
            const timeMatch = time.match(/(\d+):?(\d+)?([ap]m)?/i);
            
            if (timeMatch) {
              let hours = parseInt(timeMatch[1], 10);
              const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
              const ampm = timeMatch[3]?.toLowerCase();
              
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
        }
        
        // Extract currency
        const currencyCell = row.querySelector('.calendar__currency');
        const currency = currencyCell?.textContent?.trim() || '';
        
        // Extract impact
        const impactCell = row.querySelector('.calendar__impact');
        let impact: 'high' | 'medium' | 'low' = 'low';
        
        if (impactCell) {
          const impactClass = impactCell.className;
          if (impactClass.includes('high')) {
            impact = 'high';
          } else if (impactClass.includes('medium')) {
            impact = 'medium';
          }
        }
        
        // Extract event title
        const titleCell = row.querySelector('.calendar__event');
        const title = titleCell?.textContent?.trim() || '';
        
        // Extract forecast, previous, and actual values
        const forecastCell = row.querySelector('.calendar__forecast');
        const previousCell = row.querySelector('.calendar__previous');
        const actualCell = row.querySelector('.calendar__actual');
        
        const forecast = forecastCell?.textContent?.trim() || '';
        const previous = previousCell?.textContent?.trim() || '';
        const actual = actualCell?.textContent?.trim() || '';
        
        // Only add events with valid data
        if (title && currency) {
          events.push({
            id: `ff-event-${index}`,
            title,
            date: eventDate,
            impact,
            forecast,
            previous,
            actual,
            currency,
            description: `${currency} ${title}`,
            source: 'ForexFactory',
            categories: categorizeEvent(currency, title)
          });
        }
      } catch (rowError) {
        console.error('Error parsing row:', rowError);
      }
    });
    
    // If DOM parsing fails, fallback to regex method
    if (events.length === 0) {
      return parseWithRegex(html);
    }
    
    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    
  } catch (error) {
    console.error('Error parsing ForexFactory HTML with DOM:', error);
    // Fallback to regex method
    return parseWithRegex(html);
  }
  
  return events;
};

// Fallback parser using regex for when DOM parsing doesn't work
const parseWithRegex = (html: string): EconomicEvent[] => {
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
          id: `ff-event-${index}`,
          title,
          date: eventDate,
          impact,
          forecast,
          previous,
          actual,
          currency,
          description: `${currency} ${title}`,
          source: 'ForexFactory',
          categories: categorizeEvent(currency, title)
        });
      }
    });
    
    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    
  } catch (error) {
    console.error('Error parsing ForexFactory HTML with regex:', error);
  }
  
  return events;
};

// Helper function to categorize events based on currency and title
const categorizeEvent = (currency: string, title: string): ('forex' | 'metals' | 'crypto' | 'indices' | 'commodities' | 'other')[] => {
  const categories: ('forex' | 'metals' | 'crypto' | 'indices' | 'commodities' | 'other')[] = [];
  const lowerTitle = title.toLowerCase();
  const lowerCurrency = currency.toLowerCase();
  
  // Forex related events (most currency events)
  if (['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'nzd'].includes(lowerCurrency)) {
    categories.push('forex');
  }
  
  // Metals related
  if (lowerTitle.includes('gold') || lowerTitle.includes('silver') || lowerTitle.includes('copper') || 
      lowerTitle.includes('platinum') || lowerTitle.includes('palladium') || 
      lowerTitle.includes('metal') || lowerCurrency === 'xau' || lowerCurrency === 'xag') {
    categories.push('metals');
  }
  
  // Crypto related
  if (lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('btc') || 
      lowerTitle.includes('ethereum') || lowerTitle.includes('eth') || lowerTitle.includes('blockchain') || 
      lowerTitle.includes('digital currency') || lowerCurrency === 'btc' || lowerCurrency === 'eth') {
    categories.push('crypto');
  }
  
  // Indices related
  if (lowerTitle.includes('index') || lowerTitle.includes('s&p') || lowerTitle.includes('nasdaq') || 
      lowerTitle.includes('dow') || lowerTitle.includes('dax') || lowerTitle.includes('ftse') || 
      lowerTitle.includes('nikkei') || lowerTitle.includes('hang seng')) {
    categories.push('indices');
  }
  
  // Commodities
  if (lowerTitle.includes('oil') || lowerTitle.includes('gas') || lowerTitle.includes('crude') || 
      lowerTitle.includes('commodity') || lowerTitle.includes('natural gas') || 
      lowerTitle.includes('wti') || lowerTitle.includes('brent')) {
    categories.push('commodities');
  }
  
  // If no categories assigned, mark as other
  if (categories.length === 0) {
    categories.push('other');
  }
  
  return categories;
};

// Helper function to convert month name to number
const getMonthNumber = (monthName: string): number => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());
};
