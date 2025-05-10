
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Removed the unused MarketCategory import

// Define the TradingSetup interface
export interface TradingSetup {
  id?: string;
  name: string;
  description: string;
  marketType: string;
  timeframe: string;
  riskReward: number;
  winRate: number;
  notes: string;
  imageUrl?: string;
}

type SetupRow = Database['public']['Tables']['trading_setups']['Row'];

// Type guard to ensure a setup is valid
const isValidSetup = (setup: any): setup is SetupRow => {
  return setup && 
    typeof setup.id === 'string' && 
    typeof setup.name === 'string' && 
    typeof setup.market_type === 'string';
};

// Fetch all trading setups for the authenticated user
export const fetchSetups = async (): Promise<TradingSetup[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }
  
  // Use type assertion to tell TypeScript that 'trading_setups' is valid
  const { data, error } = await supabase
    .from('trading_setups' as any)
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching setups:", error);
    throw new Error(error.message);
  }
  
  // Transform database records to TradingSetup objects
  return (data || []).map((setup: any) => {
    if (!isValidSetup(setup)) {
      console.error("Invalid setup data:", setup);
      throw new Error("Invalid setup data received from database");
    }
    
    return {
      id: setup.id,
      name: setup.name,
      description: setup.description || '',
      marketType: setup.market_type,
      timeframe: setup.timeframe,
      riskReward: setup.risk_reward,
      winRate: setup.win_rate,
      notes: setup.notes || '',
      imageUrl: setup.image_url || undefined
    };
  });
};

// Save a trading setup (create or update)
export const saveSetup = async (setup: TradingSetup): Promise<TradingSetup> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }
  
  const setupRecord = {
    name: setup.name,
    description: setup.description,
    market_type: setup.marketType,
    timeframe: setup.timeframe,
    risk_reward: setup.riskReward,
    win_rate: setup.winRate,
    notes: setup.notes,
    image_url: setup.imageUrl,
    user_id: user.user.id
  };
  
  let response;
  
  if (setup.id) {
    // Update existing setup
    response = await supabase
      .from('trading_setups' as any)
      .update(setupRecord)
      .eq('id', setup.id)
      .select('*')
      .single();
  } else {
    // Create new setup
    response = await supabase
      .from('trading_setups' as any)
      .insert([setupRecord])
      .select('*')
      .single();
  }
  
  const { data, error } = response;
  
  if (error) {
    console.error("Error saving setup:", error);
    throw new Error(error.message);
  }
  
  if (!data) {
    throw new Error("No data returned from saving setup");
  }

  if (!isValidSetup(data)) {
    console.error("Invalid setup data returned:", data);
    throw new Error("Invalid setup data returned from saving");
  }
  
  // Transform database record to TradingSetup object
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    marketType: data.market_type,
    timeframe: data.timeframe,
    riskReward: data.risk_reward,
    winRate: data.win_rate,
    notes: data.notes || '',
    imageUrl: data.image_url || undefined
  };
};

// Delete a trading setup
export const deleteSetup = async (setupId: string): Promise<void> => {
  const { error } = await supabase
    .from('trading_setups' as any)
    .delete()
    .eq('id', setupId);
    
  if (error) {
    console.error("Error deleting setup:", error);
    throw new Error(error.message);
  }
};

// Get a specific setup by ID
export const getSetupById = async (setupId: string): Promise<TradingSetup | null> => {
  const { data, error } = await supabase
    .from('trading_setups' as any)
    .select('*')
    .eq('id', setupId)
    .single();
    
  if (error) {
    console.error("Error fetching setup:", error);
    throw new Error(error.message);
  }
  
  if (!data) {
    return null;
  }

  if (!isValidSetup(data)) {
    console.error("Invalid setup data returned:", data);
    throw new Error("Invalid setup data returned from database");
  }
  
  // Transform database record to TradingSetup object
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    marketType: data.market_type,
    timeframe: data.timeframe,
    riskReward: data.risk_reward,
    winRate: data.win_rate,
    notes: data.notes || '',
    imageUrl: data.image_url || undefined
  };
};
