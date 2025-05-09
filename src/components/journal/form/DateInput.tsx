
import React from 'react';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from 'lucide-react';

interface DateInputProps {
  selectedDate: Date;
  onTimeChange?: (date: Date) => void;
}

const DateInput: React.FC<DateInputProps> = ({ selectedDate, onTimeChange }) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTimeChange) {
      const newDate = new Date(selectedDate);
      const [hours, minutes] = e.target.value.split(':').map(Number);
      newDate.setHours(hours, minutes);
      onTimeChange(newDate);
    }
  };

  // Determine the current trading session based on UTC hours
  const determineSession = (date: Date): string => {
    const hour = date.getUTCHours();
    
    // Trading sessions (approximated based on common forex market hours)
    if (hour >= 0 && hour < 8) return 'Asian';
    if (hour >= 8 && hour < 16) return 'European';
    if (hour >= 16 && hour < 21) return 'American';
    return 'Overnight';
  };
  
  const currentSession = determineSession(selectedDate);
  const timeString = format(selectedDate, 'HH:mm');
  const formattedFullTime = format(selectedDate, 'MMMM d, yyyy HH:mm');

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            value={format(selectedDate, 'MMMM d, yyyy')} 
            disabled 
            className="bg-secondary/60 text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="time">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Time (Local)
            </span>
          </Label>
          <Input 
            id="time" 
            type="time"
            value={timeString}
            onChange={handleTimeChange}
            className="bg-background text-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col text-xs space-y-1">
        <div className="text-muted-foreground">
          <span className="font-medium text-foreground">Full datetime:</span> {formattedFullTime}
        </div>
        <div className="text-muted-foreground italic">
          Session: <span className="font-medium text-foreground">{currentSession}</span> 
          <span className="ml-2">(Based on UTC time)</span>
        </div>
      </div>
    </div>
  );
};

export default DateInput;
