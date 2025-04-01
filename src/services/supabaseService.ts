
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types";

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
    .from("trades")
    .select("*")
    .order("date", { ascending: false });
  
  if (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
  
  // Transform database records to Trade objects
  return data.map((item: any): Trade => ({
    id: item.id,
    date: new Date(item.date),
    symbol: item.symbol,
    entryPrice: parseFloat(item.entry_price),
    exitPrice: parseFloat(item.exit_price),
    lotSize: parseFloat(item.lot_size),
    pnl: parseFloat(item.pnl),
    notes: item.notes || "",
    screenshot: item.screenshot,
  }));
};

export const saveTrade = async (trade: Trade) => {
  const { data, error } = await supabase.from("trades").upsert(
    {
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
    },
    { onConflict: "id" }
  );
  
  if (error) {
    console.error("Error saving trade:", error);
    throw error;
  }
  
  return data;
};

export const deleteTrade = async (tradeId: string) => {
  const { error } = await supabase.from("trades").delete().eq("id", tradeId);
  
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
    .from("trades")
    .delete()
    .gte("date", startDate)
    .lte("date", endDate);
  
  if (error) {
    console.error("Error clearing month trades:", error);
    throw error;
  }
  
  return true;
};
