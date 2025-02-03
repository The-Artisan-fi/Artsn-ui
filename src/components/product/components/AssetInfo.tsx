'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { VersionedTransaction } from '@solana/web3.js'
import { loadStripe } from '@stripe/stripe-js'
import { v4 as uuid } from 'uuid'
import { CreditCard } from 'lucide-react'
import { useHandleShare } from '@/hooks/use-handle-share'
import {
  // useWeb3,
  useWeb3Auth,
} from '@/hooks/use-web3-auth'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { usePaymentStore } from '@/lib/stores/usePaymentStore'
import { useToast } from '@/hooks/use-toast'
import { LoginSecondary } from '@/components/login/LoginSecondary'
import { useRateLimitedBalance } from '@/hooks/use-rate-limited-balance'
import RPC from '@/components/blockchain/solana-rpc'
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
  const { toast } = useToast()
  const { handleCopy, copied } = useHandleShare()
  const { provider, web3auth, rpc } = useWeb3Auth()
  // Auth store
  const { currentUser } = useAuthStore()
  const { isLoading: balanceLoading } = useRateLimitedBalance(
    currentUser?.publicKey
  )
  // Payment store - only use balance, not setBalance
  const { balance } = usePaymentStore()
  console.log('USER BALANCE', balance)
  // Web3 utilities
  // const { rpc, signTransaction } = useWeb3()

  // Local state
  const [amount, setAmount] = useState(1)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const increment = () => amount < 4 && setAmount(amount + 1)
  const decrement = () => amount > 1 && setAmount(amount - 1)

  // Memoized balance fetcher
  // const fetchBalance = useCallback(async () => {
  //   if (!currentUser?.publicKey || !rpc || !getBalance) return

  //   try {
  //     const newBalance = await getBalance()
  //     // Instead of using payment store, handle balance updates through the Web3 provider
  //     if (newBalance) {
  //       // Only update if balance has changed
  //       if (JSON.stringify(newBalance) !== JSON.stringify(balance)) {
  //         // Update balance through proper store action/dispatch
  //         usePaymentStore.getState().setBalance(newBalance)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching balance:', error)
  //   }
  // }, [currentUser?.publicKey, rpc, getBalance])

  // // Single effect for initial balance fetch
  // useEffect(() => {
  //   fetchBalance()
  //   // Set up polling interval for balance updates
  //   const intervalId = setInterval(fetchBalance, 30000) // Poll every 30 seconds

  //   return () => clearInterval(intervalId)
  // }, [fetchBalance])

  // Buy with crypto - Memoized to prevent recreations
  const buyTx = useCallback(async () => {
    try {
      toast({
        title: 'Preparing transaction...',
      })

      const response = await fetch('/api/protocol/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Number(asset.onChainData.id),
          reference: asset.offChainData.reference,
          publicKey: currentUser?.publicKey,
          amount: amount,
          uri: asset.onChainData.watchUri,
        }),
      })

      const { transaction } = await response.json()
      return VersionedTransaction.deserialize(
        Buffer.from(transaction, 'base64')
      )
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  }, [asset, currentUser?.publicKey, amount, toast])

  // const handleBuy = useCallback(async () => {
  //   if (isBuying) return // Prevent multiple calls

  //   setIsBuying(true)
  //   try {
  //     if (!rpc || !currentUser) {
  //       throw new Error('Web3 provider not initialized')
  //     }

  //     const tx = await buyTx()
  //     if (!tx) {
  //       throw new Error('No transaction to sign')
  //     }

  //     setIsProcessing(true)
  //     const signature = await signTransaction(tx)

  //     if (!signature) {
  //       throw new Error('Failed to sign transaction')
  //     }

  //     toast({
  //       title: 'Transaction sent',
  //       description: 'Transaction has been sent to the blockchain',
  //     })

  //     setIsComplete(true)
  //   } catch (error) {
  //     console.error('Buy transaction failed:', error)
  //     toast({
  //       title: 'Transaction Failed',
  //       description:
  //         error instanceof Error
  //           ? error.message
  //           : 'Failed to process transaction',
  //       variant: 'destructive',
  //     })
  //   } finally {
  //     setIsBuying(false)
  //     setIsProcessing(false)
  //   }
  // }, [isBuying, rpc, currentUser, buyTx, signTransaction, toast])

  const handleBuy = async () => {
    console.log('handleBuy ->', web3auth)
    if (!web3auth || !web3auth.provider) {
      console.log('Web3 provider not initialized')
      return
    }
    setIsBuying(true)
    const rpc = new RPC(web3auth.provider!)
    console.log('rpc ->', rpc)
    const getAccounts = async () => {
      const accounts = await rpc.getAccounts()
      console.log('accounts ->', accounts)
      return accounts
    }

    if (web3auth && web3auth.connected && web3auth.provider) {
      const rpc = new RPC(web3auth.provider)
      const accounts = await getAccounts()
      console.log('userAccounts ->', accounts)
      if (!accounts) {
        console.error('No accounts found')
        return
      }
      const tx = await buyTx()
      console.log('tx ->', tx) // VersionedTransaction
      if (tx) {
        setIsProcessing(true)
        const signature = await rpc!.signVersionedTransaction({ tx })
        console.log('signature ->', signature)
        toast({
          title: 'Transaction sent',
          description: 'Transaction has been sent to the blockchain',
        })
        setIsBuying(false)
        setIsProcessing(false)
        setIsComplete(true)
      } else {
        console.error('Transaction is undefined')
      }
    }
  }

  // Buy with Stripe
  const asyncStripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  )

  const buyStripe = async () => {
    try {
      const idempotencyKey = uuid()
      const encodedUri = encodeURIComponent(asset.onChainData.watchUri)

      const stripe = await asyncStripe
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          amount,
          id: asset.offChainData.associatedId,
          objectReference: asset.offChainData.reference,
          object: asset.offChainData.mintAddress,
          uri: encodedUri,
        }),
      })

      const { sessionId } = await res.json()
      sessionStorage.setItem('sessionId', sessionId)
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Stripe transaction failed:', error)
      toast({
        title: 'Payment Failed',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      })
    }
  }

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
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger className="w-full rounded-2xl bg-black py-3 text-white md:w-2/3">
            {`Buy ${amount} Fractions`}
          </AlertDialogTrigger>
          <AlertDialogContent>
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
                <AlertDialogDescription>
                  {/* Purchase Summary */}
                  This action will purchase you {amount} fractions of the asset.
                  Are you sure you want to continue?
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
                        <p className="text-lg font-semibold text-secondary">
                          {asset.attributes[0].value} -{' '}
                          {asset.attributes[1].value}
                        </p>
                        <p className="text-sm text-secondary">
                          x {amount} Fractions
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      ${Number(asset.onChainData.price)}
                    </p>
                  </div>
                  {/* Cost Breakdown */}
                  <Separator className="my-2 bg-slate-300" />
                  <div className="flex w-full flex-col items-center justify-between px-4">
                    <div className="flex w-full flex-row items-center justify-between gap-4 px-4">
                      <p className="text-md text-secondary">Subtotal</p>
                      <p className="text-md text-secondary">
                        ${amount * Number(asset.onChainData.price)}
                      </p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between gap-4 px-4">
                      <p className="text-md text-secondary">Processing Fee</p>
                      <p className="text-md text-secondary">
                        ${amount * Number(asset.onChainData.price) * 0.04}
                      </p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between gap-4 px-4">
                      <p className="text-md font-semibold text-secondary">
                        Purchase Total
                      </p>
                      <p className="text-md font-semibold text-secondary">
                        $
                        {amount * Number(asset.onChainData.price) * 0.04 +
                          amount * Number(asset.onChainData.price)}
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              ) : (
                <AlertDialogDescription>
                  You just bought x {amount} Fractions of{' '}
                  {asset.attributes[0].value} - {asset.attributes[1].value}.
                  Welcome to the Artisan family!
                </AlertDialogDescription>
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
                    onClick={handleBuy}
                    // disabled={
                    //   !currentUser ||
                    //   balance.usdc < amount * Number(asset.onChainData.price)
                    // }
                  >
                    Pay with crypto ( save $
                    {amount * Number(asset.onChainData.price) * 0.04} )
                  </Button>
                  <Button
                    disabled={!currentUser}
                    className="w-full rounded-xl bg-secondary text-primary hover:bg-primary hover:text-secondary"
                    onClick={buyStripe}
                  >
                    <CreditCard className="mr-2" />
                    Pay with card
                  </Button>

                  {/* Login Prompt */}
                  {!currentUser && (
                    <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-red-500/20 py-2">
                      {/* <LoginSecondary className="w-full" /> */}
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
      </div>
    </section>
  )
}
