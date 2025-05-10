
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface JournalHeaderProps {
  selectedDate: Date;
  onAddTrade: () => void;
  onClearMonthTrades: () => void;
  onNavigateToSetup: () => void;
  showTradeForm: boolean;
}

const JournalHeader: React.FC<JournalHeaderProps> = ({ 
  selectedDate, 
  onAddTrade, 
  onClearMonthTrades, 
  onNavigateToSetup,
  showTradeForm
}) => {
  const currentMonthName = selectedDate.toLocaleString('default', { month: 'long' });
  const currentYear = selectedDate.getFullYear();

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">
        Trades for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </h2>
      <div className="flex space-x-2">
        <Button 
          variant="outline"
          onClick={onNavigateToSetup}
          className="border-primary hover:bg-primary/10"
        >
          View Setups
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Month
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all trades for {currentMonthName}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete all trades for {currentMonthName} {currentYear}. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onClearMonthTrades}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear Trades
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          onClick={onAddTrade} 
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={showTradeForm}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Trade
        </Button>
      </div>
    </div>
  );
};

export default JournalHeader;
