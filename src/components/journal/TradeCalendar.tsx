
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  getDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  isSameMonth,
  isToday
} from 'date-fns';
import { cn } from '@/lib/utils';
import { DailySummary } from '@/types';

interface TradeCalendarProps {
  dailySummaries: DailySummary[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const TradeCalendar: React.FC<TradeCalendarProps> = ({ 
  dailySummaries, 
  selectedDate, 
  onDateSelect 
}) => {
  // Initialize currentMonth to the current month of the selected date
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  // Ensure selectedDate is always set to the current date on initial render
  useEffect(() => {
    const today = new Date();
    onDateSelect(today);
  }, []);

  const nextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    
    // If selected date is not in the new month, update to first day of new month
    if (!isSameMonth(selectedDate, nextMonth)) {
      onDateSelect(nextMonth);
    }
  };

  const prevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
    
    // If selected date is not in the new month, update to first day of new month
    if (!isSameMonth(selectedDate, prevMonth)) {
      onDateSelect(prevMonth);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayColorClass = (day: Date) => {
    const summary = dailySummaries.find(s => isSameDay(s.date, day));
    
    if (isToday(day)) {
      return "text-primary font-bold"; // Highlight today
    }
    
    if (!summary) return "text-muted-foreground";
    
    switch (summary.status) {
      case 'profit':
        return "text-profit";
      case 'loss':
        return "text-loss";
      case 'neutral':
        return "text-neutral";
      case 'no-trade':
      default:
        return "text-muted-foreground";
    }
  };

  const getDayBgClass = (day: Date) => {
    if (isSameDay(day, selectedDate)) {
      return "bg-secondary";
    }
    if (isToday(day)) {
      return "bg-secondary/50"; // Light background for today
    }
    return "";
  };

  return (
    <div className="bg-cardDark rounded-lg p-4 card-gradient">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Trading Calendar</h2>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={prevMonth}
            className="p-2 rounded hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="w-32 text-center py-2">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 rounded hover:bg-secondary transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: getDay(monthStart) }).map((_, index) => (
          <div key={`empty-${index}`} className="text-center py-3"></div>
        ))}
        
        {days.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => onDateSelect(day)}
            className={cn(
              "text-center py-3 rounded transition-colors hover:bg-secondary",
              getDayBgClass(day),
              getDayColorClass(day)
            )}
          >
            <div className="text-sm">
              {format(day, 'd')}
            </div>
          </button>
        ))}
      </div>
      
      {/* Today button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            const today = new Date();
            onDateSelect(today);
            setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
          }}
          className="text-sm bg-primary text-primary-foreground px-4 py-1 rounded hover:bg-primary/90 transition-colors"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default TradeCalendar;
