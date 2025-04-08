
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Wallet, Settings, TrendingUp, ArrowUpRightSquare } from 'lucide-react';

interface BalanceTrackerProps {
  initialBalance: number;
  totalPnl: number;
  currency: string;
  onEditBalance: () => void;
}

const BalanceTracker: React.FC<BalanceTrackerProps> = ({
  initialBalance,
  totalPnl,
  currency,
  onEditBalance
}) => {
  const currentBalance = initialBalance + totalPnl;
  const percentageChange = initialBalance > 0 
    ? (totalPnl / initialBalance) * 100 
    : 0;
  
  return (
    <Card className="bg-cardDark border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Wallet className="h-5 w-5 text-muted-foreground mr-2" />
          <CardTitle className="text-base font-medium">
            Account Balance
          </CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onEditBalance}
          title="Edit Balance Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">
              {currentBalance.toFixed(2)} {currency}
            </div>
            <CardDescription className="text-xs">
              Initial: {initialBalance.toFixed(2)} {currency}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-xl font-bold flex items-center gap-1",
              totalPnl > 0 ? "text-profit" : totalPnl < 0 ? "text-loss" : ""
            )}>
              {totalPnl > 0 ? (
                <TrendingUp className="h-4 w-4 text-profit" />
              ) : totalPnl < 0 ? (
                <ArrowUpRightSquare className="h-4 w-4 text-loss transform rotate-180" />
              ) : null}
              {totalPnl > 0 ? '+' : ''}{totalPnl.toFixed(2)}
            </div>
            <CardDescription className={cn(
              "text-xs",
              percentageChange > 0 ? "text-profit" : percentageChange < 0 ? "text-loss" : ""
            )}>
              {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(2)}%
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceTracker;
