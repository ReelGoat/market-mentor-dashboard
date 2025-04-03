import React, { useState } from 'react';
import { Menu, X, BarChart3, Calendar, FileClock, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import InstallPrompt from './InstallPrompt';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    {
      name: 'Trading Journal',
      icon: <Calendar className="h-5 w-5" />,
      path: '/journal',
    },
    {
      name: 'News & Events',
      icon: <FileClock className="h-5 w-5" />,
      path: '/news',
    },
    {
      name: 'Performance',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/performance',
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-cardDark transform transition-all duration-300 ease-in-out", 
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-profit mr-2" />
            <span className="text-xl font-bold">TradingAssist</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6 px-2">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm w-full rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-secondary text-primary" 
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:pl-64" : "pl-0"
      )}>
        {/* Header */}
        <header className="bg-cardDark shadow-md">
          <div className="flex items-center justify-between h-16 px-4">
            <button onClick={toggleSidebar} className="text-gray-500">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">Trading Assistant</h1>
            <div className="w-6" /> {/* Empty div for flex alignment */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        
        {/* Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
};

export default MainLayout;
