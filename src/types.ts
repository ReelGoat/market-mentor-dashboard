
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
}

// Economic Event Type
export interface EconomicEvent {
  id: string;
  title: string;
  date: Date;
  impact: 'high' | 'medium' | 'low';
  forecast?: string;
  previous?: string;
  actual?: string;
  currency: string;
  description?: string;
}

// Filter options
export interface FilterOptions {
  dateRange: {
    from: Date;
    to: Date;
  };
  symbols?: string[];
  impactLevels?: ('high' | 'medium' | 'low')[];
  search?: string;
}
