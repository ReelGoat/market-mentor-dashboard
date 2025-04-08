
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CurrencyStrengthChart from '@/components/news/CurrencyStrengthChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info } from 'lucide-react';

const NewsEvents: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Market Analysis</h1>
        </div>

        <Card className="bg-cardDark/50 border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Info className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-base">Market Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p>
                This page displays currency strength analysis to help you make informed trading decisions.
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
                Consider these strategies for better trading results:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Monitor currency strength before placing trades</li>
                <li>Be aware of widening spreads during volatile market conditions</li>
                <li>Use proper risk management - reduce position size during high volatility</li>
                <li>Maintain a consistent trading journal to track your performance</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NewsEvents;
