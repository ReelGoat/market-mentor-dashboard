
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PnlInputProps {
  manualPnl: string;
  isPnlPositive: boolean;
  onManualPnlChange: (value: string) => void;
  onTogglePnlSign: () => void;
  onCalculatePnl: () => void;
  error?: string;
}

const PnlInput: React.FC<PnlInputProps> = ({ 
  manualPnl, 
  isPnlPositive, 
  onManualPnlChange, 
  onTogglePnlSign, 
  onCalculatePnl,
  error 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow positive numbers and decimals
    const value = e.target.value;
    // Allow empty input (for clearing) or valid numbers with optional decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onManualPnlChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="pnl">P&L (USD)</Label>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            id="pnl"
            value={manualPnl}
            onChange={handleChange}
            className={cn(
              "pr-10",
              isPnlPositive ? "text-profit" : "text-loss",
              error ? "border-loss" : ""
            )}
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7",
              isPnlPositive ? "text-profit" : "text-loss"
            )}
            onClick={onTogglePnlSign}
          >
            {isPnlPositive ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          title="Calculate P&L from prices"
          onClick={onCalculatePnl}
        >
          <Calculator className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-xs text-loss">{error}</p>}
    </div>
  );
};

export default PnlInput;
