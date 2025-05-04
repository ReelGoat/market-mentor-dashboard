
import { Trade, DailySummary, PerformanceMetrics } from '../types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

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
export const calculatePerformanceMetrics = (trades: Trade[], initialBalance = 10000): PerformanceMetrics => {
  if (!trades || trades.length === 0) {
    return {
      totalPnl: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      maxDrawdown: 0,
      profitFactor: 0,
      currentBalance: initialBalance,
      initialBalance: initialBalance,
      balanceChange: 0
    };
  }

  let totalPnl = 0;
  let winCount = 0;
  let lossCount = 0;
  let totalWins = 0;
  let totalLosses = 0;
  const pnlChanges: number[] = [];
  
  // Track session performance
  const sessionPerformance: {[session: string]: {count: number, pnl: number, wins: number}} = {};
  
  // Process all trades
  trades.forEach(trade => {
    const pnl = trade.pnl;
    totalPnl += pnl;
    
    if (pnl > 0) {
      winCount++;
      totalWins += pnl;
    } else if (pnl < 0) {
      lossCount++;
      totalLosses += Math.abs(pnl);
    }
    
    pnlChanges.push(pnl);
    
    // Track session data
    const session = trade.session || 'Unknown';
    if (!sessionPerformance[session]) {
      sessionPerformance[session] = {
        count: 0,
        pnl: 0,
        wins: 0
      };
    }
    
    sessionPerformance[session].count++;
    sessionPerformance[session].pnl += pnl;
    if (pnl > 0) {
      sessionPerformance[session].wins++;
    }
  });
  
  // Calculate max drawdown
  let peak = 0;
  let maxDrawdown = 0;
  let cumulativePnl = 0;
  
  pnlChanges.forEach(change => {
    cumulativePnl += change;
    
    if (cumulativePnl > peak) {
      peak = cumulativePnl;
    } else {
      const drawdown = peak - cumulativePnl;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  });
  
  // Calculate win rate
  const winRate = trades.length > 0 ? (winCount / trades.length) * 100 : 0;
  
  // Calculate average win/loss
  const averageWin = winCount > 0 ? totalWins / winCount : 0;
  const averageLoss = lossCount > 0 ? totalLosses / lossCount : 0;
  
  // Calculate profit factor
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;

  // Calculate session win rates
  const formattedSessionPerformance: {[session: string]: {count: number, pnl: number, winRate: number}} = {};
  
  Object.keys(sessionPerformance).forEach(session => {
    const { count, pnl, wins } = sessionPerformance[session];
    formattedSessionPerformance[session] = {
      count,
      pnl,
      winRate: count > 0 ? (wins / count) * 100 : 0
    };
  });
  
  // Calculate current balance and balance change
  const currentBalance = initialBalance + totalPnl;
  const balanceChange = initialBalance > 0 ? (totalPnl / initialBalance) * 100 : 0;
  
  return {
    totalPnl,
    winRate,
    averageWin,
    averageLoss,
    maxDrawdown,
    profitFactor,
    sessionPerformance: formattedSessionPerformance,
    currentBalance,
    initialBalance,
    balanceChange
  };
};
