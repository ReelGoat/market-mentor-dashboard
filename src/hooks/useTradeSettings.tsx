
import { useState, useEffect } from 'react';
import { TradingSettings } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { fetchSettings, saveSettings } from '@/services/supabaseService';

export const useTradeSettings = () => {
  const { toast } = useToast();
  const [tradingSettings, setTradingSettings] = useState<TradingSettings>({
    initialBalance: 10000,
    currency: 'USD'
  });
  const [showBalanceSettings, setShowBalanceSettings] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await fetchSettings();
      if (settings) {
        setTradingSettings(settings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
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
      
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  return {
    tradingSettings,
    showBalanceSettings,
    setShowBalanceSettings,
    handleSaveSettings
  };
};
