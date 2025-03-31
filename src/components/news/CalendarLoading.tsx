
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const CalendarLoading: React.FC = () => {
  return (
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
};

export default CalendarLoading;
