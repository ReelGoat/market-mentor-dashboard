import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Trading Helper App</h1>
          <p className="text-xl text-muted-foreground">
            Track your trades, monitor economic events, and analyze your performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link to="/journal" className="block">
            <div className="bg-cardDark rounded-lg p-6 text-center h-full flex flex-col space-y-4 hover:bg-secondary/20 transition-colors border border-border">
              <h2 className="text-2xl font-semibold">Trading Journal</h2>
              <p className="text-muted-foreground flex-grow">
                Record and track your trades with notes and screenshots.
              </p>
              <Button variant="outline" className="mt-4 w-full">Journal</Button>
            </div>
          </Link>

          <Link to="/calendar" className="block">
            <div className="bg-cardDark rounded-lg p-6 text-center h-full flex flex-col space-y-4 hover:bg-secondary/20 transition-colors border border-border">
              <h2 className="text-2xl font-semibold">Economic Calendar</h2>
              <p className="text-muted-foreground flex-grow">
                Stay updated with important economic events and announcements.
              </p>
              <Button variant="outline" className="mt-4 w-full">Calendar</Button>
            </div>
          </Link>

          <Link to="/performance" className="block">
            <div className="bg-cardDark rounded-lg p-6 text-center h-full flex flex-col space-y-4 hover:bg-secondary/20 transition-colors border border-border">
              <h2 className="text-2xl font-semibold">Performance Analytics</h2>
              <p className="text-muted-foreground flex-grow">
                Analyze your trading performance with detailed metrics and charts.
              </p>
              <Button variant="outline" className="mt-4 w-full">Analytics</Button>
            </div>
          </Link>
        </div>
        
        <div className="text-center mt-12">
          {user ? (
            <p className="text-muted-foreground">
              Logged in as {user.email}
            </p>
          ) : (
            <Link to="/auth">
              <Button size="lg">
                Sign In / Create Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
