
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trade, MarketCategory } from '@/types';
import { getAllMarketSymbols, getMarketSymbolsByCategory } from '@/utils/marketSymbols';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown, Save, X, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface TradeFormProps {
  selectedDate: Date;
  onSave: (trade: Trade) => void;
  onCancel: () => void;
  editTrade?: Trade;
}

const TradeForm: React.FC<TradeFormProps> = ({ 
  selectedDate, 
  onSave, 
  onCancel,
  editTrade 
}) => {
  const [symbol, setSymbol] = useState<string>(editTrade?.symbol || '');
  const [entryPrice, setEntryPrice] = useState<string>(editTrade?.entryPrice.toString() || '');
  const [exitPrice, setExitPrice] = useState<string>(editTrade?.exitPrice.toString() || '');
  const [lotSize, setLotSize] = useState<string>(editTrade?.lotSize.toString() || '');
  const [pnl, setPnl] = useState<number>(editTrade?.pnl || 0);
  const [notes, setNotes] = useState<string>(editTrade?.notes || '');
  const [screenshot, setScreenshot] = useState<string | undefined>(editTrade?.screenshot);
  const [direction, setDirection] = useState<'buy' | 'sell'>(editTrade?.direction || 'buy');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('forex');
  const [isPnlPositive, setIsPnlPositive] = useState<boolean>(editTrade ? editTrade.pnl >= 0 : true);
  const [manualPnl, setManualPnl] = useState<string>(editTrade ? Math.abs(editTrade.pnl).toString() : '');

  // This function calculates PnL from trade parameters when the Calculate button is clicked
  const calculatePnl = () => {
    if (entryPrice && exitPrice && lotSize) {
      const entry = parseFloat(entryPrice);
      const exit = parseFloat(exitPrice);
      const size = parseFloat(lotSize);
      
      if (!isNaN(entry) && !isNaN(exit) && !isNaN(size)) {
        let calculatedPnl: number;
        
        if (direction === 'buy') {
          calculatedPnl = (exit - entry) * size * 100;
        } else {
          calculatedPnl = (entry - exit) * size * 100;
        }
        
        const roundedPnl = parseFloat(calculatedPnl.toFixed(2));
        setManualPnl(Math.abs(roundedPnl).toString());
        setIsPnlPositive(roundedPnl >= 0);
        setPnl(roundedPnl);
      }
    }
  };

  // Update the actual pnl value whenever manualPnl or isPnlPositive changes
  useEffect(() => {
    const pnlValue = parseFloat(manualPnl);
    if (!isNaN(pnlValue)) {
      setPnl(isPnlPositive ? pnlValue : -pnlValue);
    } else {
      setPnl(0); // Default to 0 if the input is not a valid number
    }
  }, [manualPnl, isPnlPositive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    
    if (!symbol) newErrors.symbol = "Symbol is required";
    if (!entryPrice) newErrors.entryPrice = "Entry price is required";
    if (!exitPrice) newErrors.exitPrice = "Exit price is required";
    if (!lotSize) newErrors.lotSize = "Lot size is required";
    if (!manualPnl) newErrors.pnl = "P&L is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const trade: Trade = {
      id: editTrade?.id || '',
      date: selectedDate,
      symbol,
      entryPrice: parseFloat(entryPrice),
      exitPrice: parseFloat(exitPrice),
      lotSize: parseFloat(lotSize),
      pnl,
      notes,
      screenshot,
      direction
    };
    
    onSave(trade);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePnlSign = () => {
    setIsPnlPositive(!isPnlPositive);
  };

  const handleManualPnlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow positive numbers and decimals
    const value = e.target.value;
    // Allow empty input (for clearing) or valid numbers with optional decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setManualPnl(value);
    }
  };

  // Create a custom handler for lotSize to prevent automatic PnL calculation
  const handleLotSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLotSize(e.target.value);
    // No automatic PnL calculation here
  };

  const marketCategories: { label: string; value: MarketCategory }[] = [
    { label: 'Forex', value: 'forex' },
    { label: 'Metals', value: 'metals' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Indices', value: 'indices' },
    { label: 'Stocks', value: 'stocks' },
    { label: 'Commodities', value: 'commodities' },
  ];

  const symbolsForCategory = getMarketSymbolsByCategory(selectedCategory);

  return (
    <div className="bg-cardDark rounded-lg p-4 card-gradient">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {editTrade ? 'Edit Trade' : 'Add New Trade'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              value={format(selectedDate, 'yyyy-MM-dd')} 
              disabled 
              className="bg-secondary/60 text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marketCategory">Market Category</Label>
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => setSelectedCategory(value as MarketCategory)}
            >
              <SelectTrigger id="marketCategory">
                <SelectValue placeholder="Select market category" />
              </SelectTrigger>
              <SelectContent>
                {marketCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Select 
            value={symbol} 
            onValueChange={setSymbol}
          >
            <SelectTrigger id="symbol" className={errors.symbol ? "border-loss" : ""}>
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
          {errors.symbol && <p className="text-xs text-loss">{errors.symbol}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direction">Trade Direction</Label>
          <RadioGroup 
            id="direction" 
            value={direction} 
            onValueChange={(value) => setDirection(value as 'buy' | 'sell')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="flex items-center">
                <ArrowUp className="h-4 w-4 text-profit mr-1" /> Buy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell" className="flex items-center">
                <ArrowDown className="h-4 w-4 text-loss mr-1" /> Sell
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entryPrice">Entry Price</Label>
            <Input
              id="entryPrice"
              type="number"
              step="0.0001"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className={errors.entryPrice ? "border-loss" : ""}
            />
            {errors.entryPrice && <p className="text-xs text-loss">{errors.entryPrice}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exitPrice">Exit Price</Label>
            <Input
              id="exitPrice"
              type="number"
              step="0.0001"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              className={errors.exitPrice ? "border-loss" : ""}
            />
            {errors.exitPrice && <p className="text-xs text-loss">{errors.exitPrice}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size</Label>
            <Input
              id="lotSize"
              type="number"
              step="0.01"
              value={lotSize}
              onChange={handleLotSizeChange}
              className={errors.lotSize ? "border-loss" : ""}
            />
            {errors.lotSize && <p className="text-xs text-loss">{errors.lotSize}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pnl">P&L (USD)</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  id="pnl"
                  value={manualPnl}
                  onChange={handleManualPnlChange}
                  className={cn(
                    "pr-10",
                    isPnlPositive ? "text-profit" : "text-loss",
                    errors.pnl ? "border-loss" : ""
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
                  onClick={togglePnlSign}
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
                onClick={calculatePnl}
              >
                <Calculator className="h-4 w-4" />
              </Button>
            </div>
            {errors.pnl && <p className="text-xs text-loss">{errors.pnl}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Trade Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your analysis and thoughts about this trade..."
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="screenshot">Trade Screenshot</Label>
          <Input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-secondary/60 text-foreground"
          />
          {screenshot && (
            <div className="mt-2 relative rounded-md overflow-hidden w-full h-32">
              <img
                src={screenshot}
                alt="Trade screenshot"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setScreenshot(undefined)}
                className="absolute top-2 right-2 bg-cardDark p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-profit text-black hover:bg-profit/90">
            <Save className="mr-2 h-4 w-4" />
            Save Trade
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
