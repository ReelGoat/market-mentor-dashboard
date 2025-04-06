
import { EconomicEvent, MarketCategory } from '@/types';
import { fetchEconomicEvents as fetchForexFactoryEvents } from './forexFactoryService';
import { fetchBabyPipsEvents } from './babyPipsService';
import { toast } from 'sonner';

// Helper function to categorize events based on currency and title
const categorizeEvent = (event: EconomicEvent): MarketCategory[] => {
  const categories: MarketCategory[] = [];
  const title = event.title.toLowerCase();
  const currency = event.currency.toLowerCase();
  
  // Forex related events (most currency events)
  if (['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'nzd'].includes(currency)) {
    categories.push('forex');
  }
  
  // Metals related
  if (title.includes('gold') || title.includes('silver') || title.includes('copper') || 
      title.includes('platinum') || title.includes('palladium') || 
      title.includes('metal') || title.includes('xau') || title.includes('xag')) {
    categories.push('metals');
  }
  
  // Crypto related
  if (title.includes('crypto') || title.includes('bitcoin') || title.includes('btc') || 
      title.includes('ethereum') || title.includes('eth') || title.includes('blockchain') || 
      title.includes('digital currency') || currency === 'btc' || currency === 'eth') {
    categories.push('crypto');
  }
  
  // Indices related
  if (title.includes('index') || title.includes('s&p') || title.includes('nasdaq') || 
      title.includes('dow') || title.includes('dax') || title.includes('ftse') || 
      title.includes('nikkei') || title.includes('hang seng')) {
    categories.push('indices');
  }
  
  // Commodities
  if (title.includes('oil') || title.includes('gas') || title.includes('crude') || 
      title.includes('commodity') || title.includes('natural gas') || 
      title.includes('wti') || title.includes('brent')) {
    categories.push('commodities');
  }
  
  // If no categories assigned, mark as other
  if (categories.length === 0) {
    categories.push('other');
  }
  
  return categories;
};

// Mock data provider for Investing.com
const fetchInvestingComEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Note: In a real implementation, this would use their API or scrape the site
    // For now, we'll simulate it with mock data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    const threeDay = new Date(today);
    threeDay.setDate(threeDay.getDate() + 3);
    
    const fourthDay = new Date(today);
    fourthDay.setDate(fourthDay.getDate() + 4);
    
    return [
      {
        id: 'investing-1',
        title: 'GDP Growth Rate',
        date: tomorrow,
        impact: 'high',
        forecast: '0.3%',
        previous: '0.2%',
        currency: 'EUR',
        description: 'Quarter-over-quarter GDP growth rate',
        source: 'Investing.com'
      },
      {
        id: 'investing-2',
        title: 'Unemployment Rate',
        date: today,
        impact: 'medium',
        forecast: '3.7%',
        previous: '3.8%',
        currency: 'USD',
        description: 'Percentage of unemployed workers in the labor force',
        source: 'Investing.com'
      },
      {
        id: 'investing-3',
        title: 'Gold Price Forecast',
        date: dayAfter,
        impact: 'medium',
        forecast: '$2,345',
        previous: '$2,320',
        currency: 'XAU',
        description: 'Monthly gold price forecast',
        source: 'Investing.com'
      },
      {
        id: 'investing-4',
        title: 'Bitcoin Adoption Index',
        date: threeDay,
        impact: 'low',
        forecast: '68.5',
        previous: '67.2',
        currency: 'BTC',
        description: 'Global institutional adoption index for Bitcoin',
        source: 'Investing.com'
      },
      {
        id: 'investing-5',
        title: 'S&P 500 Earnings Season',
        date: fourthDay,
        impact: 'high',
        description: 'Aggregate earnings reports from S&P 500 companies',
        currency: 'USD',
        source: 'Investing.com'
      }
    ];
  } catch (error) {
    console.error('Error fetching Investing.com events:', error);
    return [];
  }
};

// Mock data provider for Trading Economics
const fetchTradingEconomicsEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Note: In a real implementation, this would use their API or scrape the site
    const today = new Date();
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const threeDay = new Date(today);
    threeDay.setDate(threeDay.getDate() + 3);
    
    const fiveDay = new Date(today);
    fiveDay.setDate(fiveDay.getDate() + 5);
    
    return [
      {
        id: 'tradingeconomics-1',
        title: 'Consumer Price Index',
        date: dayAfterTomorrow,
        impact: 'high',
        forecast: '2.5%',
        previous: '2.4%',
        currency: 'USD',
        description: 'Year-over-year change in consumer prices',
        source: 'Trading Economics'
      },
      {
        id: 'tradingeconomics-2',
        title: 'Manufacturing PMI',
        date: today,
        impact: 'medium',
        forecast: '52.0',
        previous: '51.5',
        currency: 'GBP',
        description: 'Manufacturing Purchasing Managers Index',
        source: 'Trading Economics'
      },
      {
        id: 'tradingeconomics-3',
        title: 'Silver Futures Report',
        date: threeDay,
        impact: 'medium',
        forecast: '28.5',
        previous: '27.9',
        currency: 'XAG',
        description: 'CFTC Silver speculative net positions',
        source: 'Trading Economics'
      },
      {
        id: 'tradingeconomics-4',
        title: 'DAX 40 Companies Earnings',
        date: fiveDay,
        impact: 'high',
        currency: 'EUR',
        description: 'German DAX 40 index companies quarterly earnings',
        source: 'Trading Economics'
      }
    ];
  } catch (error) {
    console.error('Error fetching Trading Economics events:', error);
    return [];
  }
};

