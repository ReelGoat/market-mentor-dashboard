
// Trade Types
export interface Trade {
  id: string;
  date: Date;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  pnl: number;
  notes: string;
  screenshot?: string; // Base64 or URL
  direction: 'buy' | 'sell'; // Trade direction
  session?: string; // Trading session (Asian, European, American, Overnight)
}

// Calendar day status
export type DayStatus = 'profit' | 'loss' | 'neutral' | 'no-trade';

// Daily summary type
export interface DailySummary {
  date: Date;
  status: DayStatus;
  trades: Trade[];
  totalPnl: number;
}

// Performance metrics
export interface PerformanceMetrics {
  totalPnl: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  profitFactor: number;
  sessionPerformance?: {[session: string]: {count: number, pnl: number, winRate: number}};
  currentBalance?: number; // Added current balance field
  initialBalance?: number; // Added initial balance field
  balanceChange?: number; // Added balance change field (percentage)
}

// Market categories
export type MarketCategory = 'forex' | 'metals' | 'crypto' | 'indices' | 'commodities' | 'stocks' | 'other';

// Market Symbol
export interface MarketSymbol {
  symbol: string;
  category: MarketCategory;
  name?: string;
}

// User settings for trading
export interface TradingSettings {
  initialBalance: number; // Initial account balance
  currency: string; // Account currency (USD, EUR, etc.)
}
