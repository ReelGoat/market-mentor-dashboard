
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trade } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceChartProps {
  trades: Trade[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades }) => {
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Process data for charts
  const processDataForChart = () => {
    if (trades.length === 0) return [];

    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Group data based on selected period
    const groupedData: { [key: string]: number } = {};
    
    sortedTrades.forEach(trade => {
      let dateKey;
      
      if (chartPeriod === 'daily') {
        dateKey = format(trade.date, 'yyyy-MM-dd');
      } else if (chartPeriod === 'weekly') {
        // This is a simplified approach - using the first day of week
        const weekStart = new Date(trade.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        dateKey = format(weekStart, 'yyyy-MM-dd');
      } else {
        dateKey = format(trade.date, 'yyyy-MM');
      }
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = 0;
      }
      
      groupedData[dateKey] += trade.pnl;
    });
    
    // Convert to chart data format
    return Object.entries(groupedData).map(([date, pnl]) => {
      const displayDate = chartPeriod === 'monthly' 
        ? format(new Date(date + '-01'), 'MMM yyyy')
        : chartPeriod === 'weekly'
          ? `Week of ${format(new Date(date), 'MMM d')}`
          : format(new Date(date), 'MMM d');
          
      return {
        date: displayDate,
        pnl,
        positive: pnl > 0 ? pnl : 0,
        negative: pnl < 0 ? pnl : 0,
      };
    });
  };

  const chartData = processDataForChart();
  
  // Calculate cumulative P&L for the line chart
  const cumulativeData = chartData.reduce((acc: any[], current, index) => {
    const previousValue = index > 0 ? acc[index - 1].cumulativePnl : 0;
    return [
      ...acc,
      {
        ...current,
        cumulativePnl: previousValue + current.pnl
      }
    ];
  }, []);

  // Find min and max values for better chart display
  const maxValue = Math.max(...cumulativeData.map(d => d.cumulativePnl), 0);
  const minValue = Math.min(...cumulativeData.map(d => d.cumulativePnl), 0);
  const buffer = Math.max(Math.abs(maxValue), Math.abs(minValue)) * 0.1;

  return (
    <Card className="bg-cardDark border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Performance Analysis</CardTitle>
            <CardDescription>Track your trading performance over time</CardDescription>
          </div>
          <Tabs defaultValue="daily" className="w-full sm:w-auto" onValueChange={(v) => setChartPeriod(v as any)}>
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <p className="text-sm text-muted-foreground mb-2">P&L by Period</p>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" tick={{ fill: '#999' }} />
                  <YAxis tick={{ fill: '#999' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                    formatter={(value: number) => [`${value.toFixed(2)} USD`, 'P&L']}
                  />
                  <Bar dataKey="positive" fill="#44FF44" />
                  <Bar dataKey="negative" fill="#FF4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No trade data available
              </div>
            )}
          </div>

          <div className="h-80">
            <p className="text-sm text-muted-foreground mb-2">Cumulative P&L</p>
            {cumulativeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cumulativeData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" tick={{ fill: '#999' }} />
                  <YAxis 
                    domain={[minValue - buffer, maxValue + buffer]} 
                    tick={{ fill: '#999' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                    formatter={(value: number) => [`${value.toFixed(2)} USD`, 'Cumulative P&L']} 
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativePnl"
                    stroke="#44FF44"
                    dot={{ stroke: '#44FF44', strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: '#FFF', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No trade data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
