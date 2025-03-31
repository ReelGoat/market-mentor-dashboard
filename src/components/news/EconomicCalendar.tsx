import React, { useState } from 'react';
import { format } from 'date-fns';
import { EconomicEvent, FilterOptions } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

interface EconomicCalendarProps {
  events: EconomicEvent[];
  isLoading?: boolean;
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ events, isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    impactLevels: ['high', 'medium', 'low'],
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-loss text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-secondary text-primary';
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isInDateRange = 
      eventDate >= filterOptions.dateRange.from && 
      eventDate <= filterOptions.dateRange.to;
    
    const matchesImpact = filterOptions.impactLevels?.includes(event.impact) ?? true;
    
    const matchesSearch = 
      searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return isInDateRange && matchesImpact && matchesSearch;
  });

  const groupedEvents: { [date: string]: EconomicEvent[] } = {};
  
  filteredEvents.forEach(event => {
    const dateStr = format(new Date(event.date), 'yyyy-MM-dd');
    
    if (!groupedEvents[dateStr]) {
      groupedEvents[dateStr] = [];
    }
    
    groupedEvents[dateStr].push(event);
  });

  Object.keys(groupedEvents).forEach(date => {
    groupedEvents[date].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  const toggleImpactLevel = (level: 'high' | 'medium' | 'low') => {
    setFilterOptions(prev => {
      const currentLevels = prev.impactLevels || [];
      const newLevels = currentLevels.includes(level)
        ? currentLevels.filter(l => l !== level)
        : [...currentLevels, level];
      
      return {
        ...prev,
        impactLevels: newLevels
      };
    });
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="animate-pulse">
          <Skeleton className="h-6 w-64 mb-2" />
          <div className="rounded-md border border-border">
            <div className="h-10 bg-secondary/50" />
            {[1, 2, 3].map(j => (
              <div key={j} className="flex border-t border-border p-3">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12 ml-4" />
                <Skeleton className="h-6 w-48 ml-4 flex-grow" />
                <Skeleton className="h-6 w-16 ml-4" />
                <Skeleton className="h-6 w-16 ml-4" />
                <Skeleton className="h-6 w-16 ml-4" />
                <Skeleton className="h-6 w-16 ml-4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-cardDark border-border">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Economic Calendar (ForexFactory)</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isLoading}>
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Date Range</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{
                    from: filterOptions.dateRange.from,
                    to: filterOptions.dateRange.to
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setFilterOptions(prev => ({
                        ...prev,
                        dateRange: {
                          from: range.from,
                          to: range.to
                        }
                      }));
                    }
                  }}
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isLoading}>
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Impact Level</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-high" 
                          checked={filterOptions.impactLevels?.includes('high')}
                          onCheckedChange={() => toggleImpactLevel('high')}
                        />
                        <Label htmlFor="filter-high" className="flex items-center">
                          <Badge className="bg-loss mr-2">High</Badge>
                          High Impact
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-medium" 
                          checked={filterOptions.impactLevels?.includes('medium')}
                          onCheckedChange={() => toggleImpactLevel('medium')}
                        />
                        <Label htmlFor="filter-medium" className="flex items-center">
                          <Badge className="bg-amber-500 mr-2">Medium</Badge>
                          Medium Impact
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-low" 
                          checked={filterOptions.impactLevels?.includes('low')}
                          onCheckedChange={() => toggleImpactLevel('low')}
                        />
                        <Label htmlFor="filter-low" className="flex items-center">
                          <Badge className="bg-yellow-500 text-black mr-2">Low</Badge>
                          Low Impact
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <span>Date:</span> 
            <span className="ml-1">{format(filterOptions.dateRange.from, 'MMM d')} - {format(filterOptions.dateRange.to, 'MMM d, yyyy')}</span>
          </Badge>
          {filterOptions.impactLevels && filterOptions.impactLevels.length < 3 && (
            <Badge variant="outline" className="gap-1">
              <span>Impact:</span>
              <span className="ml-1 capitalize">{filterOptions.impactLevels.join(', ')}</span>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="outline" className="gap-1">
              <span>Search:</span>
              <span className="ml-1">{searchQuery}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          renderLoadingSkeleton()
        ) : Object.keys(groupedEvents).length > 0 ? (
          <div className="space-y-4">
            {Object.keys(groupedEvents)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map(date => (
                <div key={date} className="animate-fade-in">
                  <h3 className="font-medium text-lg mb-2">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="rounded-md border border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-secondary/50">
                            <th className="text-left py-2 px-4 font-medium text-sm">Time</th>
                            <th className="text-left py-2 px-4 font-medium text-sm">Currency</th>
                            <th className="text-left py-2 px-4 font-medium text-sm">Event</th>
                            <th className="text-center py-2 px-4 font-medium text-sm">Impact</th>
                            <th className="text-right py-2 px-4 font-medium text-sm">Previous</th>
                            <th className="text-right py-2 px-4 font-medium text-sm">Forecast</th>
                            <th className="text-right py-2 px-4 font-medium text-sm">Actual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedEvents[date].map(event => (
                            <tr key={event.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                              <td className="py-3 px-4 text-sm">
                                {format(new Date(event.date), 'h:mm a')}
                              </td>
                              <td className="py-3 px-4 font-medium">
                                {event.currency}
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <span className="font-medium">{event.title}</span>
                                  {event.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Badge className={cn("capitalize", getImpactColor(event.impact))}>
                                  {event.impact}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right text-sm">
                                {event.previous}
                              </td>
                              <td className="py-3 px-4 text-right text-sm">
                                {event.forecast}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-medium">
                                {event.actual ? event.actual : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No economic events found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EconomicCalendar;