// Mock data provider for FxStreet
const fetchFxStreetEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Note: In a real implementation, this would use their API or scrape the site
    const today = new Date();
    const threeHoursLater = new Date(today);
    threeHoursLater.setHours(threeHoursLater.getHours() + 3);
    
    const twoDay = new Date(today);
    twoDay.setDate(twoDay.getDate() + 2);
    
    const sixDay = new Date(today);
    sixDay.setDate(sixDay.getDate() + 6);
    
    return [
      {
        id: 'fxstreet-1',
        title: 'ECB Interest Rate Decision',
        date: threeHoursLater,
        impact: 'high',
        forecast: '4.25%',
        previous: '4.25%',
        currency: 'EUR',
        description: 'European Central Bank interest rate decision',
        source: 'FxStreet'
      },
      {
        id: 'fxstreet-2',
        title: 'Ethereum Network Update',
        date: twoDay,
        impact: 'high',
        currency: 'ETH',
        description: 'Major update to Ethereum blockchain protocol',
        source: 'FxStreet'
      },
      {
        id: 'fxstreet-3',
        title: 'USD/JPY Technical Analysis',
        date: sixDay,
        impact: 'medium',
        currency: 'JPY',
        description: 'Technical analysis and forecast for USD/JPY pair',
        source: 'FxStreet'
      }
    ];
  } catch (error) {
    console.error('Error fetching FxStreet events:', error);
    return [];
  }
};

// Mock data provider for Barchart
const fetchBarchartEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Note: In a real implementation, this would use their API or scrape the site
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const twoDay = new Date(today);
    twoDay.setDate(twoDay.getDate() + 2);
    
    const fourDay = new Date(today);
    fourDay.setDate(fourDay.getDate() + 4);
    
    return [
      {
        id: 'barchart-1',
        title: 'Non-Farm Payrolls',
        date: nextWeek,
        impact: 'high',
        forecast: '180K',
        previous: '175K',
        currency: 'USD',
        description: 'Change in number of employed people during the previous month',
        source: 'Barchart'
      },
      {
        id: 'barchart-2',
        title: 'NASDAQ Composite Volatility',
        date: twoDay,
        impact: 'medium',
        currency: 'USD',
        description: 'Analysis of NASDAQ index volatility expectations',
        source: 'Barchart'
      },
      {
        id: 'barchart-3',
        title: 'Crude Oil Inventories',
        date: fourDay,
        impact: 'high',
        forecast: '-2.1M',
        previous: '1.4M',
        currency: 'USD',
        description: 'Weekly change in commercial crude oil inventories',
        source: 'Barchart'
      }
    ];
  } catch (error) {
    console.error('Error fetching Barchart events:', error);
    return [];
  }
};

// Mock data provider for NewsAPI
const fetchNewsApiEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Note: In a real implementation, this would use their API
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const threeDay = new Date(today);
    threeDay.setDate(threeDay.getDate() + 3);
    
    const sixDay = new Date(today);
    sixDay.setDate(sixDay.getDate() + 6);
    
    return [
      {
        id: 'newsapi-1',
        title: 'Fed Chair Speech',
        date: tomorrow,
        impact: 'high',
        currency: 'USD',
        description: 'Federal Reserve Chair press conference',
        source: 'NewsAPI'
      },
      {
        id: 'newsapi-2',
        title: 'Crypto Market Regulation News',
        date: threeDay,
        impact: 'high',
        currency: 'BTC',
        description: 'Regulatory updates affecting cryptocurrency markets',
        source: 'NewsAPI'
      },
      {
        id: 'newsapi-3',
        title: 'Nikkei 225 Futures Outlook',
        date: sixDay,
        impact: 'medium',
        currency: 'JPY',
        description: 'Weekly outlook for Nikkei 225 index futures',
        source: 'NewsAPI'
      }
    ];
  } catch (error) {
    console.error('Error fetching NewsAPI events:', error);
    return [];
  }
};

// Aggregate data from all sources
export const fetchAggregatedEconomicEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Fetch from all sources in parallel - prioritize BabyPips if available
    const results = await Promise.allSettled([
      fetchBabyPipsEvents(),
      fetchForexFactoryEvents(),
      // Only use mock data if BabyPips fails
      fetchInvestingComEvents(),
      fetchTradingEconomicsEvents(),
      fetchFxStreetEvents(),
      fetchBarchartEvents(),
      fetchNewsApiEvents()
    ]);
    
    // Collect successful results
    let allEvents: EconomicEvent[] = [];
    let errorCount = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        // Add source name to events that don't have it
        const sourceNames = ['BabyPips', 'ForexFactory', 'Investing.com', 'Trading Economics', 'FxStreet', 'Barchart', 'NewsAPI'];
        const events = result.value.map(event => ({
          ...event,
          source: event.source || sourceNames[index],
          // Add categories based on event details
          categories: event.categories || categorizeEvent({
            ...event,
            source: event.source || sourceNames[index]
          })
        }));
        allEvents = [...allEvents, ...events];
      } else {
        errorCount++;
        console.error(`Error fetching from source ${index}:`, result.reason);
      }
    });
    
    // If BabyPips failed but we have other data, show a warning
    if (results[0].status === 'rejected' && allEvents.length > 0) {
      toast.warning('Failed to fetch data from BabyPips. Using alternative sources.');
    }
    // Warn if all sources failed
    else if (errorCount >= results.length) {
      toast.error('Failed to fetch economic events from all sources.');
    }
    // Warn if some sources failed but not all
    else if (errorCount > 0) {
      toast.warning(`Failed to fetch data from ${errorCount} source${errorCount > 1 ? 's' : ''}`);
    }
    
    // Sort all events by date
    allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return allEvents;
  } catch (error) {
    console.error('Error fetching aggregated economic events:', error);
    toast.error('Failed to fetch economic events');
    return [];
  }
};
