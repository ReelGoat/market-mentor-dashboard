
import { toast } from 'sonner';

// Currency strength data type
export interface CurrencyStrength {
  currency: string;
  strength: number;
  change: number; // Positive = strengthening, negative = weakening
}

// Mock data generator (since we can't directly pull from BabyPips in a client-side app)
export const fetchCurrencyStrength = async (): Promise<CurrencyStrength[]> => {
  try {
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
