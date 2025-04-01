
import { MarketCategory, MarketSymbol } from '@/types';

// Forex currency pairs
export const forexPairs: MarketSymbol[] = [
  { symbol: 'EUR/USD', category: 'forex', name: 'Euro / US Dollar' },
  { symbol: 'GBP/USD', category: 'forex', name: 'British Pound / US Dollar' },
  { symbol: 'USD/JPY', category: 'forex', name: 'US Dollar / Japanese Yen' },
  { symbol: 'USD/CHF', category: 'forex', name: 'US Dollar / Swiss Franc' },
  { symbol: 'USD/CAD', category: 'forex', name: 'US Dollar / Canadian Dollar' },
  { symbol: 'AUD/USD', category: 'forex', name: 'Australian Dollar / US Dollar' },
  { symbol: 'NZD/USD', category: 'forex', name: 'New Zealand Dollar / US Dollar' },
  { symbol: 'EUR/GBP', category: 'forex', name: 'Euro / British Pound' },
  { symbol: 'EUR/JPY', category: 'forex', name: 'Euro / Japanese Yen' },
  { symbol: 'GBP/JPY', category: 'forex', name: 'British Pound / Japanese Yen' },
  { symbol: 'AUD/JPY', category: 'forex', name: 'Australian Dollar / Japanese Yen' },
  { symbol: 'NZD/JPY', category: 'forex', name: 'New Zealand Dollar / Japanese Yen' },
  { symbol: 'CHF/JPY', category: 'forex', name: 'Swiss Franc / Japanese Yen' },
  { symbol: 'EUR/AUD', category: 'forex', name: 'Euro / Australian Dollar' },
  { symbol: 'EUR/CAD', category: 'forex', name: 'Euro / Canadian Dollar' },
  { symbol: 'EUR/CHF', category: 'forex', name: 'Euro / Swiss Franc' },
];

// Metals
export const metalsPairs: MarketSymbol[] = [
  { symbol: 'XAU/USD', category: 'metals', name: 'Gold / US Dollar' },
  { symbol: 'XAG/USD', category: 'metals', name: 'Silver / US Dollar' },
  { symbol: 'XPT/USD', category: 'metals', name: 'Platinum / US Dollar' },
  { symbol: 'XPD/USD', category: 'metals', name: 'Palladium / US Dollar' },
  { symbol: 'COPPER', category: 'metals', name: 'Copper Futures' },
  { symbol: 'ALUMINUM', category: 'metals', name: 'Aluminum Futures' },
];

// Cryptocurrencies
export const cryptoPairs: MarketSymbol[] = [
  { symbol: 'BTC/USD', category: 'crypto', name: 'Bitcoin / US Dollar' },
  { symbol: 'ETH/USD', category: 'crypto', name: 'Ethereum / US Dollar' },
  { symbol: 'XRP/USD', category: 'crypto', name: 'Ripple / US Dollar' },
  { symbol: 'LTC/USD', category: 'crypto', name: 'Litecoin / US Dollar' },
  { symbol: 'BCH/USD', category: 'crypto', name: 'Bitcoin Cash / US Dollar' },
  { symbol: 'ADA/USD', category: 'crypto', name: 'Cardano / US Dollar' },
  { symbol: 'DOT/USD', category: 'crypto', name: 'Polkadot / US Dollar' },
  { symbol: 'LINK/USD', category: 'crypto', name: 'Chainlink / US Dollar' },
  { symbol: 'BNB/USD', category: 'crypto', name: 'Binance Coin / US Dollar' },
  { symbol: 'SOL/USD', category: 'crypto', name: 'Solana / US Dollar' },
];

// Stock indices
export const indicesPairs: MarketSymbol[] = [
  { symbol: 'US30', category: 'indices', name: 'Dow Jones Industrial Average' },
  { symbol: 'SPX500', category: 'indices', name: 'S&P 500' },
  { symbol: 'NAS100', category: 'indices', name: 'Nasdaq 100' },
  { symbol: 'UK100', category: 'indices', name: 'FTSE 100' },
  { symbol: 'GER40', category: 'indices', name: 'DAX 40' },
  { symbol: 'FRA40', category: 'indices', name: 'CAC 40' },
  { symbol: 'JPN225', category: 'indices', name: 'Nikkei 225' },
  { symbol: 'AUS200', category: 'indices', name: 'ASX 200' },
  { symbol: 'HK50', category: 'indices', name: 'Hang Seng' },
];

// Popular stocks
export const stockSymbols: MarketSymbol[] = [
  { symbol: 'AAPL', category: 'stocks', name: 'Apple Inc.' },
  { symbol: 'MSFT', category: 'stocks', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', category: 'stocks', name: 'Amazon.com Inc.' },
  { symbol: 'GOOGL', category: 'stocks', name: 'Alphabet Inc.' },
  { symbol: 'META', category: 'stocks', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', category: 'stocks', name: 'Tesla Inc.' },
  { symbol: 'NVDA', category: 'stocks', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', category: 'stocks', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', category: 'stocks', name: 'Visa Inc.' },
  { symbol: 'WMT', category: 'stocks', name: 'Walmart Inc.' },
];

// Commodities
export const commoditySymbols: MarketSymbol[] = [
  { symbol: 'CL', category: 'commodities', name: 'Crude Oil Futures' },
  { symbol: 'NG', category: 'commodities', name: 'Natural Gas Futures' },
  { symbol: 'HO', category: 'commodities', name: 'Heating Oil Futures' },
  { symbol: 'RB', category: 'commodities', name: 'RBOB Gasoline Futures' },
  { symbol: 'ZC', category: 'commodities', name: 'Corn Futures' },
  { symbol: 'ZW', category: 'commodities', name: 'Wheat Futures' },
  { symbol: 'ZS', category: 'commodities', name: 'Soybean Futures' },
  { symbol: 'KC', category: 'commodities', name: 'Coffee Futures' },
  { symbol: 'SB', category: 'commodities', name: 'Sugar Futures' },
];

// Get all market symbols
export const getAllMarketSymbols = (): MarketSymbol[] => {
  return [
    ...forexPairs,
    ...metalsPairs,
    ...cryptoPairs,
    ...indicesPairs,
    ...stockSymbols,
    ...commoditySymbols
  ];
};

// Get market symbols by category
export const getMarketSymbolsByCategory = (category: MarketCategory): MarketSymbol[] => {
  switch (category) {
    case 'forex':
      return forexPairs;
    case 'metals':
      return metalsPairs;
    case 'crypto':
      return cryptoPairs;
    case 'indices':
      return indicesPairs;
    case 'stocks':
      return stockSymbols;
    case 'commodities':
      return commoditySymbols;
    default:
      return [];
  }
};
