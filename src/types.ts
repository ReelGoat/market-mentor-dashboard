
// Update the Trade interface to include a setupId field
export interface Trade {
  id: string;
  date: Date;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  pnl: number;
  direction: 'buy' | 'sell';
  notes?: string;
  screenshot?: string;
  session?: string;
  setupId?: string; // Add reference to the setup
}

export type MarketCategory = 'forex' | 'crypto' | 'stocks' | 'indices' | 'commodities' | 'metals';

export interface MarketSymbol {
  symbol: string;
  category: string;
  name: string;
}

export interface DailySummary {
  date: Date;
  trades: number;
  pnl: number;
  status: 'profit' | 'loss' | 'neutral' | 'no-trade';
}

export interface PerformanceMetrics {
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  bestTrade?: number;
  worstTrade?: number;
  numberOfTrades: number;
  profitableTrades?: number;
  losingTrades?: number;
  maxDrawdown?: number;
  sessionPerformance?: {[session: string]: {count: number, pnl: number, winRate: number}};
  currentBalance?: number;
  initialBalance?: number;
  balanceChange?: number;
}

export interface TradingSettings {
  initialBalance: number;
  currency: string;
}
