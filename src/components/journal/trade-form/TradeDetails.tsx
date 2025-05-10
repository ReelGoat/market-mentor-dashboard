
import React from 'react';
import { MarketCategory } from '@/types';
import SymbolSelect from '../form/SymbolSelect';
import DirectionRadio from '../form/DirectionRadio';
import PriceInputs from '../form/PriceInputs';

interface TradeDetailsProps {
  symbol: string;
  direction: 'buy' | 'sell';
  entryPrice: string;
  exitPrice: string;
  selectedCategory: MarketCategory;
  onSymbolChange: (value: string) => void;
  onDirectionChange: (value: 'buy' | 'sell') => void;
  onEntryPriceChange: (value: string) => void;
  onExitPriceChange: (value: string) => void;
  errors: {[key: string]: string};
}

const TradeDetails: React.FC<TradeDetailsProps> = ({
  symbol,
  direction,
  entryPrice,
  exitPrice,
  selectedCategory,
  onSymbolChange,
  onDirectionChange,
  onEntryPriceChange,
  onExitPriceChange,
  errors
}) => {
  return (
    <>
      <SymbolSelect 
        symbol={symbol} 
        selectedCategory={selectedCategory} 
        onSymbolChange={onSymbolChange} 
        error={errors.symbol} 
      />
      
      <DirectionRadio 
        direction={direction} 
        onDirectionChange={onDirectionChange} 
      />
      
      <PriceInputs 
        entryPrice={entryPrice} 
        exitPrice={exitPrice} 
        onEntryPriceChange={onEntryPriceChange} 
        onExitPriceChange={onExitPriceChange} 
        entryPriceError={errors.entryPrice} 
        exitPriceError={errors.exitPrice} 
      />
    </>
  );
};

export default TradeDetails;
