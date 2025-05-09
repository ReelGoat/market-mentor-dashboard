
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, ArrowLeft } from 'lucide-react';
import { fetchSetups, saveSetup, deleteSetup } from '@/services/setupsService';

interface TradingSetup {
  id?: string;
  name: string;
  description: string;
  marketType: string;
  timeframe: string;
  riskReward: number;
  winRate: number;
  notes: string;
  imageUrl?: string;
}

const TradingSetups: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const [setups, setSetups] = useState<TradingSetup[]>([]);
  const [isLoadingSetups, setIsLoadingSetups] = useState<boolean>(true);
  const [selectedSetup, setSelectedSetup] = useState<TradingSetup | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<TradingSetup>({
    name: '',
    description: '',
    marketType: 'forex',
    timeframe: 'H1',
    riskReward: 2,
    winRate: 50,
    notes: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadSetups = async () => {
      setIsLoadingSetups(true);
      try {
        // This is a placeholder - setupsService needs to be implemented
        const setupsData = await fetchSetups();
        setSetups(setupsData || []);
      } catch (error) {
        console.error("Error loading setups:", error);
        toast({
          title: "Error",
          description: "Failed to load your trading setups. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSetups(false);
      }
    };

    if (user) {
      loadSetups();
    }
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
  };

  const handleCreateNew = () => {
    setIsEditing(true);
    setSelectedSetup(null);
    setFormData({
      name: '',
      description: '',
      marketType: 'forex',
      timeframe: 'H1',
      riskReward: 2,
      winRate: 50,
      notes: ''
    });
  };

  const handleEditSetup = (setup: TradingSetup) => {
    setIsEditing(true);
    setSelectedSetup(setup);
    setFormData(setup);
  };

  const handleSelectSetup = (setup: TradingSetup) => {
    setSelectedSetup(setup);
    setIsEditing(false);
  };

  const handleSaveSetup = async () => {
    try {
      // This is a placeholder - setupsService needs to be implemented
      const savedSetup = await saveSetup({
        ...formData,
        id: selectedSetup?.id
      });
      
      if (selectedSetup?.id) {
        // Update existing setup in the list
        setSetups(prevSetups => prevSetups.map(s => 
          s.id === savedSetup.id ? savedSetup : s
        ));
        toast({
          title: "Setup Updated",
          description: `Trading setup "${savedSetup.name}" has been updated.`
        });
      } else {
        // Add new setup to the list
        setSetups(prevSetups => [...prevSetups, savedSetup]);
        toast({
          title: "Setup Created",
          description: `New trading setup "${savedSetup.name}" has been created.`
        });
      }
      
      setIsEditing(false);
      setSelectedSetup(savedSetup);
    } catch (error) {
      console.error("Error saving setup:", error);
      toast({
        title: "Error",
        description: "Failed to save trading setup. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSetup = async (id: string) => {
    try {
      // This is a placeholder - setupsService needs to be implemented
      await deleteSetup(id);
      
      setSetups(prevSetups => prevSetups.filter(s => s.id !== id));
      
      if (selectedSetup?.id === id) {
        setSelectedSetup(null);
      }
      
      toast({
        title: "Setup Deleted",
        description: "Trading setup has been deleted."
      });
    } catch (error) {
      console.error("Error deleting setup:", error);
      toast({
        title: "Error",
        description: "Failed to delete trading setup. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedSetup) {
      setFormData(selectedSetup);
    }
  };
  
  const handleBackToJournal = () => {
    navigate('/journal');
  };

  const renderSetupsList = () => (
    <Card className="min-h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Trading Setups</CardTitle>
        <Button 
          onClick={handleCreateNew}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Setup
        </Button>
      </CardHeader>
      <CardContent>
        {isLoadingSetups ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : setups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any trading setups yet.</p>
            <Button 
              onClick={handleCreateNew}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Create Your First Setup
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setups.map(setup => (
              <div 
                key={setup.id} 
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all
                  ${selectedSetup?.id === setup.id ? 'border-primary bg-secondary/50' : 'border-border hover:border-primary/50 hover:bg-secondary/20'}
                `}
                onClick={() => handleSelectSetup(setup)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{setup.name}</h3>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    {setup.marketType}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{setup.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Win rate: {setup.winRate}%</span>
                  <span>R:R: {setup.riskReward}:1</span>
                  <span>TF: {setup.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSetupDetail = () => (
    <Card className="min-h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setSelectedSetup(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{selectedSetup?.name}</CardTitle>
        </div>
        <Button 
          onClick={() => handleEditSetup(selectedSetup!)}
          variant="outline"
        >
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                {selectedSetup?.marketType}
              </span>
              <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                {selectedSetup?.timeframe}
              </span>
            </div>
            
            <h4 className="font-medium text-sm">Description</h4>
            <p className="text-muted-foreground">{selectedSetup?.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm">Win Rate</h4>
              <p className="text-xl font-bold">{selectedSetup?.winRate}%</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Risk to Reward</h4>
              <p className="text-xl font-bold">{selectedSetup?.riskReward}:1</p>
            </div>
          </div>
          
          {selectedSetup?.notes && (
            <div>
              <h4 className="font-medium text-sm">Notes</h4>
              <div className="bg-secondary/30 p-3 rounded mt-1">
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedSetup.notes}</p>
              </div>
            </div>
          )}
          
          {selectedSetup?.imageUrl && (
            <div>
              <h4 className="font-medium text-sm">Chart Example</h4>
              <div className="mt-1 rounded overflow-hidden">
                <img src={selectedSetup.imageUrl} alt="Chart setup" className="w-full" />
              </div>
            </div>
          )}
          
          <div className="pt-4 flex justify-end">
            <Button 
              variant="destructive"
              onClick={() => selectedSetup?.id && handleDeleteSetup(selectedSetup.id)}
            >
              Delete Setup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSetupForm = () => (
    <Card className="min-h-[500px]">
      <CardHeader>
        <CardTitle>{selectedSetup ? 'Edit Trading Setup' : 'Create New Setup'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveSetup(); }}>
          <div>
            <Label htmlFor="name">Setup Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g., Break and Retest Strategy" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marketType">Market Type</Label>
              <Select 
                value={formData.marketType} 
                onValueChange={(value) => handleSelectChange('marketType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="indices">Indices</SelectItem>
                  <SelectItem value="commodities">Commodities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select 
                value={formData.timeframe} 
                onValueChange={(value) => handleSelectChange('timeframe', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M1">1 Minute (M1)</SelectItem>
                  <SelectItem value="M5">5 Minutes (M5)</SelectItem>
                  <SelectItem value="M15">15 Minutes (M15)</SelectItem>
                  <SelectItem value="M30">30 Minutes (M30)</SelectItem>
                  <SelectItem value="H1">1 Hour (H1)</SelectItem>
                  <SelectItem value="H4">4 Hours (H4)</SelectItem>
                  <SelectItem value="D1">Daily (D1)</SelectItem>
                  <SelectItem value="W1">Weekly (W1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Describe your trading setup..." 
              className="h-20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="winRate">Win Rate (%)</Label>
              <Input 
                id="winRate" 
                name="winRate" 
                type="number" 
                min="0" 
                max="100" 
                value={formData.winRate} 
                onChange={handleNumberChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="riskReward">Risk to Reward Ratio</Label>
              <Input 
                id="riskReward" 
                name="riskReward" 
                type="number" 
                step="0.1" 
                min="0.1" 
                value={formData.riskReward} 
                onChange={handleNumberChange} 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes and Rules</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleInputChange} 
              placeholder="Add trading rules, entry/exit conditions, etc." 
              className="h-32"
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
              <Save className="mr-2 h-4 w-4" />
              {selectedSetup ? 'Update Setup' : 'Save Setup'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trading Setups & Strategies</h1>
        <Button variant="outline" onClick={handleBackToJournal}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Journal
        </Button>
      </div>
      
      {isEditing ? (
        renderSetupForm()
      ) : selectedSetup ? (
        renderSetupDetail()
      ) : (
        renderSetupsList()
      )}
    </MainLayout>
  );
};

export default TradingSetups;
