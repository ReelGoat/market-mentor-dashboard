import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import TradeCalendar from '@/components/journal/TradeCalendar';
import TradeForm from '@/components/journal/TradeForm';
import TradeList from '@/components/journal/TradeList';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import BalanceTracker from '@/components/analytics/BalanceTracker';
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Trash2 
} from 'lucide-react';
import { Trade, DailySummary, TradingSettings } from '@/types';
import { 
  generateDailySummaries,
  calculatePerformanceMetrics
} from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchTrades, 
  saveTrade, 
  deleteTrade,
  clearMonthTrades,
  saveSettings,
  fetchSettings
} from '@/services/supabaseService';
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
import BalanceSettingsDialog from '@/components/journal/BalanceSettingsDialog';

const TradingJournal: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Use the actual current date as the default selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTradeForm, setShowTradeForm] = useState<boolean>(false);
  const [editTrade, setEditTrade] = useState<Trade | undefined>(undefined);
  const [isLoadingTrades, setIsLoadingTrades] = useState<boolean>(true);
  const [showBalanceSettings, setShowBalanceSettings] = useState<boolean>(false);
  
  const [trades, setTrades] = useState<Trade[]>([]);
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [tradingSettings, setTradingSettings] = useState<TradingSettings>({
    initialBalance: 10000,
    currency: 'USD'
  });
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadTrades = async () => {
      if (!user) return;
      
      setIsLoadingTrades(true);
      try {
        const tradesData = await fetchTrades();
        setTrades(tradesData);
        setDailySummaries(generateDailySummaries(tradesData));
        
        // Load user settings
        const settings = await fetchSettings();
        if (settings) {
          setTradingSettings(settings);
        }
      } catch (error) {
        console.error("Error loading trades:", error);
        toast({
          title: "Error",
          description: "Failed to load your trades. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTrades(false);
      }
    };

    loadTrades();
  }, [user, toast]);
  
  const getTradesForSelectedDate = () => {
    return trades.filter(trade => 
      new Date(trade.date).toDateString() === selectedDate.toDateString()
    );
  };
  
  const handleDateSelect = (date: Date) => {
    console.log("Selected date:", date);
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
  
  const handleSaveTrade = async (trade: Trade) => {
    const isEditing = !!editTrade;
    
    try {
      await saveTrade(trade);
      
      const updatedTrades = await fetchTrades();
      setTrades(updatedTrades);
      setDailySummaries(generateDailySummaries(updatedTrades));
      
      toast({
        title: isEditing ? "Trade Updated" : "Trade Added",
        description: `Your trade for ${trade.symbol} has been ${isEditing ? 'updated' : 'added'}.`,
      });
    } catch (error) {
      console.error("Error saving trade:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} trade. Please try again.`,
        variant: "destructive",
      });
    }
    
    setShowTradeForm(false);
    setEditTrade(undefined);
  };
  
  const handleDeleteTrade = async (tradeId: string) => {
    try {
      await deleteTrade(tradeId);
      
      const updatedTrades = trades.filter(t => t.id !== tradeId);
      setTrades(updatedTrades);
      setDailySummaries(generateDailySummaries(updatedTrades));
      
      toast({
        title: "Trade Deleted",
        description: "The trade has been removed from your journal.",
      });
    } catch (error) {
      console.error("Error deleting trade:", error);
      toast({
        title: "Error",
        description: "Failed to delete trade. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancelTradeForm = () => {
    setShowTradeForm(false);
    setEditTrade(undefined);
  };

  const handleClearMonthTrades = async () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    try {
      await clearMonthTrades(currentYear, currentMonth);
      
      // Reload trades after clearing
      const updatedTrades = await fetchTrades();
      setTrades(updatedTrades);
      setDailySummaries(generateDailySummaries(updatedTrades));
      
      toast({
        title: "Trades Cleared",
        description: `All trades for ${selectedDate.toLocaleString('default', { month: 'long' })} ${currentYear} have been cleared.`,
      });
    } catch (error) {
      console.error("Error clearing month trades:", error);
      toast({
        title: "Error",
        description: "Failed to clear trades. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async (settings: TradingSettings) => {
    try {
      await saveSettings(settings);
      setTradingSettings(settings);
      setShowBalanceSettings(false);
      
      toast({
        title: "Settings Saved",
        description: "Your trading account balance has been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigateToSetup = () => {
    navigate('/setups');
  };
  
  const selectedDateTrades = getTradesForSelectedDate();
  const performanceMetrics = calculatePerformanceMetrics(trades, tradingSettings.initialBalance);

  const currentMonthName = selectedDate.toLocaleString('default', { month: 'long' });
  const currentYear = selectedDate.getFullYear();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Trading Journal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <BalanceTracker 
            initialBalance={tradingSettings.initialBalance}
            currency={tradingSettings.currency}
            totalPnl={performanceMetrics.totalPnl}
            onEditBalance={() => setShowBalanceSettings(true)}
          />
          
          <TradeCalendar 
            dailySummaries={dailySummaries} 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
          
          <PerformanceMetrics metrics={performanceMetrics} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Trades for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={handleNavigateToSetup}
                className="border-primary hover:bg-primary/10"
              >
                View Setups
              </Button>
              
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
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={showTradeForm}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Trade
              </Button>
            </div>
          </div>
          
          {isLoadingTrades ? (
            <div className="bg-cardDark rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center card-gradient">
              <div className="animate-spin h-6 w-6 border-4 border-primary rounded-full border-t-transparent mr-2"></div>
              <p className="text-muted-foreground">Loading your trades...</p>
            </div>
          ) : showTradeForm ? (
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
      
      <BalanceSettingsDialog
        open={showBalanceSettings}
        onOpenChange={setShowBalanceSettings}
        initialSettings={tradingSettings}
        onSave={handleSaveSettings}
      />
    </MainLayout>
  );
};

export default TradingJournal;
