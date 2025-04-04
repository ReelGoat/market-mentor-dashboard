
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TradeNotesProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

const TradeNotes: React.FC<TradeNotesProps> = ({ notes, onNotesChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Trade Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add your analysis and thoughts about this trade..."
        rows={4}
      />
    </div>
  );
};

export default TradeNotes;
