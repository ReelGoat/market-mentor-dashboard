
import React from 'react';
import { format } from 'date-fns';
import { Trade } from '@/types';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradeListProps {
  trades: Trade[];
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
}

const TradeList: React.FC<TradeListProps> = ({ 
  trades, 
  onEditTrade, 
  onDeleteTrade 
}) => {
  if (trades.length === 0) {
    return (
      <div className="bg-cardDark rounded-lg p-4 text-center min-h-[200px] flex items-center justify-center card-gradient">
        <p className="text-muted-foreground">No trades for the selected date. Add a new trade to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-cardDark rounded-lg p-4 animate-fade-in card-gradient">
      <h2 className="text-lg font-semibold mb-4">Trades</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Exit</TableHead>
              <TableHead>Lot Size</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id} className="transition-colors hover:bg-secondary/50">
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>{trade.entryPrice.toFixed(4)}</TableCell>
                <TableCell>{trade.exitPrice.toFixed(4)}</TableCell>
                <TableCell>{trade.lotSize.toFixed(2)}</TableCell>
                <TableCell className={cn(
                  "font-medium",
                  trade.pnl > 0 ? "text-profit" : trade.pnl < 0 ? "text-loss" : ""
                )}>
                  {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)} USD
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditTrade(trade)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTrade(trade.id)}
                    >
                      <Trash2 className="h-4 w-4 text-loss" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TradeList;
