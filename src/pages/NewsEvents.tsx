
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EconomicCalendar from '@/components/news/EconomicCalendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';
import { generateMockEvents } from '@/utils/mockData';

const NewsEvents: React.FC = () => {
  // Generate mock economic events
  const economicEvents = generateMockEvents();

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">News & Events</h1>

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

        <EconomicCalendar events={economicEvents} />
      </div>
    </MainLayout>
  );
};

export default NewsEvents;
