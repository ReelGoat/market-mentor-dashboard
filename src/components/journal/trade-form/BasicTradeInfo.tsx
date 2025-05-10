
import React from 'react';
import { MarketCategory } from '@/types';
import DateInput from '../form/DateInput';
import MarketCategorySelect from '../form/MarketCategorySelect';

interface BasicTradeInfoProps {
  tradeDateTime: Date;
  selectedCategory: MarketCategory;
  onTimeChange: (date: Date) => void;
  onCategoryChange: (category: MarketCategory) => void;
}

const BasicTradeInfo: React.FC<BasicTradeInfoProps> = ({ 
  tradeDateTime, 
  selectedCategory, 
  onTimeChange,
  onCategoryChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DateInput 
        selectedDate={tradeDateTime} 
        onTimeChange={onTimeChange}
      />
      <MarketCategorySelect 
        selectedCategory={selectedCategory} 
        onCategoryChange={onCategoryChange} 
      />
    </div>
  );
};

export default BasicTradeInfo;
