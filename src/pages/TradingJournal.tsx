
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TradeCalendar from '@/components/journal/TradeCalendar';
import TradeForm from '@/components/journal/TradeForm';
import TradeList from '@/components/journal/TradeList';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { Trade, DailySummary } from '@/types';
import { 
  generateMockTrades, 
  generateDailySummaries,
  calculatePerformanceMetrics
} from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const handleClearMonthTrades = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    const updatedTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getMonth() !== currentMonth || tradeDate.getFullYear() !== currentYear;
    });
    
    setTrades(updatedTrades);
    setDailySummaries(generateDailySummaries(updatedTrades));
    
    toast({
      title: "Trades Cleared",
      description: `All trades for ${selectedDate.toLocaleString('default', { month: 'long' })} ${currentYear} have been cleared.`,
    });
  };
  
  const selectedDateTrades = getTradesForSelectedDate();
  const performanceMetrics = calculatePerformanceMetrics(trades);

  // Get current month and year for display
  const currentMonthName = selectedDate.toLocaleString('default', { month: 'long' });
  const currentYear = selectedDate.getFullYear();

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
            <div className="flex space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Month
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all trades for {currentMonthName}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete all trades for {currentMonthName} {currentYear}. 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearMonthTrades}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear Trades
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button 
                onClick={handleAddTrade} 
                className="bg-secondary hover:bg-secondary/70"
                disabled={showTradeForm}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Trade
              </Button>
            </div>
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
