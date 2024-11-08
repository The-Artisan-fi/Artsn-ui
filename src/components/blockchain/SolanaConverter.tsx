import React, { useState, useEffect } from 'react';
import { useSolanaPrice } from '@/hooks/use-solana-price';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

const SolanaConverter = () => {
  const {
    currentPrice,
    priceChange,
    dayRange,
    solToUsd,
    usdToSol,
    formatUsd,
    formatSol,
    isLoading,
    error,
    lastUpdate
  } = useSolanaPrice();

  const [solAmount, setSolAmount] = useState('1');
  const [usdAmount, setUsdAmount] = useState('');

  // Update USD amount when SOL amount or price changes
  useEffect(() => {
    if (solAmount && !isNaN(Number(solAmount))) {
      const usdValue = solToUsd(Number(solAmount));
      setUsdAmount(usdValue ? usdValue.toString() : '');
    }
  }, [solAmount, currentPrice]);

  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSolAmount(value);
    if (value && !isNaN(Number(value))) {
      const usdValue = solToUsd(Number(value));
      setUsdAmount(usdValue ? usdValue.toString() : '');
    } else {
      setUsdAmount('');
    }
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsdAmount(value);
    if (value && !isNaN(Number(value))) {
      const solValue = usdToSol(Number(value));
      setSolAmount(solValue ? solValue.toString() : '');
    } else {
      setSolAmount('');
    }
  };

  return (
    <Card className="w-full max-w-md mt-20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Solana Price Converter</span>
          {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : (
          <>
            {/* Current Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {currentPrice ? formatUsd(currentPrice) : '-'}
              </div>
              <div className={`flex items-center text-sm ${
                priceChange.usd > 0 ? 'text-green-500' : 
                priceChange.usd < 0 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {priceChange.usd !== 0 && (
                  <>
                    {priceChange.usd > 0 ? 
                      <ArrowUp className="w-4 h-4 mr-1" /> : 
                      <ArrowDown className="w-4 h-4 mr-1" />
                    }
                    {formatUsd(Math.abs(priceChange.usd))} ({priceChange.percentage.toFixed(2)}%)
                  </>
                )}
              </div>
            </div>

            {/* Converter */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">SOL Amount</label>
                <Input
                  type="number"
                  value={solAmount}
                  onChange={handleSolChange}
                  placeholder="Enter SOL amount"
                  min="0"
                  step="0.000001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">USD Amount</label>
                <Input
                  type="number"
                  value={usdAmount}
                  onChange={handleUsdChange}
                  placeholder="Enter USD amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* 24h Range */}
            <div className="space-y-2">
              <div className="text-sm font-medium">24h Range</div>
              <div className="flex justify-between text-sm">
                <span>Low: {formatUsd(dayRange.low)}</span>
                <span>High: {formatUsd(dayRange.high)}</span>
              </div>
            </div>

            {/* Last Update */}
            {lastUpdate && (
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SolanaConverter;