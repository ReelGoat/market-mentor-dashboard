
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TradingSettings } from '@/types';
import { DollarSign } from 'lucide-react';

interface BalanceSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSettings: TradingSettings;
  onSave: (settings: TradingSettings) => void;
}

const BalanceSettingsDialog: React.FC<BalanceSettingsDialogProps> = ({
  open,
  onOpenChange,
  initialSettings,
  onSave
}) => {
  const [settings, setSettings] = useState<TradingSettings>(initialSettings);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (open) {
      setSettings(initialSettings);
      setErrors({});
    }
  }, [open, initialSettings]);

  const handleSave = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!settings.initialBalance || settings.initialBalance < 0) {
      newErrors.initialBalance = "Please enter a valid initial balance";
    }
    
    if (!settings.currency) {
      newErrors.currency = "Please enter a currency";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(settings);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Balance Settings</DialogTitle>
          <DialogDescription>
            Set your initial trading balance and currency. This affects how your performance is calculated.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="initialBalance">Initial Balance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="initialBalance"
                type="number"
                className={`pl-8 ${errors.initialBalance ? "border-red-500" : ""}`}
                value={settings.initialBalance}
                onChange={(e) => setSettings({
                  ...settings,
                  initialBalance: parseFloat(e.target.value) || 0
                })}
              />
            </div>
            {errors.initialBalance && (
              <p className="text-xs text-red-500">{errors.initialBalance}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={settings.currency}
              className={errors.currency ? "border-red-500" : ""}
              onChange={(e) => setSettings({
                ...settings,
                currency: e.target.value
              })}
            />
            {errors.currency && (
              <p className="text-xs text-red-500">{errors.currency}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BalanceSettingsDialog;
