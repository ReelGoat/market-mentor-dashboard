
import React from 'react';
import TradeNotes from '../form/TradeNotes';
import ScreenshotUpload from '../form/ScreenshotUpload';

interface AdditionalInfoProps {
  notes: string;
  screenshot?: string;
  onNotesChange: (value: string) => void;
  onScreenshotChange: (value: string | undefined) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  notes,
  screenshot,
  onNotesChange,
  onScreenshotChange
}) => {
  return (
    <>
      <TradeNotes 
        notes={notes} 
        onNotesChange={onNotesChange} 
      />
      
      <ScreenshotUpload 
        screenshot={screenshot} 
        onScreenshotChange={onScreenshotChange} 
      />
    </>
  );
};

export default AdditionalInfo;
