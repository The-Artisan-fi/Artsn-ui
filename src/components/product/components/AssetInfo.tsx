'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { VersionedTransaction, Transaction } from '@solana/web3.js'
//import { loadStripe } from '@stripe/stripe-js'
import { v4 as uuid } from 'uuid'
import { CreditCard } from 'lucide-react'
import bs58 from 'bs58'
import { useHandleShare } from '@/hooks/use-handle-share'
import { useAuthStore } from '@/lib/stores/useAuthStore'
//import { usePaymentStore } from '@/lib/stores/usePaymentStore'
import { useToast } from '@/hooks/use-toast'
//import { useRateLimitedBalance } from '@/hooks/use-rate-limited-balance'
import { rpcManager } from '@/lib/rpc/rpc-manager'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePara } from '@/providers/Para'



interface AssetInfo {
  onChainData: {
    id: string
    name: string
    share: number
    shareSold: number
    price: number
    watchUri: string
    objectType: {
      watch: boolean
    }
  }
  offChainData: {
    associatedId: string
    reference: string
    mintAddress: string
    images: string[]
    about: string
  }
  attributes: Array<{
    value: string
  }>
}

export default function AssetInfo({ asset }: { asset: AssetInfo }) {
  const router = useRouter()
  const { isConnected, wallet, signTransaction } = usePara();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast()
  const { handleCopy, copied } = useHandleShare()
  const { currentUser ,isAuthenticated} = useAuthStore()
  const { openModal } = usePara();
  // Local state
  const [amount, setAmount] = useState(1)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const connection = rpcManager.getConnection()
  const increment = () => amount < 4 && setAmount(amount + 1)
  const decrement = () => amount > 1 && setAmount(amount - 1)

  // Check and fix Para session if needed
  const verifyParaSession = async () => {
    if (!isConnected || !wallet) {
      console.log('Attempting to restore Para session...');
      
      // Try opening Para modal to restore session
      if (openModal) {
        toast({
          title: 'Wallet Connection',
          description: 'Please connect your wallet to continue'
        });
        
        openModal();
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if connection is restored
        const isParaConnected = isConnected && wallet;
        console.log('Para connection status after restore attempt:', isParaConnected);
        
        // setHasTriedParaFix(true);
        return isParaConnected;
      }
    }
    
    return isConnected && wallet;
  };

  // Function to perform transaction with the selected wallet
  const signWithWallet = async (transaction: VersionedTransaction, extraRetries = 3): Promise<Buffer> => {
    // console.log(`Attempting to sign transaction with ${signingMethod === 'wallet-adapter' ? 'Phantom' : 'Para'} wallet (retries left: ${extraRetries})`);
    
    try {
      // Phantom is preferred if available
      if (publicKey && sendTransaction) {
        // setSigningMethod("wallet-adapter");
        console.log(`Using Phantom wallet ${publicKey.toString()} for signing`);
        try {
          // Use the transaction object directly with Phantom's sendTransaction
          const signature = await sendTransaction(transaction, connection, { skipPreflight: false });
          console.log('Phantom signing successful:', signature);
          return Buffer.from(transaction.serialize());
        } catch (phantomError) {
          console.error('Phantom signing failed:', phantomError);
          // Fall back to Para if Phantom fails
          console.log('Falling back to Para wallet after Phantom failure');
        }
      }
      
      // Para wallet signing (either as primary or fallback)
      if (wallet && signTransaction) {
        // setSigningMethod('para');
        console.log(`Using Para wallet ${wallet} for signing`);
        
        // Verify Para session before attempting to sign
        // if (!hasTriedParaFix && extraRetries > 0) {
        //   const paraSessionValid = await verifyParaSession();
        //   console.log('Para session verification before signing:', paraSessionValid);
        //   // setHasTriedParaFix(true);
        // }
        
        try {
          const signedTx = await signTransaction(transaction);
          console.log('Para signing successful', signedTx);
          return Buffer.from(transaction.serialize());
        } catch (paraError) {
          console.error('Para direct signing failed:', paraError);
          
          // Check if we should retry
          if (extraRetries > 0) {
            console.log(`Retrying Para signing (${extraRetries} attempts left)...`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay before retry
            return signWithWallet(transaction, extraRetries - 1);
          } else {
            throw new Error(`Para wallet signing failed after retries: ${paraError instanceof Error ? paraError.message : 'Unknown error'}`);
          }
        }
      }
      
      // If we reach here, no wallet was able to sign
      const errorMsg = 'No wallet available for signing';
      console.error(errorMsg);
      throw new Error(errorMsg);
    } catch (error) {
      console.error('Signing error:', error);
      throw error;
    }
  };

  // Buy with crypto - Memoized to prevent recreations
  const buyTx = useCallback(async () => {
    try {
      // Check if Para is still connected
      if (!isConnected) {
        toast({
          title: 'Connection Error',
          description: 'Please ensure your wallet is connected',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Preparing transaction...',
      })

      // Verify wallet address is available
      if (!wallet && !publicKey) {
        throw new Error('Wallet address not found')
      }
      console.log('wallet ->', wallet)
      setIsBuying(true)
      console.log(' 🚨asset info ', asset.offChainData.reference)
      const response = await fetch('/api/protocol/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Number(asset.onChainData.id),
          reference: '15202ST.OO.1240ST.06', // asset.offChainData.reference 
          publicKey: publicKey ? publicKey.toString() : wallet,
          amount: amount,
          uri: asset.onChainData.watchUri,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create transaction')
      }

      const { transaction } = await response.json()
      console.log('transaction ->', transaction)
      
      // Convert the base64 transaction to a Buffer and deserialize as VersionedTransaction
      const serializedTx = Buffer.from(transaction, 'base64')
      const _txn = VersionedTransaction.deserialize(serializedTx)
      console.log('deserialized transaction ->', _txn)
      setIsProcessing(true)
      if (!publicKey) {

          try {
            const sign = await signTransaction(_txn)
            console.log('🚨 signed res ->', sign)
            if (sign !== undefined) {
              console.log('sign successful ->', sign)
              const tx = await rpcManager.getConnection().sendTransaction(sign as VersionedTransaction)
              console.log('tx ->', tx)
            } else {
              console.log('sign is undefined ->', sign)
              const sim = await rpcManager.getConnection().simulateTransaction(_txn)
              console.log('sim ->', sim)
              setIsBuying(false)
              setIsProcessing(false)
              throw new Error('Transaction failed, please try again')
            }
          } catch (signError) {
            console.error(`error signing txn`, signError)
            throw signError
          }
        

        toast({
          title: 'Transaction sent',
          description: 'Transaction has been sent to the blockchain',
        })

        setIsBuying(false)
        setIsProcessing(false)
        setIsComplete(true)

        return 
      } else {
        console.log('publicKey ->', publicKey!.toString())
        const sign = await sendTransaction?.(_txn, connection)
        console.log('sign successful ->', sign)

        toast({
          title: 'Transaction sent',
          description: 'Transaction has been sent to the blockchain',
        })
  
        setIsBuying(false)
        setIsProcessing(false)
        setIsComplete(true)
        return sign
      }
    } catch (error) {
      console.error('Error in buyTx:', error)
      toast({
        title: 'Transaction Failed',
        description: error instanceof Error ? error.message : 'Failed to process transaction',
        variant: 'destructive',
      })
      throw error
    }
  }, [asset, wallet, amount, isConnected, signTransaction, toast])


  return (
    <section className="border-gray mb-5 rounded-3xl bg-white p-5">
      {/* Asset Type Buttons */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-3">
          <button className="border-gray rounded-2xl p-2.5 text-xs text-black shadow-sm md:text-base">
            <span>
              {asset.onChainData.objectType.watch ? 'Watch' : 'Diamonds'}
            </span>
          </button>
          {asset.onChainData.objectType.watch && (
            <button className="border-gray rounded-2xl p-2.5 text-xs text-black shadow-sm md:text-base">
              <span>{asset.attributes?.[4]?.value.toString() ?? ''}</span>
            </button>
          )}
        </div>
        <button
          className="rounded-2xl bg-black px-4 py-2.5 text-xs text-white shadow-sm md:text-base"
          onClick={() => handleCopy(window.location.href)}
        >
          <span className="flex items-center gap-2">
            {!copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            ) : (
              <span>√</span>
            )}
            Share
          </span>
        </button>
      </div>

      {/* Asset Info */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{asset.onChainData.name}</h1>
      </div>
      <p className="mb-5 text-gray-600">{asset.attributes[1].value}</p>

      {/* Share Information */}
      <p className="mb-3 text-lg">Remaining fractions</p>
      <p className="mb-2 text-3xl font-bold">
        {Number(asset.onChainData.share) - Number(asset.onChainData.shareSold)}{' '}
        / {asset.onChainData.share}
      </p>
      <p className="mb-2 text-sm">
        {Number(asset.onChainData.price)}$ / fractions
      </p>
      <Progress
        value={
          Number(asset.onChainData.share) - Number(asset.onChainData.shareSold)
        }
        max={Number(asset.onChainData.share)}
        className="my-4 bg-secondary text-primary"
      />

      {/* Purchase Controls */}
      <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex w-full max-w-48 items-center justify-between gap-4">
          <button
            onClick={decrement}
            className="flex h-[50px] w-[78px] items-center justify-center rounded-2xl bg-gray-300"
          >
            -
          </button>
          <button className="border-gray box-border flex h-[50px] w-[78px] items-center justify-center rounded-2xl bg-white font-bold">
            {amount}
          </button>
          <button
            onClick={increment}
            className="flex h-[50px] w-[78px] items-center justify-center rounded-2xl bg-gray-700 text-white"
          >
            +
          </button>
        </div>

        {/* Purchase Dialog */}
        {isAuthenticated ? (
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger className="w-full rounded-2xl bg-black py-3 text-white md:w-2/3">
              {`Buy ${amount} Fractions`}
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[95%] rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <div className="flex w-full flex-row items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-secondary">
                      {!isComplete ? 'Confirm Purchase' : 'Thanks for buying'}
                    </p>
                    <AlertDialogCancel className="w-fit rounded-xl bg-primary text-secondary hover:bg-secondary hover:text-primary">
                      X
                    </AlertDialogCancel>
                  </div>
                </AlertDialogTitle>

              {!isComplete ? (
                <div className="space-y-4">
                  {/* Purchase Summary */}
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    This action will purchase you {amount} fractions of the asset.
                    Are you sure you want to continue?
                  </div>
                  <Separator className="my-2 bg-slate-300" />
                  {/* Asset Preview */}
                  <div className="flex flex-row items-center justify-between gap-4 px-4">
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        src={asset.offChainData.images[0]}
                        alt={asset.attributes[0].value}
                        width={100}
                        height={100}
                        className="border-gray mt-5 rounded-3xl border border-solid"
                      />
                      <div className="flex flex-col gap-2">
                        <div className="text-lg font-semibold text-secondary">
                          {asset.attributes[0].value} -{' '}
                          {asset.attributes[1].value}
                        </div>
                        <div className="text-sm text-secondary">
                          x {amount} Fractions
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      ${Number(asset.onChainData.price)}
                    </div>
                  </div>
                  {/* Cost Breakdown */}
                  <Separator className="my-2 bg-slate-300" />
                  <div className="flex w-full flex-col items-center justify-between px-4">
                    <div className="flex w-full flex-row items-center justify-between gap-4 px-4">
                      <div className="text-md text-secondary">Subtotal</div>
                      <div className="text-md text-secondary">
                        ${amount * Number(asset.onChainData.price)}
                      </div>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between gap-4 px-4">
                      <div className="text-md text-secondary">Processing Fee</div>
                      <div className="text-md text-secondary">
                        ${amount * Number(asset.onChainData.price) * 0.04}
                      </div>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between gap-4 px-4">
                      <div className="text-md font-semibold text-secondary">
                        Purchase Total
                      </div>
                      <div className="text-md font-semibold text-secondary">
                        $
                        {amount * Number(asset.onChainData.price) * 0.04 +
                          amount * Number(asset.onChainData.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  You just bought x {amount} Fractions of{' '}
                  {asset.attributes[0].value} - {asset.attributes[1].value}.
                  Welcome to the Artisan family!
                </div>
              )}
            </AlertDialogHeader>

            <AlertDialogFooter>
              {/* Transaction Status */}
              {isBuying && !isProcessing && (
                <div className="flex w-full flex-col items-center justify-between gap-2 px-4">
                  <p>Preparing your txn...</p>
                </div>
              )}
              {isBuying && isProcessing && (
                <div className="flex w-full flex-col items-center justify-between gap-2 px-4">
                  <p>Processing, one more sec...</p>
                </div>
              )}

              {/* Purchase Actions */}
              {!isBuying && !isComplete && (
                <div className="flex w-full flex-col items-center justify-between gap-2 px-4">
                  <Separator className="bg-slate-300" />
                  <Button
                    className="w-full rounded-xl bg-secondary text-primary hover:bg-primary hover:text-secondary"
                    onClick={buyTx}
                    // disabled={
                    //   !currentUser ||
                    //   balance.usdc < amount * Number(asset.onChainData.price)
                    // }
                  >
                    Buy
                  </Button>
                  {/*<Button
                    disabled={!currentUser}
                    className="w-full rounded-xl bg-secondary text-primary hover:bg-primary hover:text-secondary"
                    onClick={buyStripe}
                  >
                    <CreditCard className="mr-2" />
                    Pay with card
                  </Button>*/}

                  {/* Login Prompt */}
                  {!currentUser && (
                    <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-red-500/20 py-2">
                      Please login to continue
                    </div>
                  )}
                </div>
              )}

                {/* Post-Purchase Actions */}
                {isComplete && (
                  <div className="flex w-full flex-col items-center justify-between gap-2 px-4">
                    <div className="flex w-full flex-row items-center gap-4">
                      <AlertDialogCancel
                        className="w-1/3 rounded-xl bg-primary text-secondary hover:bg-primary hover:text-secondary"
                        onClick={() => setIsComplete(false)}
                      >
                        Buy more
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="w-2/3 rounded-xl bg-secondary text-primary hover:bg-primary hover:text-secondary"
                        onClick={() => router.push('/dashboard')}
                      >
                        Take me to my dashboard
                      </AlertDialogAction>
                    </div>
                  </div>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <button 
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 text-white md:w-2/3 hover:bg-gray-800"
          onClick={() => openModal()}
        >
          Login to continue
        </button>
        )}
      </div>
    </section>
  )
}
