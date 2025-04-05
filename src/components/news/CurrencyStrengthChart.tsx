
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCurrencyStrength, CurrencyStrength } from '@/services/currencyStrengthService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CurrencyStrengthChart: React.FC = () => {
  const [currencyStrengths, setCurrencyStrengths] = useState<CurrencyStrength[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // Color mapping for currencies
  const currencyColors: Record<string, string> = {
    USD: '#44ff44', // Green (using the profit color from theme)
    EUR: '#4488ff',
    GBP: '#aa44ff', 
    JPY: '#ff4444', // Red (using the loss color from theme)
    AUD: '#ffaa44',
    CAD: '#44ffff',
    CHF: '#ff44aa',
    NZD: '#ffff44'
  };

  // Function to fetch the data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const data = await fetchCurrencyStrength();
      setCurrencyStrengths(data);
    } catch (error) {
      console.error("Error fetching currency strength data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize data and set up refresh interval
  useEffect(() => {
    fetchData();
    
    // Set up interval to refresh every 3 seconds
    intervalRef.current = window.setInterval(() => {
      fetchData();
    }, 3000);
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Define chart configuration
  const chartConfig = currencyStrengths.reduce((acc, { currency }) => {
    return {
      ...acc,
      [currency]: {
        label: currency,
        color: currencyColors[currency] || '#FFFFFF'
      }
    };
  }, {});

  // Format data for the chart
  const chartData = currencyStrengths.map(({ currency, strength, change }) => ({
    name: currency,
    value: strength,
    change
  }));

  return (
    <Card className="bg-cardDark/50 border-border mt-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-profit" />
            <CardTitle className="text-base">Currency Strength Meter</CardTitle>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <div>Auto-refreshes every 3s</div>
            <RefreshCcw className={cn(
              "h-4 w-4", 
              refreshing && "animate-spin",
              loading ? "text-muted-foreground" : "text-primary"
            )} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <RefreshCcw className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ChartContainer className="h-full" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  barCategoryGap={8}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    scale="band"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      
                      const data = payload[0].payload;
                      return (
                        <ChartTooltipContent>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 font-medium">
                              <div className="rounded-full h-3 w-3" style={{ 
                                backgroundColor: currencyColors[data.name] || '#FFFFFF' 
                              }}></div>
                              <span>{data.name}</span>
                            </div>
                            <div className="text-xs">
                              <div>Strength: {data.value.toFixed(1)}</div>
                              <div className="flex items-center gap-1">
                                Change: 
                                <span className={data.change >= 0 ? "text-profit" : "text-loss"}>
                                  {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)}
                                  {data.change >= 0 
                                    ? <TrendingUp className="inline h-3 w-3 ml-1" /> 
                                    : <TrendingDown className="inline h-3 w-3 ml-1" />
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </ChartTooltipContent>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={currencyColors[entry.name] || '#FFFFFF'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currencyStrengths.map(({ currency, change }) => (
            <div key={currency} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: currencyColors[currency] || '#FFFFFF' }}
              ></div>
              <span className="font-medium">{currency}</span>
              <span className={cn(
                "ml-auto text-xs",
                change >= 0 ? "text-profit" : "text-loss"
              )}>
                {change >= 0 ? "+" : ""}{change.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyStrengthChart;
