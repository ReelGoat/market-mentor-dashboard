import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { CalendarEvents } from '@/components/calendar/CalendarEvents';

const Calendar: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Economic Calendar</h1>
          <CalendarEvents />
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar; 