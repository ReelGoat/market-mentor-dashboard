
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradingSetup } from '@/services/setupsService';
import { fetchSetups } from '@/services/setupsService';
import { useToast } from '@/hooks/use-toast';

interface SetupSelectProps {
  onSetupSelect: (setup: TradingSetup | null) => void;
}

const SetupSelect: React.FC<SetupSelectProps> = ({ onSetupSelect }) => {
  const [setups, setSetups] = useState<TradingSetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSetups = async () => {
      try {
        const setupsData = await fetchSetups();
        setSetups(setupsData);
      } catch (error) {
        console.error("Error loading setups:", error);
        toast({
          title: "Error",
          description: "Failed to load trading setups. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSetups();
  }, [toast]);

  const handleSetupChange = (setupId: string) => {
    if (setupId === 'none') {
      onSetupSelect(null);
      return;
    }

    const selectedSetup = setups.find(setup => setup.id === setupId);
    onSetupSelect(selectedSetup || null);
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleSetupChange} disabled={isLoading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={isLoading ? "Loading setups..." : "Select a trading setup"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (Custom Trade)</SelectItem>
          {setups.map((setup) => (
            <SelectItem key={setup.id} value={setup.id || ''}>
              {setup.name} - {setup.marketType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SetupSelect;
