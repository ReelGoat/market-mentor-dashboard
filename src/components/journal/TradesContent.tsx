
import React from 'react';
import TradeList from './TradeList';
import TradeForm from './TradeForm';
import { Trade } from '@/types';

interface TradesContentProps {
  isLoadingTrades: boolean;
  showTradeForm: boolean;
  selectedDateTrades: Trade[];
  selectedDate: Date;
  editTrade?: Trade;
  onSaveTrade: (trade: Trade) => void;
  onCancelTradeForm: () => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
}

const TradesContent: React.FC<TradesContentProps> = ({
  isLoadingTrades,
  showTradeForm,
  selectedDateTrades,
  selectedDate,
  editTrade,
  onSaveTrade,
  onCancelTradeForm,
  onEditTrade,
  onDeleteTrade
}) => {
  if (isLoadingTrades) {
    return (
      <div className="bg-cardDark rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center card-gradient">
        <div className="animate-spin h-6 w-6 border-4 border-primary rounded-full border-t-transparent mr-2"></div>
        <p className="text-muted-foreground">Loading your trades...</p>
      </div>
    );
  }

  if (showTradeForm) {
    return (
      <TradeForm 
        selectedDate={selectedDate}
        onSave={onSaveTrade}
        onCancel={onCancelTradeForm}
        editTrade={editTrade}
      />
    );
  }

  return (
    <TradeList 
      trades={selectedDateTrades}
      onEditTrade={onEditTrade}
      onDeleteTrade={onDeleteTrade}
    />
  );
};

export default TradesContent;
