
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketCategory } from '@/types';

interface MarketCategorySelectProps {
  selectedCategory: MarketCategory;
  onCategoryChange: (value: MarketCategory) => void;
}

const MarketCategorySelect: React.FC<MarketCategorySelectProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const marketCategories: { label: string; value: MarketCategory }[] = [
    { label: 'Forex', value: 'forex' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Stocks', value: 'stocks' },
    { label: 'Indices', value: 'indices' },
    { label: 'Commodities', value: 'commodities' },
    { label: 'Metals', value: 'metals' },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="marketCategory">Market Category</Label>
      <Select 
        value={selectedCategory} 
        onValueChange={(value) => onCategoryChange(value as MarketCategory)}
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
  );
};

export default MarketCategorySelect;
