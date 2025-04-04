
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PriceInputsProps {
  entryPrice: string;
  exitPrice: string;
  onEntryPriceChange: (value: string) => void;
  onExitPriceChange: (value: string) => void;
  entryPriceError?: string;
  exitPriceError?: string;
}

const PriceInputs: React.FC<PriceInputsProps> = ({ 
  entryPrice, 
  exitPrice, 
  onEntryPriceChange, 
  onExitPriceChange, 
  entryPriceError, 
  exitPriceError 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="entryPrice">Entry Price</Label>
        <Input
          id="entryPrice"
          type="number"
          step="0.0001"
          value={entryPrice}
          onChange={(e) => onEntryPriceChange(e.target.value)}
          className={entryPriceError ? "border-loss" : ""}
        />
        {entryPriceError && <p className="text-xs text-loss">{entryPriceError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="exitPrice">Exit Price</Label>
        <Input
          id="exitPrice"
          type="number"
          step="0.0001"
          value={exitPrice}
          onChange={(e) => onExitPriceChange(e.target.value)}
          className={exitPriceError ? "border-loss" : ""}
        />
        {exitPriceError && <p className="text-xs text-loss">{exitPriceError}</p>}
      </div>
    </div>
  );
};

export default PriceInputs;
