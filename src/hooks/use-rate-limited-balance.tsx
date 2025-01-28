import { useState, useEffect, useRef, useCallback } from 'react'
import { useWeb3Auth } from '@/hooks/use-web3-auth'
import { usePaymentStore } from '@/lib/stores/usePaymentStore'
import debounce from 'lodash/debounce'

export const useRateLimitedBalance = (publicKey: string | undefined | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const lastFetchTime = useRef<number>(0)
  const {
    rpc,
    // getBalance
  } = useWeb3Auth()
  const { setBalance } = usePaymentStore()

  // Minimum time between fetches (5 seconds)
  const MIN_FETCH_INTERVAL = 15000

  const fetchBalance = useCallback(
    async (force = false) => {
      // if (!publicKey || !rpc || !getBalance) return;

      const now = Date.now()
      if (!force && now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
        return
      }

      try {
        setIsLoading(true)
        //   const newBalance = await getBalance();
        //   if (newBalance) {
        //     setBalance(newBalance);
        //     lastFetchTime.current = now;
        //   }
      } catch (err) {
        console.error('Error fetching balance:', err)
        setError(
          err instanceof Error ? err : new Error('Failed to fetch balance')
        )
      } finally {
        setIsLoading(false)
      }
    },
    [publicKey, rpc, setBalance]
  )

  // Debounced version of fetchBalance
  const debouncedFetchBalance = useCallback(
    debounce((force = false) => fetchBalance(force), 1000),
    [fetchBalance]
  )

  useEffect(() => {
    // Initial fetch
    fetchBalance(true)

    // Set up polling with rate limiting
    const intervalId = setInterval(() => {
      debouncedFetchBalance(false)
    }, 30000) // Poll every 30 seconds

    return () => {
      clearInterval(intervalId)
      debouncedFetchBalance.cancel()
    }
  }, [debouncedFetchBalance])

  return {
    isLoading,
    error,
    refetch: () => fetchBalance(true),
  }
}

export default useRateLimitedBalance
