
import React from 'react';
import LotSizeInput from '../form/LotSizeInput';
import PnlInput from '../form/PnlInput';

interface SizeAndResultProps {
  lotSize: string;
  manualPnl: string;
  isPnlPositive: boolean;
  onLotSizeChange: (value: string) => void;
  onManualPnlChange: (value: string) => void;
  onTogglePnlSign: () => void;
  onCalculatePnl: () => void;
  errors: {[key: string]: string};
}

const SizeAndResult: React.FC<SizeAndResultProps> = ({
  lotSize,
  manualPnl,
  isPnlPositive,
  onLotSizeChange,
  onManualPnlChange,
  onTogglePnlSign,
  onCalculatePnl,
  errors
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <LotSizeInput 
        lotSize={lotSize} 
        onLotSizeChange={onLotSizeChange} 
        error={errors.lotSize} 
      />
      
      <PnlInput 
        manualPnl={manualPnl} 
        isPnlPositive={isPnlPositive} 
        onManualPnlChange={onManualPnlChange} 
        onTogglePnlSign={onTogglePnlSign} 
        onCalculatePnl={onCalculatePnl} 
        error={errors.pnl} 
      />
    </div>
  );
};

export default SizeAndResult;
