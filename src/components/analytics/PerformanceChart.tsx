
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';

interface PerformanceChartProps {
  data?: { date: string; pnl: number }[];
  trades?: any[]; // Support for trades prop
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data = [], trades = [] }) => {
  // Transform trades into the required format if trades are provided and no data is provided
  const chartData = data.length > 0 ? data : trades.map(trade => {
    const tradeDate = new Date(trade.date);
    return {
      date: format(tradeDate, 'MMM d, HH:mm'),
      pnl: trade.pnl,
      session: trade.session || 'Unknown',
      time: format(tradeDate, 'HH:mm')
    };
  });

  // Calculate the average PnL for reference
  const avgPnl = chartData.length > 0
    ? chartData.reduce((sum, item) => sum + item.pnl, 0) / chartData.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toString().split(',')[0]} // Show just the date part for readability
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${Number(value) > 0 ? '+' : ''}${Number(value).toFixed(2)}`, 
                'P&L'
              ]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ backgroundColor: '#1e1e2f', borderColor: '#2d2d4d' }}
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            {avgPnl !== 0 && <ReferenceLine y={avgPnl} stroke="#8884d8" strokeDasharray="3 3" label="Avg" />}
            <Line 
              type="monotone" 
              dataKey="pnl" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              dot={{ 
                stroke: '#8884d8',
                strokeWidth: 2,
                fill: '#1e1e2f',
                r: 4
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
