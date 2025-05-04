
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PerformanceChartProps {
  data?: { date: string; pnl: number }[];
  trades?: any[]; // Add trades prop to match what's passed in Performance.tsx
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data = [], trades = [] }) => {
  // Transform trades into the required format if trades are provided and no data is provided
  const chartData = data.length > 0 ? data : trades.map(trade => ({
    date: new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pnl: trade.pnl
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pnl" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
