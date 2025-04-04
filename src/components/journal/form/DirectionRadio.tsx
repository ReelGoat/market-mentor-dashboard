
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface DirectionRadioProps {
  direction: 'buy' | 'sell';
  onDirectionChange: (value: 'buy' | 'sell') => void;
}

const DirectionRadio: React.FC<DirectionRadioProps> = ({ 
  direction, 
  onDirectionChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="direction">Trade Direction</Label>
      <RadioGroup 
        id="direction" 
        value={direction} 
        onValueChange={(value) => onDirectionChange(value as 'buy' | 'sell')}
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
  );
};

export default DirectionRadio;
