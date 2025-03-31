
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TradeCalendar from '@/components/journal/TradeCalendar';
import TradeForm from '@/components/journal/TradeForm';
import TradeList from '@/components/journal/TradeList';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { Trade, DailySummary } from '@/types';
import { 
  generateMockTrades, 
  generateDailySummaries,
  calculatePerformanceMetrics
} from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

const TradingJournal: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTradeForm, setShowTradeForm] = useState<boolean>(false);
  const [editTrade, setEditTrade] = useState<Trade | undefined>(undefined);
  
  // Initialize with mock data
  const [trades, setTrades] = useState<Trade[]>(generateMockTrades());
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>(
    generateDailySummaries(trades)
  );
  
  const getTradesForSelectedDate = () => {
    return trades.filter(trade => 
      new Date(trade.date).toDateString() === selectedDate.toDateString()
    );
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowTradeForm(false);
    setEditTrade(undefined);
  };
  
  const handleAddTrade = () => {
    setEditTrade(undefined);
    setShowTradeForm(true);
  };
  
  const handleEditTrade = (trade: Trade) => {
    setEditTrade(trade);
    setShowTradeForm(true);
  };
  
  const handleSaveTrade = (trade: Trade) => {
    const isEditing = !!editTrade;
    let updatedTrades: Trade[];
    
    if (isEditing) {
      // Update existing trade
      updatedTrades = trades.map(t => 
        t.id === trade.id ? trade : t
      );
      toast({
        title: "Trade Updated",
        description: `Your trade for ${trade.symbol} has been updated.`,
      });
    } else {
      // Add new trade
      updatedTrades = [...trades, trade];
      toast({
        title: "Trade Added",
        description: `Your trade for ${trade.symbol} has been added.`,
      });
    }
    
    setTrades(updatedTrades);
    setDailySummaries(generateDailySummaries(updatedTrades));
    setShowTradeForm(false);
    setEditTrade(undefined);
  };
  
  const handleDeleteTrade = (tradeId: string) => {
    const updatedTrades = trades.filter(t => t.id !== tradeId);
    setTrades(updatedTrades);
    setDailySummaries(generateDailySummaries(updatedTrades));
    toast({
      title: "Trade Deleted",
      description: "The trade has been removed from your journal.",
    });
  };
  
  const handleCancelTradeForm = () => {
    setShowTradeForm(false);
    setEditTrade(undefined);
  };
  
  const selectedDateTrades = getTradesForSelectedDate();
  const performanceMetrics = calculatePerformanceMetrics(trades);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Trading Journal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <TradeCalendar 
            dailySummaries={dailySummaries} 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          
          <PerformanceMetrics metrics={performanceMetrics} />
        </div>
        
        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Trades for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
            <Button 
              onClick={handleAddTrade} 
              className="bg-secondary hover:bg-secondary/70"
              disabled={showTradeForm}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Trade
            </Button>
          </div>
          
          {showTradeForm ? (
            <TradeForm 
              selectedDate={selectedDate}
              onSave={handleSaveTrade}
              onCancel={handleCancelTradeForm}
              editTrade={editTrade}
            />
          ) : (
            <TradeList 
              trades={selectedDateTrades}
              onEditTrade={handleEditTrade}
              onDeleteTrade={handleDeleteTrade}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TradingJournal;
