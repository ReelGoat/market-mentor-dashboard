
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LotSizeInputProps {
  lotSize: string;
  onLotSizeChange: (value: string) => void;
  error?: string;
}

const LotSizeInput: React.FC<LotSizeInputProps> = ({ 
  lotSize, 
  onLotSizeChange, 
  error 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLotSizeChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="lotSize">Lot Size</Label>
      <Input
        id="lotSize"
        type="number"
        step="0.01"
        value={lotSize}
        onChange={handleChange}
        className={error ? "border-loss" : ""}
      />
      {error && <p className="text-xs text-loss">{error}</p>}
    </div>
  );
};

export default LotSizeInput;
