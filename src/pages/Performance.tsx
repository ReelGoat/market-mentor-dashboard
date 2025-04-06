import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateMockTrades, 
  calculatePerformanceMetrics 
} from '@/utils/mockData';
import { fetchTrades } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Performance: React.FC = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    loadTradeData();
  }, [user]);
  
  const loadTradeData = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const tradesData = await fetchTrades();
        if (tradesData && tradesData.length > 0) {
          setTrades(tradesData);
          toast.success("Loaded trade data from your journal");
        } else {
          setTrades(generateMockTrades());
          toast.info("Using sample trade data. Add trades in your Journal!");
        }
      } else {
        setTrades(generateMockTrades());
      }
    } catch (error) {
      console.error("Error loading trades:", error);
      toast.error("Could not load trade data, using sample data");
      setTrades(generateMockTrades());
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearPerformanceData = () => {
    setTrades([]);
    toast.info("Performance data cleared");
  };
  
  const metrics = calculatePerformanceMetrics(trades);
  
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
  
  Object.keys(symbolPerformance).forEach(symbol => {
    const { totalTrades, winningTrades } = symbolPerformance[symbol];
    symbolPerformance[symbol].winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  });
  
  const sortedSymbols = Object.keys(symbolPerformance).sort(
    (a, b) => symbolPerformance[b].totalPnl - symbolPerformance[a].totalPnl
  );

  const sessionPerformance: {
    [session: string]: {
      totalTrades: number;
      winningTrades: number;
      losingTrades: number;
      totalPnl: number;
      winRate: number;
      averagePnl: number;
    }
  } = {};
  
  trades.forEach(trade => {
    const session = trade.session || 'Unknown';
    
    if (!sessionPerformance[session]) {
      sessionPerformance[session] = {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalPnl: 0,
        winRate: 0,
        averagePnl: 0
      };
    }
    
    sessionPerformance[session].totalTrades += 1;
    if (trade.pnl > 0) {
      sessionPerformance[session].winningTrades += 1;
    } else if (trade.pnl < 0) {
      sessionPerformance[session].losingTrades += 1;
    }
    sessionPerformance[session].totalPnl += trade.pnl;
  });
  
  Object.keys(sessionPerformance).forEach(session => {
    const { totalTrades, winningTrades, totalPnl } = sessionPerformance[session];
    sessionPerformance[session].winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    sessionPerformance[session].averagePnl = totalTrades > 0 ? totalPnl / totalTrades : 0;
  });
  
  const sortedSessions = Object.keys(sessionPerformance).sort(
    (a, b) => sessionPerformance[b].totalPnl - sessionPerformance[a].totalPnl
  );

  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Performance Analytics</h1>
          <div className="flex space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all performance data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all performance analysis data in this view. 
                    Your actual trades in the Trading Journal will not be affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={clearPerformanceData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              variant="outline" 
              onClick={loadTradeData} 
              className="gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
              <p>Loading performance data...</p>
            </div>
          </div>
        ) : trades.length === 0 ? (
          <div className="bg-cardDark rounded-lg p-8 text-center card-gradient flex flex-col items-center justify-center h-[50vh]">
            <p className="text-xl mb-4">No performance data available</p>
            <p className="text-muted-foreground mb-6">
              Add trades in your Trading Journal to see performance analytics
            </p>
            <Button onClick={loadTradeData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Load Sample Data
            </Button>
          </div>
        ) : (
          <>
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
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Session</TableHead>
                          <TableHead className="text-right">P&L</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTrades.length > 0 ? (
                          recentTrades.map((trade) => (
                            <TableRow key={trade.id}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{format(new Date(trade.date), 'MMM d')}</span>
                                  <span className="text-xs text-muted-foreground">{format(new Date(trade.date), 'HH:mm')} UTC</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{trade.symbol}</TableCell>
                              <TableCell>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {trade.session || 'Unknown'}
                                </span>
                              </TableCell>
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
            
            <Card className="bg-cardDark border-border">
              <CardHeader>
                <CardTitle>Session Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trading Session</TableHead>
                        <TableHead>Trades</TableHead>
                        <TableHead>Win Rate</TableHead>
                        <TableHead>Avg P&L</TableHead>
                        <TableHead className="text-right">Total P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedSessions.length > 0 ? (
                        sortedSessions.map((session) => (
                          <TableRow key={session}>
                            <TableCell className="font-medium">
                              <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {session}
                              </span>
                            </TableCell>
                            <TableCell>{sessionPerformance[session].totalTrades}</TableCell>
                            <TableCell>{sessionPerformance[session].winRate.toFixed(1)}%</TableCell>
                            <TableCell className={cn(
                              sessionPerformance[session].averagePnl > 0 
                                ? "text-profit" 
                                : sessionPerformance[session].averagePnl < 0 
                                  ? "text-loss" 
                                  : ""
                            )}>
                              {sessionPerformance[session].averagePnl > 0 ? '+' : ''}
                              {sessionPerformance[session].averagePnl.toFixed(2)} USD
                            </TableCell>
                            <TableCell className={cn(
                              "text-right font-medium",
                              sessionPerformance[session].totalPnl > 0 
                                ? "text-profit" 
                                : sessionPerformance[session].totalPnl < 0 
                                  ? "text-loss" 
                                  : ""
                            )}>
                              {sessionPerformance[session].totalPnl > 0 ? '+' : ''}
                              {sessionPerformance[session].totalPnl.toFixed(2)} USD
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No session performance data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Performance;
