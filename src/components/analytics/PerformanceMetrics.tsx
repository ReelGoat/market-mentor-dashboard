
import React from 'react';
import { PerformanceMetrics as Metrics } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetricsProps {
  metrics: Metrics;
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      <Card className="bg-cardDark border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total P&L
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn(
            "text-2xl font-bold",
            metrics.totalPnl > 0 ? "text-profit" : metrics.totalPnl < 0 ? "text-loss" : ""
          )}>
            {metrics.totalPnl > 0 ? '+' : ''}{metrics.totalPnl.toFixed(2)} USD
          </div>
          <CardDescription>Overall performance</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="bg-cardDark border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Win Rate
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.winRate.toFixed(1)}%
          </div>
          <CardDescription>Percentage of winning trades</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="bg-cardDark border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Profit Factor
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.profitFactor.toFixed(2)}
          </div>
          <CardDescription>Gain to loss ratio</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="bg-cardDark border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Average Win
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-profit" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-profit">
            {metrics.averageWin.toFixed(2)} USD
          </div>
          <CardDescription>Average winning trade</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="bg-cardDark border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Average Loss
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-loss" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-loss">
            {metrics.averageLoss.toFixed(2)} USD
          </div>
          <CardDescription>Average losing trade</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="bg-cardDark border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Max Drawdown
          </CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-loss">
            {(metrics.maxDrawdown || 0).toFixed(2)} USD
          </div>
          <CardDescription>Maximum capital drawdown</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
