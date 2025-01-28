//src/components/stripe/StripeSuccess.tsx
'use client'
import { useEffect, useCallback, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { VersionedTransaction } from '@solana/web3.js'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useWeb3Auth } from '@/hooks/use-web3-auth'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { Button } from '@/components/ui/button'

interface PaymentParams {
  sessionId: string | null
  assetId: string | null
  amount: string | null
  ref: string | null
  objectRef: string | null
  uri: string | null
}

interface ProcessingState {
  isProcessing: boolean
  hasProcessed: boolean
  error: string | null
}

export default function StripeSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  // Add processing state to prevent multiple executions
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    hasProcessed: false,
    error: null,
  })

  const {
    currentUser,
    authToken,
    loading: authLoading,
    setAuth,
  } = useAuthStore()

  const {
    web3auth,
    provider,
    signTransaction,
    loading: web3Loading,
  } = useWeb3Auth()

  const verifyPayment = useCallback(
    async (params: PaymentParams) => {
      const storedAuth = useAuthStore.getState()
      const token = storedAuth.authToken
      console.log('Token:', token)

      if (!token) {
        throw new Error('Authentication required')
      }

      try {
        const response = await fetch('/api/stripe/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId: params.sessionId,
            assetId: params.assetId,
            amount: params.amount,
            ref: params.ref,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken')
            router.push('/')
            throw new Error('Authentication expired. Please login again.')
          }
          throw new Error(
            data.error || `Verification failed: ${response.status}`
          )
        }

        return data.verified
      } catch (error) {
        console.error('Verification error:', error)
        throw error
      }
    },
    [router]
  )

  const processTransaction = useCallback(
    async (params: PaymentParams) => {
      if (!authToken || !currentUser?.publicKey) {
        throw new Error('Missing auth token or public key')
      }

      const response = await fetch('/api/protocol/buy-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id: params.assetId,
          reference: params.objectRef,
          publicKey: currentUser.publicKey,
          amount: +(params.amount || 0),
          sessionId: params.sessionId,
          uri: params.uri,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create transaction')
      }

      const { transaction } = await response.json()
      const tx = VersionedTransaction.deserialize(
        Buffer.from(transaction, 'base64')
      )
      const signature = await signTransaction(tx)

      if (!signature) {
        throw new Error('Failed to sign transaction')
      }

      return signature
    },
    [authToken, currentUser, signTransaction]
  )

  // Single useEffect for auth rehydration
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedAuth = useAuthStore.getState()
      const token = storedAuth.authToken
      console.log('Token:', token)

      if (!token) {
        router.push('/')
        return
      }

      if (!currentUser) {
        try {
          const response = await fetch('/api/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error('Failed to verify auth')
          }

          const data = await response.json()

          if (data.user) {
            setAuth({
              token,
              user: data.user,
            })
          } else {
            throw new Error('No user data returned')
          }
        } catch (error) {
          console.error('Auth rehydration failed:', error)
          localStorage.removeItem('authToken')
          router.push('/')
        }
      }
    }

    checkAuthStatus()
  }, [currentUser, router, setAuth])

  // Combined payment processing effect with state management
  useEffect(() => {
    const processStripeSuccess = async () => {
      // Prevent multiple processing attempts
      if (processingState.isProcessing || processingState.hasProcessed) {
        return
      }

      // Check requirements
      if (!web3auth || !provider || !currentUser || !authToken) {
        return
      }

      setProcessingState((prev) => ({ ...prev, isProcessing: true }))

      try {
        if (!searchParams) {
          throw new Error('Search parameters are missing')
        }

        const params: PaymentParams = {
          sessionId: searchParams.get('session_id'),
          assetId: searchParams.get('asset_id'),
          amount: searchParams.get('amount'),
          ref: searchParams.get('ref'),
          objectRef: searchParams.get('object_ref'),
          uri: searchParams.get('uri'),
        }

        // Validate required params
        const requiredParams = [
          'sessionId',
          'assetId',
          'amount',
          'ref',
          'objectRef',
        ]
        const missingParams = requiredParams.filter(
          (param) => !params[param as keyof PaymentParams]
        )

        if (missingParams.length > 0) {
          throw new Error(
            `Missing required parameters: ${missingParams.join(', ')}`
          )
        }

        // Verify payment
        const verified = await verifyPayment(params)
        if (!verified) {
          throw new Error('Payment verification failed')
        }

        // Process transaction
        const signature = await processTransaction(params)

        toast({
          title: 'Transaction Complete',
          description: 'Your purchase has been processed successfully',
        })

        // Clean up and redirect
        sessionStorage.removeItem('pendingPaymentParams')
        sessionStorage.removeItem('sessionId')

        setProcessingState({
          isProcessing: false,
          hasProcessed: true,
          error: null,
        })

        router.push('/dashboard')
      } catch (error) {
        console.error('Payment processing failed:', error)

        setProcessingState({
          isProcessing: false,
          hasProcessed: true,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to process transaction',
        })

        toast({
          title: 'Transaction Failed',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to process transaction',
          variant: 'destructive',
        })
      }
    }

    processStripeSuccess()
  }, [
    web3auth,
    provider,
    currentUser,
    authToken,
    searchParams,
    processingState.isProcessing,
    processingState.hasProcessed,
    router,
    toast,
    verifyPayment,
    processTransaction,
  ])

  if (authLoading || web3Loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="mb-4 text-xl font-semibold">
          {processingState.hasProcessed
            ? 'Purchase Complete!'
            : 'Processing your purchase...'}
        </h2>
      </div>
    )
  }

  if (!currentUser || !web3auth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold">
            Authentication Required
          </h2>
          <p>Please log in to complete your purchase.</p>
          <Button
            onClick={() => router.push('/login')}
            className="mt-4"
            variant="default"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (processingState.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-red-600">
            Transaction Failed
          </h2>
          <p>{processingState.error}</p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="mt-4"
            variant="default"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-xl font-semibold">
          {processingState.hasProcessed
            ? 'Purchase Complete!'
            : 'Processing your purchase...'}
        </h2>
        {/* {!processingState.hasProcessed && <LoadingSpinner />} */}
      </div>
    </div>
  )
}
