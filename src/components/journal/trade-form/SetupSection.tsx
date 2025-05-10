
import React from 'react';
import { TradingSetup } from '@/services/setupsService';
import SetupSelect from '../form/SetupSelect';

interface SetupSectionProps {
  onSetupSelect: (setup: TradingSetup | null) => void;
}

const SetupSection: React.FC<SetupSectionProps> = ({ onSetupSelect }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-300">
        Trading Setup (Optional)
      </label>
      <SetupSelect onSetupSelect={onSetupSelect} />
    </div>
  );
};

export default SetupSection;
