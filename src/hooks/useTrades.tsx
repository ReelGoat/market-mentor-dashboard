
import { useState, useEffect } from 'react';
import { Trade, DailySummary } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTrades, 
  saveTrade, 
  deleteTrade,
  clearMonthTrades 
} from '@/services/supabaseService';
import { generateDailySummaries } from '@/utils/mockData';

export const useTrades = () => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState<boolean>(true);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    setIsLoadingTrades(true);
    try {
      const tradesData = await fetchTrades();
      setTrades(tradesData);
      setDailySummaries(generateDailySummaries(tradesData));
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

  const handleSaveTrade = async (trade: Trade) => {
    const isEditing = !!trade.id;
    
    try {
      await saveTrade(trade);
      
      const updatedTrades = await fetchTrades();
      setTrades(updatedTrades);
      setDailySummaries(generateDailySummaries(updatedTrades));
      
      toast({
        title: isEditing ? "Trade Updated" : "Trade Added",
        description: `Your trade for ${trade.symbol} has been ${isEditing ? 'updated' : 'added'}.`,
      });

      return true;
    } catch (error) {
      console.error("Error saving trade:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} trade. Please try again.`,
        variant: "destructive",
      });
      
      return false;
    }
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

      return true;
    } catch (error) {
      console.error("Error deleting trade:", error);
      toast({
        title: "Error",
        description: "Failed to delete trade. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const handleClearMonthTrades = async (year: number, month: number) => {
    try {
      await clearMonthTrades(year, month);
      
      // Reload trades after clearing
      const updatedTrades = await fetchTrades();
      setTrades(updatedTrades);
      setDailySummaries(generateDailySummaries(updatedTrades));
      
      toast({
        title: "Trades Cleared",
        description: `All trades for ${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year} have been cleared.`,
      });

      return true;
    } catch (error) {
      console.error("Error clearing month trades:", error);
      toast({
        title: "Error",
        description: "Failed to clear trades. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  return {
    trades,
    dailySummaries,
    isLoadingTrades,
    loadTrades,
    handleSaveTrade,
    handleDeleteTrade,
    handleClearMonthTrades
  };
};
