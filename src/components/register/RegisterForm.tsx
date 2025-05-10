'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
//import Image from 'next/image'
import { Check } from 'lucide-react'
import { countries } from '@/lib/countries'
import { REGISTER_USER } from '@/graphql/mutations/user'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { client } from '@/providers/ApolloProvider'

interface RegisterFormProps {
  initialData: {
    publicKey: string
    userInfo: {
      email?: string
      //name?: string
      //profileImage?: string
    }
  }
  onClose: () => void
}

export function RegisterForm({ initialData, onClose }: RegisterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { setCurrentUser, setShowRegisterForm } = useAuthStore()

  const [formErrors, setFormErrors] = useState({
    email: '',
  })

  // Form state
  const [formData, setFormData] = useState({
    email: initialData?.userInfo?.email || '',
    publicKey: initialData?.publicKey || '',
    firstName: '',
    lastName: '',
    country: 'CH',
    acceptTerms: new Date().toISOString(),
  })

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? Date.now() : value,
    }))
    
    // Validate email in real time
    if (name === 'email') {
      if (!value) {
        setFormErrors(prev => ({ ...prev, email: 'Email is required' }))
      } else if (!validateEmail(value)) {
        setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      } else {
        setFormErrors(prev => ({ ...prev, email: '' }))
      }
    }
    
    console.log("Form data:", formData);
  }

  const isFormValid = useMemo(() => {
    return (
      !!formData.firstName &&
      !!formData.lastName &&
      !!formData.country &&
      !!formData.publicKey &&
      !!formData.email &&
      validateEmail(formData.email) // Add email validation here
    )
  }, [formData.firstName, formData.lastName, formData.country, formData.publicKey, formData.email])

  const handleRegistration = async () => {
    // Add email validation before submission
    if (!validateEmail(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }
    
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.country ||
      !formData.publicKey ||
      !formData.email
    ) {
      toast({
        title: 'Missing Information',
        description:
          'Please fill in all required fields and connect your wallet',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
        console.log('Registering new user with Para session');
        const { data: registerData } = await client.mutate({
          mutation: REGISTER_USER,
          variables: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            country: formData.country,
            acceptTerms: new Date().toISOString(),
            email: formData.email,
          },
        });
        console.log("Register data:", registerData);
        
        // Get the user data from the registration response
        const userData = registerData.register.user;
        console.log("User data from registration:", userData);

        // Set the current user with the data from the server
        setCurrentUser(userData);

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
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setShowRegisterForm(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex h-full items-center justify-center bg-black bg-opacity-100">
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50" />
      <div className="relative z-20 w-full max-w-4xl rounded-lg bg-transparent p-6">

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

                {(!initialData?.userInfo?.email || initialData.userInfo.email === '') && (
                  <div className="flex flex-col gap-1">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`rounded border p-2 ${formErrors.email ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                )}

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
              </div>

              <Button
                disabled={!isFormValid || isLoading}
                onClick={handleRegistration}
                className={cn(
                  "rounded bg-secondary px-4 py-2",
                  isFormValid && !isLoading
                    ? "text-primary hover:text-secondary" 
                    : "opacity-50 cursor-not-allowed bg-gray-400"
                )}
              >
                {isLoading ? 'Creation...' : 'Next'}
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
                  handleClose()
                }}
                className="rounded bg-black px-4 py-2 text-white"
              >
                Homepage
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
