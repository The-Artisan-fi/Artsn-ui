'use client'
import debounce from 'lodash/debounce'
import { useState, Suspense, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useWeb3Auth } from '@/hooks/use-web3-auth'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { IconCurrencyDollar, IconCurrencySolana } from '@tabler/icons-react'
import { ChevronDown, Copy } from 'lucide-react'
import { LogOut, Settings2, ListOrdered } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import RPC from '@/components/blockchain/solana-rpc'
import { useSolanaPrice } from '@/hooks/use-solana-price'

type LoginDialogProps = {
  className?: string
  onClose?: () => void
}

type BalanceObject = {
  sol: number
  usdc: number
}

export function LoginDialog({ className }: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userBalance, setUserBalance] = useState<BalanceObject | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { solToUsd } = useSolanaPrice()

  // Auth store state
  const { currentUser, loading: authLoading, clearAuth } = useAuthStore()

  // Web3Auth hook
  const {
    login,
    loginWithAdapter,
    injectedAdapters,
    provider,
    logout,
    loading: web3Loading,
  } = useWeb3Auth()

  const loading = authLoading || web3Loading

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      clearAuth()
      setUserBalance(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [logout, clearAuth, router])

  const fetchBalance = useCallback(async () => {
    if (!provider || !currentUser?.publicKey) return

    try {
      const rpc = new RPC(provider)
      const balance = await rpc.getBalance()
      setUserBalance(balance)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }, [provider, currentUser])

  const lastFetchTime = useRef<number>(0)
  const MIN_FETCH_INTERVAL = 10000 // Minimum 10 seconds between fetches
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFetchBalance = useCallback(
    debounce(async () => {
      if (!provider || !currentUser?.publicKey) return

      const now = Date.now()
      if (now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
        return
      }

      try {
        const rpc = new RPC(provider)
        const balance = await rpc.getBalance()
        setUserBalance(balance)
        lastFetchTime.current = now
      } catch (error) {
        if ((error as any)?.status === 429) {
          // If we hit rate limit, wait longer before next attempt
          console.warn('Rate limit hit, increasing delay')
          lastFetchTime.current = now + MIN_FETCH_INTERVAL
        }
        console.error('Error fetching balance:', error)
      }
    }, 1000), // 1 second debounce
    [provider, currentUser?.publicKey]
  )

  // Fetch balance on mount or when provider/user changes
  useEffect(() => {
    if (currentUser && provider) {
      // Initial fetch
      debouncedFetchBalance()

      // Set up polling with rate limiting
      fetchTimeoutRef.current = setInterval(() => {
        debouncedFetchBalance()
      }, MIN_FETCH_INTERVAL)
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearInterval(fetchTimeoutRef.current)
        fetchTimeoutRef.current = null
      }
      debouncedFetchBalance.cancel()
    }
  }, [currentUser, provider, debouncedFetchBalance])

  // If user exists, show user dropdown
  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={currentUser.baseProfile?.photoUrl || ''}
                alt={currentUser.baseProfile?.displayName || 'User'}
              />
              <AvatarFallback>
                {currentUser.baseProfile?.displayName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[300px] rounded-3xl border border-zinc-300 bg-white p-4 dark:bg-white"
        >
          {/* Profile Section */}
          <div className="mb-4 flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={currentUser.baseProfile?.photoUrl}
                alt={currentUser.baseProfile?.displayName || 'User'}
              />
              <AvatarFallback>
                {currentUser.baseProfile?.displayName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {currentUser.baseProfile?.displayName ||
                  `User_${currentUser.publicKey.slice(-4)}`}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span className="truncate">
                  {currentUser.publicKey.slice(0, 4)}...
                  {currentUser.publicKey.slice(-4)}
                </span>
                <Copy
                  className="ml-2 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(currentUser.publicKey)
                    toast({ title: 'Copied to clipboard' })
                  }}
                />
              </div>
            </div>
          </div>

          {/* Balance Section */}
          <div className="mb-4 rounded-xl bg-slate-50 p-3">
            <div className="mb-2 flex justify-between">
              <span className="text-sm">Buying power</span>
              <span className="font-medium">
                $
                {userBalance
                  ? (
                      solToUsd(userBalance.sol) + (userBalance.usdc || 0)
                    ).toFixed(2)
                  : '0.00'}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <IconCurrencySolana className="h-4 w-4" />
                  <span>{userBalance?.sol?.toFixed(4) || '0.0000'} SOL</span>
                </div>
                <span className="text-gray-500">
                  ${solToUsd(userBalance?.sol || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <IconCurrencyDollar className="h-4 w-4" />
                  <span>{userBalance?.usdc || '0'} USDC</span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="https://faucet.circle.com/" target="_blank">
                <Button variant="outline" size="sm" className="w-full">
                  Get USDC
                </Button>
              </Link>
              <Link href="https://faucet.solana.com/" target="_blank">
                <Button variant="outline" size="sm" className="w-full">
                  Get SOL
                </Button>
              </Link>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <DropdownMenuItem
              onClick={() => router.push('/dashboard/settings')}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
              <ListOrdered className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Login dialog for non-authenticated users
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className={className}>
        <Button
          variant="secondary"
          className="z-[1] rounded-xl"
          onClick={handleOpen}
        >
          Login
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-[201] flex h-screen items-center justify-center bg-black bg-opacity-50">
            <div
              className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
              onClick={handleClose}
            />
            <div className="relative z-20 w-full max-w-4xl rounded-lg bg-transparent p-6">
              <Button
                onClick={handleClose}
                className="absolute -top-10 right-2 z-10"
              >
                Close
              </Button>

              <div className="flex flex-col gap-6 md:flex-row">
                <Card className="z-[301] flex w-full flex-col border-none bg-transparent text-secondary md:w-1/2">
                  <CardHeader className="rounded-t-xl bg-bg">
                    <CardTitle className="font-bold">
                      Welcome to the Artisan
                    </CardTitle>
                    <CardDescription>
                      Connect your buyer profile to access the marketplace and
                      begin collecting
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-2 bg-bg">
                    <Button
                      className="w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary"
                      onClick={login}
                      disabled={loading}
                    >
                      {loading ? 'Connecting...' : 'Sign in with Google'}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="default"
                          className="w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary"
                          disabled={loading}
                        >
                          <span>Connect Wallet</span>
                          <div className="ml-2 flex">
                            {['phantom', 'solflare', 'backpack', 'ledger'].map(
                              (icon) => (
                                <img
                                  key={icon}
                                  src={`/login/${icon}_icon.svg`}
                                  alt={icon}
                                  className="h-5 w-5"
                                />
                              )
                            )}
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36">
                        <DropdownMenuGroup>
                          {injectedAdapters.map((adapter) => (
                            <DropdownMenuItem
                              key={adapter.name}
                              onClick={() => {
                                loginWithAdapter(adapter.name),
                                  console.log('adapter', adapter.name)
                              }}
                              className="flex items-center gap-2"
                            >
                              <img
                                src={`/login/${adapter.name.toLowerCase()}_icon.svg`}
                                alt={adapter.name}
                                className="h-5 w-5"
                              />
                              <span>
                                {adapter.name.charAt(0).toUpperCase() +
                                  adapter.name.slice(1)}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center">
                      <div className="h-px flex-grow bg-gray-300" />
                      <span className="px-4 text-gray-500">OR</span>
                      <div className="h-px flex-grow bg-gray-300" />
                    </div>

                    <Button
                      onClick={() => router.push('/register')}
                      variant="secondary"
                      className="w-full rounded-full hover:animate-pulse hover:border-2 hover:border-solid hover:border-secondary hover:bg-primary hover:text-secondary"
                    >
                      Create account
                    </Button>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 rounded-b-xl bg-bg">
                    <p className="text-sm text-gray-500">
                      By continuing to use the Artisan you accept our terms and
                      conditions
                    </p>
                  </CardFooter>
                </Card>

                <Card className='hidden md:flex bg-bg flex flex-col relative w-1/2 text-secondary overflow-hidden'>
                    <div className='h-full w-full rounded-xl bg-[url(/products/rolex-bg.svg)] bg-contain bg-right-middle bg-no-repeat transform translate-x-[6rem] scale-[140]translate-y-10 ' />
                    <CardHeader className='absolute bottom-0 left-0 w-1/2'>
                        <CardTitle className='text-xl font-bold'>Buy a fraction of your favorite asset</CardTitle>
                        <CardDescription className='text-md'>Democratizing Luxury one fraction at a time</CardDescription>
                    </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  )
}
