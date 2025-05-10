
import React, { useState, useEffect } from 'react';
import { Trade, MarketCategory } from '@/types';
import { TradingSetup } from '@/services/setupsService';

// Import our refactored components
import TradeFormHeader from './trade-form/TradeFormHeader';
import BasicTradeInfo from './trade-form/BasicTradeInfo';
import SetupSection from './trade-form/SetupSection';
import TradeDetails from './trade-form/TradeDetails';
import SizeAndResult from './trade-form/SizeAndResult';
import AdditionalInfo from './trade-form/AdditionalInfo';
import FormActions from './form/FormActions';

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
  const [tradeDateTime, setTradeDateTime] = useState<Date>(
    editTrade?.date || selectedDate
  );
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
  const [session, setSession] = useState<string>('');
  const [selectedSetup, setSelectedSetup] = useState<TradingSetup | null>(null);

  // Determine session when trade date/time changes
  useEffect(() => {
    const determineSession = (date: Date): string => {
      const hour = date.getUTCHours();
      
      // Trading sessions (approximated based on common forex market hours)
      if (hour >= 0 && hour < 8) return 'Asian';
      if (hour >= 8 && hour < 16) return 'European';
      if (hour >= 16 && hour < 21) return 'American';
      return 'Overnight';
    };
    
    setSession(determineSession(tradeDateTime));
  }, [tradeDateTime]);

  // Apply trading setup when selected
  const handleSetupSelect = (setup: TradingSetup | null) => {
    setSelectedSetup(setup);
    
    if (setup) {
      // Apply setup defaults to the trade form
      setSelectedCategory(setup.marketType as MarketCategory);
      setNotes(prev => {
        if (prev && prev.trim() !== '') {
          return `${prev}\n\nUsing setup: ${setup.name}\n${setup.notes}`;
        } else {
          return `Using setup: ${setup.name}\n${setup.notes}`;
        }
      });
    }
  };

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
      date: tradeDateTime,
      symbol,
      entryPrice: parseFloat(entryPrice),
      exitPrice: parseFloat(exitPrice),
      lotSize: parseFloat(lotSize),
      pnl,
      notes,
      screenshot,
      direction,
      session,
      setupId: selectedSetup?.id
    };
    
    onSave(trade);
  };

  // Handlers for individual components
  const handleLotSizeChange = (value: string) => {
    setLotSize(value);
  };
  
  const handleTogglePnlSign = () => {
    setIsPnlPositive(!isPnlPositive);
  };

  const handleManualPnlChange = (value: string) => {
    setManualPnl(value);
  };

  const handleTimeChange = (date: Date) => {
    setTradeDateTime(date);
  };

  return (
    <div className="bg-cardDark rounded-lg p-4 card-gradient">
      <TradeFormHeader isEditing={!!editTrade} onCancel={onCancel} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicTradeInfo 
          tradeDateTime={tradeDateTime}
          selectedCategory={selectedCategory}
          onTimeChange={handleTimeChange}
          onCategoryChange={setSelectedCategory}
        />

        <SetupSection onSetupSelect={handleSetupSelect} />
        
        <TradeDetails
          symbol={symbol}
          direction={direction}
          entryPrice={entryPrice}
          exitPrice={exitPrice}
          selectedCategory={selectedCategory}
          onSymbolChange={setSymbol}
          onDirectionChange={setDirection}
          onEntryPriceChange={setEntryPrice}
          onExitPriceChange={setExitPrice}
          errors={errors}
        />
        
        <SizeAndResult
          lotSize={lotSize}
          manualPnl={manualPnl}
          isPnlPositive={isPnlPositive}
          onLotSizeChange={handleLotSizeChange}
          onManualPnlChange={handleManualPnlChange}
          onTogglePnlSign={handleTogglePnlSign}
          onCalculatePnl={calculatePnl}
          errors={errors}
        />
        
        <AdditionalInfo
          notes={notes}
          screenshot={screenshot}
          onNotesChange={setNotes}
          onScreenshotChange={setScreenshot}
        />
        
        <FormActions 
          onCancel={onCancel} 
          isEditing={!!editTrade} 
        />
      </form>
    </div>
  );
};

export default TradeForm;
