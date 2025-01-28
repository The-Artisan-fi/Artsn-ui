'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { countries } from '@/lib/countries'
import { REGISTER_USER, CREATE_USER } from '@/graphql/mutations/user'
import { IS_USER_REGISTERED } from '@/graphql/queries/user'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdownMenu'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { useWeb3Auth } from '@/hooks/use-web3-auth'
import { IAdapter } from '@web3auth/base'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { v4 as uuidv4 } from 'uuid'
import RPC from '@/components/blockchain/solana-rpc'

interface RegisterFormProps {
  initialData: {
    publicKey: string
    userInfo: {
      email?: string
      name?: string
      profileImage?: string
    }
  }
  onClose: () => void
}

export function RegisterForm({ initialData, onClose }: RegisterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const { setCurrentUser } = useAuthStore()
  // Use the web3auth hook
  const {
    web3auth,
    provider,
    loading: web3Loading,
    injectedAdapters,
    login,
    loginWithAdapter,
  } = useWeb3Auth()

  // GraphQL mutations and queries
  const [checkRegistration] = useLazyQuery(IS_USER_REGISTERED)
  // const [registerUser] = useMutation(REGISTER_USER)
  const [registerUser] = useMutation(CREATE_USER)

  // Form state
  const [formData, setFormData] = useState({
    email: initialData?.userInfo?.email || '',
    username: '',
    publicKey: initialData?.publicKey || '',
    firstName: initialData?.userInfo?.name?.split(' ')[0] || '',
    lastName: initialData?.userInfo?.name?.split(' ')[1] || '',
    country: 'CH',
    acceptTerms: new Date().toISOString(),
    plan: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? Date.now() : value,
    }))
  }

  const handleLogin = useCallback(
    async (adapterName: string) => {
      try {
        await loginWithAdapter(adapterName)
        toast({
          title: 'Connected',
          description: 'Successfully connected wallet',
        })
      } catch (error) {
        console.error('Login error:', error)
        toast({
          title: 'Connection Failed',
          description: 'Failed to connect wallet',
          variant: 'destructive',
        })
      }
    },
    [loginWithAdapter, toast]
  )

  const handleRegistration = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.country ||
      !formData.publicKey
    ) {
      toast({
        title: 'Missing Information',
        description:
          'Please fill in all required fields and connect your wallet',
        variant: 'destructive',
      })
      return
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.publicKey, // Using publicKey as password
          publicKey: formData.publicKey,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          profilePictureUrl: initialData?.userInfo?.profileImage || '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setCurrentUser({
        _id: data.userId,
        uuid: data.uuid,
        publicKey: formData.publicKey,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        username: `user_${formData.publicKey.slice(-4)}`,
        isActive: true,
        isVerified: false,
        role: 'USER',
        baseProfile: {
          displayName: `${formData.firstName} ${formData.lastName}`,
          displayRole: 'USER',
          photoUrl: initialData?.userInfo?.profileImage || '',
          bio: '',
        },
      })

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully',
      })

      setStep(2)
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Registration Failed',
        description:
          error instanceof Error ? error.message : 'Failed to register user',
        variant: 'destructive',
      })
    }
  }

  if (web3Loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="fixed inset-0 z-[100] flex h-full items-center justify-center bg-black bg-opacity-100">
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50" />
      <div className="relative z-20 w-full max-w-4xl rounded-lg bg-transparent p-6">
        <Button
          onClick={() => router.push('/')}
          className="absolute -top-10 right-2 z-30"
        >
          Close
        </Button>

        <Progress
          className="my-6 w-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-sm"
          value={step === 1 ? 50 : 100}
        />

        {step === 1 ? (
          <div className="flex flex-row gap-6">
            <Card className="flex w-full flex-col border-none bg-primary p-8 text-secondary md:w-1/2">
              <h3 className="mb-4 text-xl font-bold">
                FILL YOUR ACCOUNT INFORMATION
              </h3>

              <div className="mb-4 flex flex-col gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="rounded border p-2"
                  required
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="rounded border p-2"
                  required
                />

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="rounded border p-2"
                  required
                >
                  <option value="CH">Switzerland 🇨🇭</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>

                <div className="mt-4">
                  <h3 className="mb-2 text-xl font-bold">CONNECT A WALLET</h3>
                  <div className="mb-4 flex flex-col justify-evenly gap-4">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-none font-urbanist text-lg hover:bg-secondary hover:text-primary"
                      onClick={() => login()}
                      disabled={!!formData.publicKey}
                    >
                      Google
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="default"
                          className="w-full rounded-full border-secondary font-urbanist text-lg hover:bg-secondary hover:text-primary"
                          disabled={!!formData.publicKey}
                        >
                          Connect Wallet
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

                      <DropdownMenuContent className="z-[201] w-56">
                        <DropdownMenuGroup>
                          {injectedAdapters?.map(
                            (adapter: IAdapter<unknown>) => (
                              <DropdownMenuItem
                                key={adapter.name}
                                onClick={() => handleLogin(adapter.name)}
                              >
                                <img
                                  src={`/login/${adapter.name.toLowerCase()}_icon.svg`}
                                  alt={adapter.name}
                                  className="mr-2 h-5 w-5"
                                />
                                {adapter.name.charAt(0).toUpperCase() +
                                  adapter.name.slice(1)}
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <Button
                disabled={!formData.publicKey}
                onClick={handleRegistration}
                className="rounded bg-secondary px-4 py-2 text-primary hover:text-secondary"
              >
                Next
              </Button>

              <div className="mt-4 text-sm text-gray-600">
                By continuing, you agree to our Terms and Conditions.
              </div>
            </Card>

            <Card className="relative hidden w-1/2 flex-col overflow-hidden bg-bg text-secondary md:flex">
              <div className="bg-right-middle h-full w-full translate-x-[4rem] translate-y-[7rem] scale-150 transform rounded-xl bg-[url(/products/rolex-bg.svg)] bg-contain bg-no-repeat" />
              <CardHeader className="absolute bottom-0 left-0 w-1/2">
                <CardTitle className="text-xl font-bold">
                  Buy a fraction of your favorite asset
                </CardTitle>
                <CardDescription className="text-md">
                  Democratizing Luxury one fraction at a time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <div className="flex flex-row gap-6">
            <Card className="flex w-full flex-col border-none bg-primary p-8 text-secondary md:w-1/2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                <Check className="h-8 w-8 text-white" />
              </div>

              <h3 className="mb-4 text-2xl font-bold">Congratulations!</h3>
              <p className="mb-4">Your account has been created</p>

              {formData.publicKey && (
                <p className="mb-4">
                  <strong>
                    Wallet: {formData.publicKey.slice(0, 4)}...
                    {formData.publicKey.slice(-4)}
                  </strong>
                </p>
              )}

              <Button
                onClick={() => {
                  onClose()
                  router.push('/dashboard')
                }}
                className="rounded bg-black px-4 py-2 text-white"
              >
                Enter Dashboard
              </Button>
            </Card>

            <Card className="relative hidden w-1/2 flex-col overflow-hidden bg-bg text-secondary md:flex">
              <div className="bg-right-middle hidden h-full w-full translate-x-20 translate-y-20 scale-150 transform rounded-xl bg-[url(/products/rolex-bg.svg)] bg-contain bg-no-repeat md:flex" />
              <CardHeader className="absolute bottom-0 left-0 w-1/2">
                <CardTitle className="text-xl font-bold">
                  Buy a fraction of your favorite asset
                </CardTitle>
                <CardDescription className="text-md">
                  Democratizing Luxury one fraction at a time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
