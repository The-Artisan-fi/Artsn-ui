import { useState, useCallback, useMemo } from 'react';
import { IProvider } from "@web3auth/base";
import SolanaRpc from '@/components/solana/web3auth/solana-rpc';
import { VersionedTransaction } from '@solana/web3.js';

export const useSolanaRPC = (provider: IProvider | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rpc = useMemo(() => provider ? new SolanaRpc(provider) : null, [provider]);

  const executeRpcCall = async <T>(
    method: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> => {
    if (!rpc) {
      setError("Provider not initialized");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await method();
      return result;
    } catch (err) {
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAccounts = useCallback(() => 
    executeRpcCall(() => rpc!.getAccounts(), "Failed to get accounts"),
  [rpc]);

  const getBalance = useCallback(() => 
    executeRpcCall(() => rpc!.getBalance(), "Failed to get balance"),
  [rpc]);

  const signMessage = useCallback((message: string) => 
    executeRpcCall(() => rpc!.signMessage(message), "Failed to sign message"),
  [rpc]);

  const sendTransaction = useCallback((amount: number) => 
    executeRpcCall(() => rpc!.sendTransaction(amount), "Failed to send transaction"),
  [rpc]);

  const signTransaction = useCallback((tx: any) => 
    executeRpcCall(() => rpc!.signTransaction(tx), "Failed to sign transaction"),
  [rpc]);

  const sendVersionedTransaction = useCallback(() => 
    executeRpcCall(() => rpc!.sendVersionedTransaction(), "Failed to send versioned transaction"),
  [rpc]);

  const signVersionedTransaction = useCallback((tx: VersionedTransaction) => 
    executeRpcCall(() => rpc!.signVersionedTransaction({ tx }), "Failed to sign versioned transaction"),
  [rpc]);

  const signAllTransactions = useCallback((count: number) => 
    executeRpcCall(() => rpc!.signAllTransactions(count), "Failed to sign all transactions"),
  [rpc]);

  const signAllVersionedTransactions = useCallback((count: number) => 
    executeRpcCall(() => rpc!.signAllVersionedTransactions(count), "Failed to sign all versioned transactions"),
  [rpc]);

  const getPrivateKey = useCallback(() => 
    executeRpcCall(() => rpc!.getPrivateKey(), "Failed to get private key"),
  [rpc]);

  return {
    isLoading,
    error,
    getAccounts,
    getBalance,
    signMessage,
    sendTransaction,
    signTransaction,
    sendVersionedTransaction,
    signVersionedTransaction,
    signAllTransactions,
    signAllVersionedTransactions,
    getPrivateKey,
  };
};