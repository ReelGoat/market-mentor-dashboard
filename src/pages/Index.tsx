
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Calendar, FileClock, PieChart } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <header className="bg-cardDark">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-left mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <PieChart className="h-10 w-10 text-profit mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold">Trading Assistant</h1>
            </div>
            <p className="text-xl md:text-2xl mb-6 text-muted-foreground">
              Professional analytics and journal for serious traders
            </p>
            <div className="flex space-x-4">
              <Button 
                onClick={() => navigate('/journal')}
                className="bg-profit text-black hover:bg-profit/90"
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-md bg-black p-4 rounded-lg shadow-lg">
              <div className="aspect-video bg-cardDark rounded-md flex items-center justify-center">
                <BarChart3 className="h-24 w-24 text-profit opacity-25" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Powerful Trading Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-cardDark border-border hover:bg-secondary/50 transition-colors">
            <CardHeader>
              <Calendar className="h-12 w-12 mb-2 text-profit" />
              <CardTitle>Trading Journal</CardTitle>
              <CardDescription>Track your trades with detailed analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Interactive calendar interface</li>
                <li>• Comprehensive trade entry form</li>
                <li>• Screenshot upload capability</li>
                <li>• Notes and trade analysis</li>
              </ul>
              <Button 
                variant="link" 
                className="mt-4 pl-0 text-profit" 
                onClick={() => navigate('/journal')}
              >
                Open Journal <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-cardDark border-border hover:bg-secondary/50 transition-colors">
            <CardHeader>
              <FileClock className="h-12 w-12 mb-2 text-profit" />
              <CardTitle>Economic Calendar</CardTitle>
              <CardDescription>Stay informed with market-moving events</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time economic data</li>
                <li>• Impact-based color coding</li>
                <li>• Customizable filters</li>
                <li>• Forecast vs. actual analysis</li>
              </ul>
              <Button 
                variant="link" 
                className="mt-4 pl-0 text-profit" 
                onClick={() => navigate('/news')}
              >
                View Calendar <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-cardDark border-border hover:bg-secondary/50 transition-colors">
            <CardHeader>
              <BarChart3 className="h-12 w-12 mb-2 text-profit" />
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Visualize and improve your trading</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Detailed performance metrics</li>
                <li>• Interactive charts</li>
                <li>• Symbol breakdown</li>
                <li>• Win rate and profit analysis</li>
              </ul>
              <Button 
                variant="link" 
                className="mt-4 pl-0 text-profit" 
                onClick={() => navigate('/performance')}
              >
                View Analytics <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-cardDark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to improve your trading?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Start tracking your trades, monitor important economic events, and analyze your performance with powerful tools designed for serious traders.
          </p>
          <Button 
            onClick={() => navigate('/journal')}
            className="bg-profit text-black hover:bg-profit/90"
            size="lg"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Trading Assistant App - Professional tools for serious traders</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
