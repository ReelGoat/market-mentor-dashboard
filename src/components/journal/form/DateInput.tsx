
import React from 'react';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateInputProps {
  selectedDate: Date;
}

const DateInput: React.FC<DateInputProps> = ({ selectedDate }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date">Date</Label>
      <Input 
        id="date" 
        value={format(selectedDate, 'MMMM d, yyyy')} 
        disabled 
        className="bg-secondary/60 text-foreground"
      />
    </div>
  );
};

export default DateInput;
