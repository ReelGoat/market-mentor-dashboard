
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TradingSetup, fetchSetups, saveSetup, deleteSetup } from '@/services/setupsService';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MarketCategory } from '@/types';

const TradingSetups: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [setups, setSetups] = useState<TradingSetup[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('list');
  const [editingSetup, setEditingSetup] = useState<TradingSetup | null>(null);

  // Form fields
  const [setupName, setSetupName] = useState('');
  const [setupDescription, setSetupDescription] = useState('');
  const [marketType, setMarketType] = useState<string>('forex');
  const [timeframe, setTimeframe] = useState('H1');
  const [riskReward, setRiskReward] = useState('2');
  const [winRate, setWinRate] = useState('60');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/auth');
      return;
    }

    loadSetups();
  }, [user, isAuthLoading, navigate]);

  const loadSetups = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSetups();
      setSetups(data);
    } catch (error) {
      console.error("Error loading setups:", error);
      toast({
        title: "Error",
        description: "Failed to load trading setups.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSetup = () => {
    setEditingSetup(null);
    resetForm();
    setCurrentTab('create');
  };

  const handleEditSetup = (setup: TradingSetup) => {
    setEditingSetup(setup);
    setSetupName(setup.name);
    setSetupDescription(setup.description || '');
    setMarketType(setup.marketType);
    setTimeframe(setup.timeframe);
    setRiskReward(setup.riskReward.toString());
    setWinRate(setup.winRate.toString());
    setNotes(setup.notes || '');
    setCurrentTab('create');
  };

  const handleDeleteSetup = async (setupId: string) => {
    try {
      await deleteSetup(setupId);
      setSetups(setups.filter(setup => setup.id !== setupId));
      toast({
        title: "Setup Deleted",
        description: "Trading setup was successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting setup:", error);
      toast({
        title: "Error",
        description: "Failed to delete trading setup.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSetupName('');
    setSetupDescription('');
    setMarketType('forex');
    setTimeframe('H1');
    setRiskReward('2');
    setWinRate('60');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!setupName) {
      toast({
        title: "Validation Error",
        description: "Setup name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const setupData: TradingSetup = {
        id: editingSetup?.id,
        name: setupName,
        description: setupDescription,
        marketType,
        timeframe,
        riskReward: parseFloat(riskReward),
        winRate: parseFloat(winRate),
        notes,
      };

      const savedSetup = await saveSetup(setupData);
      
      if (editingSetup) {
        setSetups(setups.map(s => s.id === savedSetup.id ? savedSetup : s));
        toast({
          title: "Setup Updated",
          description: "Trading setup was successfully updated.",
        });
      } else {
        setSetups([savedSetup, ...setups]);
        toast({
          title: "Setup Created",
          description: "New trading setup was successfully created.",
        });
      }
      
      resetForm();
      setCurrentTab('list');
    } catch (error) {
      console.error("Error saving setup:", error);
      toast({
        title: "Error",
        description: "Failed to save trading setup.",
        variant: "destructive",
      });
    }
  };

  const marketCategories: { label: string; value: string }[] = [
    { label: 'Forex', value: 'forex' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Stocks', value: 'stocks' },
    { label: 'Indices', value: 'indices' },
    { label: 'Commodities', value: 'commodities' },
    { label: 'Metals', value: 'metals' },
  ];

  const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'];

  if (isAuthLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trading Setups</h1>
          <Button 
            onClick={() => navigate('/journal')}
            variant="outline"
            className="border-primary hover:bg-primary/10"
          >
            Back to Journal
          </Button>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list">My Setups</TabsTrigger>
              <TabsTrigger value="create">{editingSetup ? 'Edit Setup' : 'Create Setup'}</TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={handleCreateSetup} 
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Setup
            </Button>
          </div>

          <TabsContent value="list">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : setups.length === 0 ? (
              <div className="text-center py-12 bg-cardDark rounded-lg card-gradient">
                <h3 className="text-xl font-medium mb-2">No Trading Setups</h3>
                <p className="text-muted-foreground mb-6">You haven't created any trading setups yet.</p>
                <Button 
                  onClick={handleCreateSetup} 
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Setup
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setups.map((setup) => (
                  <Card key={setup.id} className="card-gradient">
                    <CardHeader>
                      <CardTitle>{setup.name}</CardTitle>
                      <CardDescription>{setup.marketType} / {setup.timeframe}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{setup.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Win Rate</p>
                          <p className="text-2xl font-bold">{setup.winRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Risk:Reward</p>
                          <p className="text-2xl font-bold">{setup.riskReward}:1</p>
                        </div>
                      </div>
                      
                      {setup.notes && (
                        <div>
                          <p className="text-sm font-medium mb-1">Notes:</p>
                          <p className="text-sm text-muted-foreground">{setup.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditSetup(setup)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-loss hover:text-loss">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Trading Setup?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the "{setup.name}" trading setup.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => setup.id && handleDeleteSetup(setup.id)}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>{editingSetup ? 'Edit Trading Setup' : 'Create Trading Setup'}</CardTitle>
                <CardDescription>
                  Define your trading strategy to help track performance and maintain consistency.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Setup Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g., London Breakout" 
                      value={setupName}
                      onChange={(e) => setSetupName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Brief description of your trading setup or strategy..."
                      value={setupDescription}
                      onChange={(e) => setSetupDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marketType">Market Type</Label>
                      <Select 
                        value={marketType} 
                        onValueChange={setMarketType}
                      >
                        <SelectTrigger id="marketType">
                          <SelectValue placeholder="Select market" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Select 
                        value={timeframe} 
                        onValueChange={setTimeframe}
                      >
                        <SelectTrigger id="timeframe">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map((tf) => (
                            <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="winRate">Expected Win Rate (%)</Label>
                      <Input 
                        id="winRate" 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={winRate}
                        onChange={(e) => setWinRate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="riskReward">Risk-Reward Ratio</Label>
                      <Input 
                        id="riskReward" 
                        type="number" 
                        min="0.1" 
                        step="0.1" 
                        value={riskReward}
                        onChange={(e) => setRiskReward(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes/Rules</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Entry/exit rules, indicators, or any other important details..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setCurrentTab('list');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    {editingSetup ? 'Update Setup' : 'Save Setup'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TradingSetups;
