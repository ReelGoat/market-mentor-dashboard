
import MainLayout from '../components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Book, ListCheck } from 'lucide-react';

const StrategyRules = () => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Trading Strategy & Rules</h1>
        
        <Tabs defaultValue="strategies" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="rules">Trading Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategies" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  <CardTitle>Trading Strategies</CardTitle>
                </div>
                <CardDescription>
                  Define and document your core trading strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/20 p-6 rounded-md">
                  <p className="text-muted-foreground text-center">
                    Add your first trading strategy by clicking the button below.
                  </p>
                  <div className="flex justify-center mt-4">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      Add Strategy
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rules" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>Trading Rules</CardTitle>
                </div>
                <CardDescription>
                  Define your personal trading rules to maintain discipline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/20 p-6 rounded-md">
                  <p className="text-muted-foreground text-center">
                    Add your first trading rule by clicking the button below.
                  </p>
                  <div className="flex justify-center mt-4">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2">
                      <ListCheck className="h-4 w-4" />
                      Add Rule
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StrategyRules;
