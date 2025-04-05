import { toast } from 'sonner';

// Currency strength data type
export interface CurrencyStrength {
  currency: string;
  strength: number;
  change: number; // Positive = strengthening, negative = weakening
}

// Function to check if forex markets are currently open
export const isForexMarketOpen = (): boolean => {
  // Get current date and time in UTC
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const hours = now.getUTCHours();
  
  console.log(`Checking market open status - Day: ${day}, Hour: ${hours} UTC`);
  
  // Forex markets are closed on weekends
  if (day === 0 || day === 6) {
    console.log("Markets closed: Weekend");
    return false;
  }

  // Special case for Friday - markets close earlier (around 21:00 UTC)
  if (day === 5 && hours >= 21) {
    console.log("Markets closed: Friday after hours");
    return false;
  }

  // Special case for Sunday - markets open later (around 21:00 UTC in winter, 22:00 UTC in summer)
  if (day === 0 && hours < 21) {
    console.log("Markets closed: Sunday before opening");
    return false;
  }
  
  // Otherwise markets are generally open
  console.log("Markets open");
  return true;
}

// Mock data generator (since we can't directly pull from BabyPips in a client-side app)
export const fetchCurrencyStrength = async (): Promise<CurrencyStrength[]> => {
  try {
    // First check if markets are open
    if (!isForexMarketOpen()) {
      // Return empty array to indicate markets are closed
      return [];
    }
    
    // In a real application, you would fetch this data from an API
    // For demo purposes, we'll generate realistic-looking mock data
    
    // Define base values that will be slightly adjusted each time
    const baseValues: Record<string, number> = {
      'USD': 70 + Math.random() * 12,
      'EUR': 65 + Math.random() * 15,
      'GBP': 62 + Math.random() * 14,
      'JPY': 55 + Math.random() * 20,
      'AUD': 58 + Math.random() * 18,
      'CAD': 60 + Math.random() * 16,
      'CHF': 63 + Math.random() * 14,
      'NZD': 56 + Math.random() * 17
    };

    // Create a small change from previous value (-2 to +2)
    const createChange = () => (Math.random() * 4) - 2;
    
    // Map to our interface
    const currencies: CurrencyStrength[] = Object.entries(baseValues).map(([currency, strength]) => {
      const change = createChange();
      return {
        currency,
        strength: Math.min(100, Math.max(0, strength)), // Keep between 0-100
        change
      };
    });

    // Sort by strength (descending)
    return currencies.sort((a, b) => b.strength - a.strength);
  } catch (error) {
    console.error("Failed to fetch currency strength data", error);
    toast.error("Failed to fetch currency strength data");
    return [];
  }
};
