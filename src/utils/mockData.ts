
import { Trade, EconomicEvent, DailySummary, PerformanceMetrics } from '../types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO, addDays } from 'date-fns';

// Sample currency pairs
export const currencyPairs = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD',
  'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'BTC/USD', 'ETH/USD', 'XRP/USD'
];

// Generate random trades for the current month
export const generateMockTrades = (): Trade[] => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const trades: Trade[] = [];
  
  days.forEach((day, index) => {
    // Generate 0-3 trades for random days
    if (Math.random() > 0.5) {
      const numTrades = Math.floor(Math.random() * 3);
      for (let i = 0; i < numTrades; i++) {
        const symbol = currencyPairs[Math.floor(Math.random() * currencyPairs.length)];
        const entryPrice = parseFloat((Math.random() * 100).toFixed(4));
        const exitPrice = parseFloat((entryPrice * (0.8 + Math.random() * 0.4)).toFixed(4));
        const lotSize = parseFloat((Math.random() * 10).toFixed(2));
        const direction = Math.random() > 0.5 ? 'buy' : 'sell';
        const pnl = direction === 'buy' 
          ? parseFloat(((exitPrice - entryPrice) * lotSize * 100).toFixed(2))
          : parseFloat(((entryPrice - exitPrice) * lotSize * 100).toFixed(2));
        
        trades.push({
          id: `trade-${index}-${i}`,
          date: day,
          symbol,
          entryPrice,
          exitPrice,
          lotSize,
          pnl,
          direction,
          notes: `${pnl > 0 ? 'Profitable' : 'Losing'} trade on ${symbol}`
        });
      }
    }
  });
  
  return trades;
};

// Generate daily summaries from trades
export const generateDailySummaries = (trades: Trade[]): DailySummary[] => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTrades = trades.filter(t => 
      format(t.date, 'yyyy-MM-dd') === dayStr
    );
    
    const totalPnl = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    let status: 'profit' | 'loss' | 'neutral' | 'no-trade' = 'no-trade';
    
    if (dayTrades.length === 0) {
      status = 'no-trade';
    } else if (totalPnl > 0) {
      status = 'profit';
    } else if (totalPnl < 0) {
      status = 'loss';
    } else {
      status = 'neutral';
    }
    
    return {
      date: day,
      status,
      trades: dayTrades,
      totalPnl
    };
  });
};

// Calculate performance metrics
export const calculatePerformanceMetrics = (trades: Trade[]): PerformanceMetrics => {
  if (trades.length === 0) {
    return {
      totalPnl: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      maxDrawdown: 0,
      profitFactor: 0,
    };
  }
  
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winningTrades = trades.filter(trade => trade.pnl > 0);
  const losingTrades = trades.filter(trade => trade.pnl < 0);
  
  const winRate = winningTrades.length / trades.length * 100;
  
  const averageWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length 
    : 0;
    
  const averageLoss = losingTrades.length > 0 
    ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length)
    : 0;
  
  // Calculate drawdown (simplified)
  let maxDrawdown = 0;
  let peak = 0;
  let balance = 0;
  
  trades.forEach(trade => {
    balance += trade.pnl;
    if (balance > peak) {
      peak = balance;
    }
    const drawdown = peak - balance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  const totalGain = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
  const profitFactor = totalLoss > 0 ? totalGain / totalLoss : totalGain;
  
  return {
    totalPnl,
    winRate,
    averageWin,
    averageLoss,
    maxDrawdown,
    profitFactor: parseFloat(profitFactor.toFixed(2)),
  };
};

// Generate mock economic events
export const generateMockEvents = (): EconomicEvent[] => {
  const today = new Date();
  const events: EconomicEvent[] = [];
  
  for (let i = -2; i <= 10; i++) {
    const date = addDays(today, i);
    const impactLevels: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'];
    
    const numEvents = 1 + Math.floor(Math.random() * 3);
    
    for (let j = 0; j < numEvents; j++) {
      const impact = impactLevels[Math.floor(Math.random() * impactLevels.length)];
      const currency = currencies[Math.floor(Math.random() * currencies.length)];
      
      const titles = {
        'USD': ['Non-Farm Payroll', 'GDP', 'CPI', 'FOMC Statement', 'Retail Sales'],
        'EUR': ['ECB Rate Decision', 'German IFO', 'CPI Flash Estimate', 'Manufacturing PMI'],
        'GBP': ['BOE Rate Decision', 'UK Employment Report', 'CPI', 'Retail Sales'],
        'JPY': ['BOJ Outlook Report', 'Monetary Policy Statement', 'GDP', 'Trade Balance'],
        'AUD': ['Employment Change', 'RBA Rate Decision', 'CPI', 'Retail Sales'],
        'CAD': ['BOC Rate Decision', 'Employment Change', 'CPI', 'Retail Sales'],
        'CHF': ['SNB Rate Decision', 'CPI', 'Retail Sales', 'GDP']
      };
      
      const title = titles[currency as keyof typeof titles][Math.floor(Math.random() * titles[currency as keyof typeof titles].length)];
      const forecast = (Math.random() * 5).toFixed(1) + '%';
      const previous = (Math.random() * 5).toFixed(1) + '%';
      const actual = i < 0 ? (Math.random() * 5).toFixed(1) + '%' : undefined;
      
      events.push({
        id: `event-${i}-${j}`,
        title,
        date: new Date(date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60))),
        impact,
        forecast,
        previous,
        actual,
        currency,
        description: `${currency} ${title} data release`
      });
    }
  }
  
  return events;
};
