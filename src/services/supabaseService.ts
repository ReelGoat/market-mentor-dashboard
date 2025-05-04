import { supabase } from '@/integrations/supabase/client';
import { Trade, TradingSettings } from '@/types';

// Fetch all trades for the authenticated user
export const fetchTrades = async (): Promise<Trade[]> => {
  const { data: tradesData, error } = await supabase
    .from('trades')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) {
    console.error("Error fetching trades:", error);
    throw new Error(error.message);
  }
  
  // Transform database records to Trade objects with proper type handling for screenshot
  return tradesData.map(trade => ({
    id: trade.id,
    date: new Date(trade.date),
    symbol: trade.symbol,
    entryPrice: trade.entry_price,
    exitPrice: trade.exit_price,
    lotSize: trade.lot_size,
    pnl: trade.pnl,
    notes: trade.notes || '',
    screenshot: trade.screenshot || undefined, // Convert null to undefined to match Trade type
    direction: trade.direction as 'buy' | 'sell',
    session: trade.session || undefined // Convert null to undefined
  }));
};

// Save a trade (create or update)
export const saveTrade = async (trade: Trade): Promise<void> => {
  const { id, ...tradeData } = trade;
  
  const tradeRecord = {
    symbol: tradeData.symbol,
    entry_price: tradeData.entryPrice,
    exit_price: tradeData.exitPrice,
    lot_size: tradeData.lotSize,
    pnl: tradeData.pnl,
    notes: tradeData.notes,
    screenshot: tradeData.screenshot,
    date: tradeData.date.toISOString(), // Convert Date to ISO string
    direction: tradeData.direction,
    session: tradeData.session
  };
  
  if (id) {
    // Update existing trade
    const { error } = await supabase
      .from('trades')
      .update(tradeRecord)
      .eq('id', id);
      
    if (error) {
      console.error("Error updating trade:", error);
      throw new Error(error.message);
    }
  } else {
    // Create new trade
    const { error } = await supabase
      .from('trades')
      .insert([tradeRecord]);
      
    if (error) {
      console.error("Error creating trade:", error);
      throw new Error(error.message);
    }
  }
};

// Delete a trade
export const deleteTrade = async (tradeId: string): Promise<void> => {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', tradeId);
    
  if (error) {
    console.error("Error deleting trade:", error);
    throw new Error(error.message);
  }
};

// Clear all trades for a specific month
export const clearMonthTrades = async (year: number, month: number): Promise<void> => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const { error } = await supabase
    .from('trades')
    .delete()
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString());
    
  if (error) {
    console.error("Error clearing month trades:", error);
    throw new Error(error.message);
  }
};

// Save user trading settings
export const saveSettings = async (settings: TradingSettings): Promise<void> => {
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  // Use any type to bypass TypeScript error until types are regenerated
  const { error } = await (supabase
    .from('trading_settings') as any)
    .upsert([{
      initial_balance: settings.initialBalance,
      currency: settings.currency,
      user_id: userId
    }], {
      onConflict: 'user_id'
    });
    
  if (error) {
    console.error("Error saving settings:", error);
    throw new Error(error.message);
  }
};

// Fetch user trading settings
export const fetchSettings = async (): Promise<TradingSettings | null> => {
  // Use any type to bypass TypeScript error until types are regenerated
  const { data, error } = await (supabase
    .from('trading_settings') as any)
    .select('*')
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, return default
      return {
        initialBalance: 10000,
        currency: 'USD'
      };
    }
    console.error("Error fetching settings:", error);
    throw new Error(error.message);
  }
  
  return {
    initialBalance: data.initial_balance,
    currency: data.currency
  };
};
