
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { calculatePerformanceMetrics } from '@/utils/mockData';
import { useAuth } from '@/hooks/useAuth';
import { Trade } from '@/types';
import { useTrades } from '@/hooks/useTrades';
import { useTradeSettings } from '@/hooks/useTradeSettings';
import BalanceSettingsDialog from '@/components/journal/BalanceSettingsDialog';
import CalendarSection from '@/components/journal/CalendarSection';
import JournalHeader from '@/components/journal/JournalHeader';
import TradesContent from '@/components/journal/TradesContent';

const TradingJournal: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Use the actual current date as the default selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTradeForm, setShowTradeForm] = useState<boolean>(false);
  const [editTrade, setEditTrade] = useState<Trade | undefined>(undefined);
  
  const { 
    trades, 
    dailySummaries, 
    isLoadingTrades, 
    handleSaveTrade, 
    handleDeleteTrade, 
    handleClearMonthTrades 
  } = useTrades();

  const { 
    tradingSettings, 
    showBalanceSettings, 
    setShowBalanceSettings, 
    handleSaveSettings 
  } = useTradeSettings();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
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
  
  const handleSaveTradeWrapper = async (trade: Trade) => {
    const success = await handleSaveTrade(trade);
    if (success) {
      setShowTradeForm(false);
      setEditTrade(undefined);
    }
  };
  
  const handleCancelTradeForm = () => {
    setShowTradeForm(false);
    setEditTrade(undefined);
  };

  const handleClearMonthTradesWrapper = async () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    await handleClearMonthTrades(currentYear, currentMonth);
  };

  const handleNavigateToSetup = () => {
    navigate('/setups');
  };
  
  const selectedDateTrades = getTradesForSelectedDate();
  const performanceMetrics = calculatePerformanceMetrics(trades, tradingSettings.initialBalance);

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
        <CalendarSection 
          dailySummaries={dailySummaries}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          performanceMetrics={performanceMetrics}
          tradingSettings={tradingSettings}
          onEditBalance={() => setShowBalanceSettings(true)}
        />
        
        <div className="lg:col-span-2 space-y-6">
          <JournalHeader 
            selectedDate={selectedDate}
            onAddTrade={handleAddTrade}
            onClearMonthTrades={handleClearMonthTradesWrapper}
            onNavigateToSetup={handleNavigateToSetup}
            showTradeForm={showTradeForm}
          />
          
          <TradesContent 
            isLoadingTrades={isLoadingTrades}
            showTradeForm={showTradeForm}
            selectedDateTrades={selectedDateTrades}
            selectedDate={selectedDate}
            editTrade={editTrade}
            onSaveTrade={handleSaveTradeWrapper}
            onCancelTradeForm={handleCancelTradeForm}
            onEditTrade={handleEditTrade}
            onDeleteTrade={handleDeleteTrade}
          />
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
