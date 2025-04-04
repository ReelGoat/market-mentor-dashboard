
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMarketSymbolsByCategory } from '@/utils/marketSymbols';
import { MarketCategory } from '@/types';

interface SymbolSelectProps {
  symbol: string;
  selectedCategory: MarketCategory;
  onSymbolChange: (value: string) => void;
  error?: string;
}

const SymbolSelect: React.FC<SymbolSelectProps> = ({ 
  symbol, 
  selectedCategory, 
  onSymbolChange, 
  error 
}) => {
  const symbolsForCategory = getMarketSymbolsByCategory(selectedCategory);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="symbol">Symbol</Label>
      <Select 
        value={symbol} 
        onValueChange={onSymbolChange}
      >
        <SelectTrigger id="symbol" className={error ? "border-loss" : ""}>
          <SelectValue placeholder="Select trading symbol" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</SelectLabel>
            {symbolsForCategory.map((item) => (
              <SelectItem key={item.symbol} value={item.symbol}>
                {item.symbol} {item.name ? `- ${item.name}` : ''}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-loss">{error}</p>}
    </div>
  );
};

export default SymbolSelect;
