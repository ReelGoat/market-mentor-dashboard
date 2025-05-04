
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  time: string;
  currency: string;
  title: string;
  impact: string;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
}

interface CalendarResponse {
  events: CalendarEvent[];
  last_updated: string;
  cached: boolean;
}

const impactColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

export function CalendarEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/api/calendar');
        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }
        
        const data: CalendarResponse = await response.json();
        setEvents(data.events);
        setLastUpdated(data.last_updated);
        setIsCached(data.cached);
        
        if (data.cached) {
          toast({
            title: "Using cached data",
            description: "Showing latest available economic events",
            variant: "default",
          });
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: "Error loading calendar",
          description: err instanceof Error ? err.message : 'Failed to load economic events',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    
    // Refresh every 15 minutes
    const interval = setInterval(fetchEvents, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Economic Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Economic Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 text-red-500 text-center">
            <AlertTriangle size={24} />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Economic Calendar</CardTitle>
          {lastUpdated && (
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant={isCached ? "outline" : "default"}
                className={`text-sm ${isCached ? "border-yellow-500 text-yellow-500" : ""}`}
              >
                {isCached && <AlertTriangle size={12} className="mr-1" />}
                Last updated: {format(parseISO(lastUpdated), 'MMM d, h:mm a')}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                No economic events found
              </div>
            ) : (
              events.map((event: CalendarEvent, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.currency}</span>
                        <Badge
                          className={`${impactColors[event.impact as keyof typeof impactColors]} text-white`}
                        >
                          {event.impact}
                        </Badge>
                      </div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                    <div className="text-right space-y-1">
                      {event.actual && (
                        <div className="text-sm">
                          <span className="text-gray-500">Actual: </span>
                          <span className="font-medium">{event.actual}</span>
                        </div>
                      )}
                      {event.forecast && (
                        <div className="text-sm">
                          <span className="text-gray-500">Forecast: </span>
                          <span className="font-medium">{event.forecast}</span>
                        </div>
                      )}
                      {event.previous && (
                        <div className="text-sm">
                          <span className="text-gray-500">Previous: </span>
                          <span className="font-medium">{event.previous}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
