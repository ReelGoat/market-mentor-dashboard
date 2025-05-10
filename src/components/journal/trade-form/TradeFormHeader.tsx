
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface TradeFormHeaderProps {
  isEditing: boolean;
  onCancel: () => void;
}

const TradeFormHeader: React.FC<TradeFormHeaderProps> = ({ isEditing, onCancel }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">
        {isEditing ? 'Edit Trade' : 'Add New Trade'}
      </h2>
      <Button variant="ghost" size="icon" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TradeFormHeader;
