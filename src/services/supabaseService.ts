
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types";
import { Database } from "@/integrations/supabase/types";

// Authentication
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user;
};

// Trade operations
export const fetchTrades = async () => {
  const { data, error } = await supabase
    .from('trades')
    .select("*")
    .order("date", { ascending: false });
  
  if (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
  
  // Transform database records to Trade objects
  return data.map((item): Trade => ({
    id: item.id,
    date: new Date(item.date),
    symbol: item.symbol,
    entryPrice: parseFloat(item.entry_price.toString()),
    exitPrice: parseFloat(item.exit_price.toString()),
    lotSize: parseFloat(item.lot_size.toString()),
    pnl: parseFloat(item.pnl.toString()),
    notes: item.notes || "",
    screenshot: item.screenshot,
    direction: (item.direction as 'buy' | 'sell') || 'buy', // Type assertion to ensure correct union type
  }));
};

export const saveTrade = async (trade: Trade) => {
  // Ensure direction is either 'buy' or 'sell'
  const safeDirection: 'buy' | 'sell' = trade.direction === 'sell' ? 'sell' : 'buy';
  
  // Prepare trade data in the format expected by the database
  const tradeData = {
    id: trade.id,
    user_id: (await getCurrentUser())?.id,
    date: trade.date.toISOString(),
    symbol: trade.symbol,
    entry_price: trade.entryPrice,
    exit_price: trade.exitPrice,
    lot_size: trade.lotSize,
    pnl: trade.pnl,
    notes: trade.notes,
    screenshot: trade.screenshot,
    direction: safeDirection, // Use the safe direction
  };

  const { data, error } = await supabase
    .from('trades')
    .upsert(tradeData, { onConflict: "id" });
  
  if (error) {
    console.error("Error saving trade:", error);
    throw error;
  }
  
  return data;
};

export const deleteTrade = async (tradeId: string) => {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq("id", tradeId);
  
  if (error) {
    console.error("Error deleting trade:", error);
    throw error;
  }
  
  return true;
};

export const clearMonthTrades = async (year: number, month: number) => {
  // Create date range for the specified month
  const startDate = new Date(year, month, 1).toISOString();
  const endDate = new Date(year, month + 1, 0).toISOString();
  
  const { error } = await supabase
    .from('trades')
    .delete()
    .gte("date", startDate)
    .lte("date", endDate);
  
  if (error) {
    console.error("Error clearing month trades:", error);
    throw error;
  }
  
  return true;
};
