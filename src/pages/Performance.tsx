
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  generateMockTrades, 
  calculatePerformanceMetrics 
} from '@/utils/mockData';

const Performance: React.FC = () => {
  // Generate mock trades
  const trades = generateMockTrades();
  const metrics = calculatePerformanceMetrics(trades);
  
  // Group trades by symbol for symbol performance
  const symbolPerformance: {
    [symbol: string]: {
      totalTrades: number;
      winningTrades: number;
      losingTrades: number;
      totalPnl: number;
      winRate: number;
    }
  } = {};
  
  trades.forEach(trade => {
    if (!symbolPerformance[trade.symbol]) {
      symbolPerformance[trade.symbol] = {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalPnl: 0,
        winRate: 0
      };
    }
    
    symbolPerformance[trade.symbol].totalTrades += 1;
    if (trade.pnl > 0) {
      symbolPerformance[trade.symbol].winningTrades += 1;
    } else if (trade.pnl < 0) {
      symbolPerformance[trade.symbol].losingTrades += 1;
    }
    symbolPerformance[trade.symbol].totalPnl += trade.pnl;
  });
  
  // Calculate win rate
  Object.keys(symbolPerformance).forEach(symbol => {
    const { totalTrades, winningTrades } = symbolPerformance[symbol];
    symbolPerformance[symbol].winRate = (winningTrades / totalTrades) * 100;
  });
  
  // Sort symbols by total P&L
  const sortedSymbols = Object.keys(symbolPerformance).sort(
    (a, b) => symbolPerformance[b].totalPnl - symbolPerformance[a].totalPnl
  );

  // Get recent trades
  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Performance Analytics</h1>
        
        <PerformanceMetrics metrics={metrics} className="mb-6" />
        
        <PerformanceChart trades={trades} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-cardDark border-border">
            <CardHeader>
              <CardTitle>Symbol Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Trades</TableHead>
                      <TableHead>Win Rate</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSymbols.length > 0 ? (
                      sortedSymbols.map((symbol) => (
                        <TableRow key={symbol}>
                          <TableCell className="font-medium">{symbol}</TableCell>
                          <TableCell>{symbolPerformance[symbol].totalTrades}</TableCell>
                          <TableCell>{symbolPerformance[symbol].winRate.toFixed(1)}%</TableCell>
                          <TableCell className={cn(
                            "text-right font-medium",
                            symbolPerformance[symbol].totalPnl > 0 
                              ? "text-profit" 
                              : symbolPerformance[symbol].totalPnl < 0 
                                ? "text-loss" 
                                : ""
                          )}>
                            {symbolPerformance[symbol].totalPnl > 0 ? '+' : ''}
                            {symbolPerformance[symbol].totalPnl.toFixed(2)} USD
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No symbol performance data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-cardDark border-border">
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrades.length > 0 ? (
                      recentTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell>{format(new Date(trade.date), 'MMM d')}</TableCell>
                          <TableCell className="font-medium">{trade.symbol}</TableCell>
                          <TableCell>{trade.lotSize.toFixed(2)}</TableCell>
                          <TableCell className={cn(
                            "text-right font-medium",
                            trade.pnl > 0 ? "text-profit" : trade.pnl < 0 ? "text-loss" : ""
                          )}>
                            {trade.pnl > 0 ? '+' : ''}
                            {trade.pnl.toFixed(2)} USD
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No recent trades available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Performance;
