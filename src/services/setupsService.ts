
import { supabase } from '@/integrations/supabase/client';

// Define the TradingSetup interface
interface TradingSetup {
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

// Fetch all trading setups for the authenticated user
export const fetchSetups = async (): Promise<TradingSetup[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('trading_setups')
    .select('*')
    .order('created_at', { ascending: false }) as { data: any[], error: any };
  
  if (error) {
    console.error("Error fetching setups:", error);
    throw new Error(error.message);
  }
  
  // Transform database records to TradingSetup objects
  return data.map(setup => ({
    id: setup.id,
    name: setup.name,
    description: setup.description || '',
    marketType: setup.market_type,
    timeframe: setup.timeframe,
    riskReward: setup.risk_reward,
    winRate: setup.win_rate,
    notes: setup.notes || '',
    imageUrl: setup.image_url || undefined
  }));
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
  
  let data, error;
  
  if (setup.id) {
    // Update existing setup
    const response = await supabase
      .from('trading_setups')
      .update(setupRecord)
      .eq('id', setup.id)
      .select('*')
      .single() as { data: any, error: any };
      
    data = response.data;
    error = response.error;
  } else {
    // Create new setup
    const response = await supabase
      .from('trading_setups')
      .insert([setupRecord])
      .select('*')
      .single() as { data: any, error: any };
      
    data = response.data;
    error = response.error;
  }
  
  if (error) {
    console.error("Error saving setup:", error);
    throw new Error(error.message);
  }
  
  if (!data) {
    throw new Error("No data returned from saving setup");
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
    .from('trading_setups')
    .delete()
    .eq('id', setupId) as { error: any };
    
  if (error) {
    console.error("Error deleting setup:", error);
    throw new Error(error.message);
  }
};

// Get a specific setup by ID
export const getSetupById = async (setupId: string): Promise<TradingSetup | null> => {
  const { data, error } = await supabase
    .from('trading_setups')
    .select('*')
    .eq('id', setupId)
    .single() as { data: any, error: any };
    
  if (error) {
    console.error("Error fetching setup:", error);
    throw new Error(error.message);
  }
  
  if (!data) {
    return null;
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
