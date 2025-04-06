
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import EconomicCalendar from '@/components/news/EconomicCalendar';
import CurrencyStrengthChart from '@/components/news/CurrencyStrengthChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateMockEvents } from '@/utils/mockData';
import { fetchAggregatedEconomicEvents } from '@/services/economicDataService';
import { toast } from 'sonner';

const NewsEvents: React.FC = () => {
  // Set query to auto-refresh daily (24 hours in milliseconds)
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  
  const { data: economicEvents, isLoading, error, refetch } = useQuery({
    queryKey: ['economicEvents'],
    queryFn: fetchAggregatedEconomicEvents,
    staleTime: ONE_DAY_MS, // 1 day
    refetchInterval: ONE_DAY_MS, // Auto-refresh every day
    retry: 2,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Handle errors and use mock data as fallback
  const events = React.useMemo(() => {
    if (error) {
      console.error('Error fetching economic events:', error);
      toast.error('Failed to load economic events. Using mock data instead.');
      return generateMockEvents();
    }
    return economicEvents || [];
  }, [economicEvents, error]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Weekly Market Calendar</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { 
              refetch();
              toast.info('Refreshing economic calendar data...');
            }}
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card className="bg-cardDark/50 border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Info className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-base">Data Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p>
                Economic calendar data is sourced from BabyPips and other providers. 
                The calendar shows important economic events that may impact financial markets.
              </p>
            </div>
          </CardContent>
        </Card>

        <CurrencyStrengthChart />

        <Card className="bg-cardDark/50 border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertTriangle className="h-5 w-5 text-profit" />
            <CardTitle className="text-base">Trading Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="mb-2">
                High-impact news events can cause significant market volatility. Consider these strategies:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Avoid trading 15 minutes before and after major news releases</li>
                <li>Be aware of widening spreads during volatile market conditions</li>
                <li>Use proper risk management - reduce position size during high-impact events</li>
                <li>Consider closing positions before major announcements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <EconomicCalendar events={events} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default NewsEvents;
