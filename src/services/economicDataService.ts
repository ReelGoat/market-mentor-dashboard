
import { EconomicEvent } from '@/types';
import { fetchEconomicEvents as fetchForexFactoryEvents } from './forexFactoryService';
import { toast } from 'sonner';

// Mock data provider for Investing.com
const fetchInvestingComEvents = async (): Promise<EconomicEvent[]> => {
  try {
    // Note: In a real implementation, this would use their API or scrape the site
    // For now, we'll simulate it with mock data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
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
    
    return [
      {
        id: 'newsapi-1',
        title: 'Fed Chair Speech',
        date: tomorrow,
        impact: 'high',
        currency: 'USD',
        description: 'Federal Reserve Chair press conference',
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
    // Fetch from all sources in parallel
    const results = await Promise.allSettled([
      fetchForexFactoryEvents(),
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
        // Add source name to events that don't have it (like ForexFactory)
        const sourceNames = ['ForexFactory', 'Investing.com', 'Trading Economics', 'FxStreet', 'Barchart', 'NewsAPI'];
        const events = result.value.map(event => ({
          ...event,
          source: event.source || sourceNames[index]
        }));
        allEvents = [...allEvents, ...events];
      } else {
        errorCount++;
        console.error(`Error fetching from source ${index}:`, result.reason);
      }
    });
    
    // Warn if some sources failed
    if (errorCount > 0) {
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
