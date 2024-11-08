import { useState, useEffect, useCallback, useMemo } from 'react';
import { PriceServiceConnection, PriceFeed } from '@pythnetwork/price-service-client';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
interface PriceHistory {
  timestamp: number;
  price: number;
}

interface SolanaPriceData {
  currentPrice: number | null;
  priceChange: {
    usd: number;
    percentage: number;
  };
  priceHistory: PriceHistory[];
  dayRange: {
    high: number;
    low: number;
  };
}

interface SolanaPriceHook extends SolanaPriceData {
  solToUsd: (solAmount: number) => number;
  usdToSol: (usdAmount: number) => number;
  formatUsd: (amount: number) => string;
  formatSol: (amount: number) => string;
  isLoading: boolean;
  error: Error | null;
  lastUpdate: Date | null;
}

export const useSolanaPrice = (): SolanaPriceHook => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // SOL/USD price feed ID on Pyth
  const SOL_USD_PRICE_FEED = "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d";

  const priceChange = useMemo(() => {
    if (priceHistory.length < 2) {
      return { usd: 0, percentage: 0 };
    }

    const oldestPrice = priceHistory[0].price;
    const currentPrice = priceHistory[priceHistory.length - 1].price;
    const change = currentPrice - oldestPrice;
    const percentage = (change / oldestPrice) * 100;

    return {
      usd: change,
      percentage: percentage
    };
  }, [priceHistory]);

  const dayRange = useMemo(() => {
    if (priceHistory.length === 0) {
      return { high: 0, low: 0 };
    }

    const prices = priceHistory.map(item => item.price);
    return {
      high: Math.max(...prices),
      low: Math.min(...prices)
    };
  }, [priceHistory]);

  const solToUsd = useCallback((solAmount: number): number => {
    if (currentPrice === null) return 1;
    return (solAmount / 100000000) * currentPrice;
  }, [currentPrice]);

  const usdToSol = useCallback((usdAmount: number): number  => {
    if (currentPrice === null || currentPrice === 0) return 1;
    return usdAmount / currentPrice;
  }, [currentPrice]);

  const formatUsd = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format((amount / 100000000));
  }, []);

  const formatSol = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format((amount / 100000000));
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const connection = new PriceServiceConnection(
      "https://hermes.pyth.network/",
      { priceFeedRequestConfig: { binary: true } }
    );

    const updatePrice = async () => {
      try {
        const priceFeeds = await connection.getLatestPriceFeeds([SOL_USD_PRICE_FEED]);
        
        if (!isSubscribed) return;

        if (priceFeeds && priceFeeds[0]) {
          // Correctly accessing the price using getCurrentPrice()
          const priceFeed = priceFeeds[0];
          const priceInfo = priceFeed.getPriceNoOlderThan(60); // Get price no older than 60 seconds

          if (priceInfo) {
            const price = parseFloat(priceInfo.price);
            setCurrentPrice(price);
            setLastUpdate(new Date());
            
            setPriceHistory(prev => {
              const newHistory = [...prev, { timestamp: Date.now(), price }];
              // Keep last 24 hours of data
              const cutoff = Date.now() - 24 * 60 * 60 * 1000;
              return newHistory.filter(item => item.timestamp > cutoff);
            });
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        if (!isSubscribed) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch price'));
        setIsLoading(false);
      }
    };

    // Initial update
    updatePrice();

    // Update price every 10 minutes
    const interval = setInterval(updatePrice, 600000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      connection.closeWebSocket();
    };
  }, []);

  return {
    currentPrice,
    priceChange,
    priceHistory,
    dayRange,
    solToUsd,
    usdToSol,
    formatUsd,
    formatSol,
    isLoading,
    error,
    lastUpdate
  };
};