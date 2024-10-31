"use client"
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/apollo/auth-context-provider';
import { Transaction } from "@solana/web3.js";
import { useSolanaRPC } from "@/hooks/use-web3-rpc";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import RPC from "@/components/solana/web3auth/solana-rpc";

export default function StripeSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, checkAuth } = useAuth();
  const { provider } = useWeb3Auth();
  const { signTransaction } = useSolanaRPC(provider);
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  const buyStripeTx = useCallback(async (id: string, reference: string, key: string, amount: number, uri: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('sending transaction ->', id, reference, key, amount);
    try {
      const response = await fetch('/api/protocol/buy-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id,
          reference,
          publicKey: key,
          amount,
          sessionId: sessionStorage.getItem('sessionId'),
          uri: encodeURIComponent(uri)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      const txData = await response.json();
      const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
  
      if (!tx) {
        throw new Error('No transaction returned');
      }
  
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }, []);

  const buyStripeListing = useCallback(async (id: string, reference: string, amount: string, uri: string) => {
    if (isProcessing || hasProcessed) return;
    
    setIsProcessing(true);
    try {
      if (!user) {
        await checkAuth();
        if (!user) {
          throw new Error('User not found');
        }
      }

      console.log('Creating transaction...');
      const tx = await buyStripeTx(id, reference, user.publicKey, +amount, uri);
      
      console.log('Signing transaction...', tx);
      const rpc = new RPC(provider!);
      const signature = await rpc.signTransaction(tx);
      console.log('Transaction signature:', signature);
      
      toast({
        title: 'Transaction sent',
        description: 'Transaction has been sent to the blockchain',
      });
      
      setHasProcessed(true);
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error in buyStripeListing:', error);
      toast({
        title: 'Transaction Failed',
        description: error instanceof Error ? error.message : 'Failed to process transaction',
        variant: 'destructive'
      });
    } finally {
      sessionStorage.removeItem('sessionId');
      setIsProcessing(false);
    }
  }, [user, checkAuth, buyStripeTx, signTransaction, toast, router]);

  const verifyPayment = useCallback(async () => {
    if (hasProcessed || isProcessing || verificationAttempted || !user) return;

    setVerificationAttempted(true);
    
    try {
      const sessionId = searchParams.get('session_id');
      const assetId = searchParams.get('asset_id');
      const amount = searchParams.get('amount');
      const ref = searchParams.get('ref');
      const objRef = searchParams.get('object_ref');
      const uri = searchParams.get('uri');
      // change uri from encodedUri to a string
      const decodedUri = decodeURIComponent(uri!);
      if (!sessionId || !assetId || !amount || !ref || !objRef) {
        throw new Error('Missing required parameters');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Verifying payment...');
      const response = await fetch('/api/stripe/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          sessionId,
          assetId,
          amount,
          ref
        })
      });

      const data = await response.json();
      console.log('Payment verification response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      if (data.verified) {
        toast({
          title: 'Payment Successful',
          description: 'Processing your purchase...',
        });

        console.log('Initiating blockchain transaction...');
        await buyStripeListing(assetId, objRef, amount, decodedUri);
      }

    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Please contact support',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  }, [searchParams, user, hasProcessed, isProcessing, verificationAttempted, buyStripeListing, toast]);

  useEffect(() => {
    if (user && !verificationAttempted) {
      verifyPayment();
    }
  }, [user, verificationAttempted, verifyPayment]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            {isProcessing ? 'Processing transaction...' : 'Verifying your payment...'}
          </h2>
          {/* Add your loading spinner here */}
        </div>
      </div>
    );
  }

  return null;
}