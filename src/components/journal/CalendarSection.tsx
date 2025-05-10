
import React from 'react';
import TradeCalendar from './TradeCalendar';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import BalanceTracker from '@/components/analytics/BalanceTracker';
import { DailySummary, PerformanceMetrics as PerformanceMetricsType, TradingSettings } from '@/types';

interface CalendarSectionProps {
  dailySummaries: DailySummary[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  performanceMetrics: PerformanceMetricsType;
  tradingSettings: TradingSettings;
  onEditBalance: () => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  dailySummaries,
  selectedDate,
  onDateSelect,
  performanceMetrics,
  tradingSettings,
  onEditBalance
}) => {
  return (
    <div className="space-y-6">
      <BalanceTracker 
        initialBalance={tradingSettings.initialBalance}
        currency={tradingSettings.currency}
        totalPnl={performanceMetrics.totalPnl}
        onEditBalance={onEditBalance}
      />
      
      <TradeCalendar 
        dailySummaries={dailySummaries} 
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
      
      <PerformanceMetrics metrics={performanceMetrics} />
    </div>
  );
};

export default CalendarSection;
