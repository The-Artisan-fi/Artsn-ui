'use client'
import Image from 'next/image'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Web3AuthProvider'
import { Mail } from 'lucide-react'
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
import { useRouter } from 'next/navigation'

type LoginDialogProps = {
  className?: string
  onClose?: () => void
}
export function LoginSecondary({ className }: LoginDialogProps) {
  const router = useRouter()
  const {
    login,
    isAuthenticated,
    loading,
    user,
  } = useAuth()

  if (user) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Connected as {user.email}
      </Button>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={className}>
        {/* <div className="w-full">
          <div className="flex flex-col gap-6">
            <Card className="z-[301] flex w-full flex-col border-none bg-transparent text-secondary">
              <CardHeader className="rounded-t-xl bg-transparent">
                <CardTitle className="self-center font-bold">
                  Please login to continue
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-2 bg-transparent">
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
                      variant={'default'}
                      className="w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary"
                      disabled={loading}
                    >
                      Connect Wallet
                      {['phantom', 'solflare', 'backpack', 'ledger'].map(
                        (icon) => (
                          <img
                            key={icon}
                            src={`/login/${icon}_icon.svg`}
                            alt={icon}
                            className="ml-2"
                            style={{ width: '20px', height: '20px' }}
                          />
                        )
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36">
                    <DropdownMenuGroup>
                      {injectedAdapters.map((adapter) => (
                        <DropdownMenuItem
                          key={adapter.name}
                          onClick={() => loginUserWithAdapter(adapter.name)}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={`/login/${adapter.name.toLowerCase()}_icon.svg`}
                            alt={adapter.name}
                            className="ml-2"
                            style={{ width: '20px', height: '20px' }}
                          />
                          {adapter.name.charAt(0).toUpperCase() +
                            adapter.name.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center">
                  <div className="h-px flex-grow bg-gray-300"></div>
                  <span className="px-4 text-gray-500">OR</span>
                  <div className="h-px flex-grow bg-gray-300"></div>
                </div>

                <Button
                  onClick={() => router.push('/register')}
                  variant={'secondary'}
                  className="w-full rounded-full hover:animate-pulse hover:border-2 hover:border-solid hover:border-secondary hover:bg-primary hover:text-secondary"
                >
                  Create account
                </Button>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 rounded-b-xl bg-transparent text-xs">
                By continuing to use the Artisan you accept terms and condition
              </CardFooter>
            </Card>
          </div>
        </div> */}
      </div>
    </Suspense>
  )
}
