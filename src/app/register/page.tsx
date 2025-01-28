'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/register/RegisterForm'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'

export default function RegisterPage() {
  const router = useRouter()
  const [pendingRegistration, setPendingRegistration] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRegistrationData = () => {
      try {
        const stored = sessionStorage.getItem('pendingRegistration')
        if (stored) {
          setPendingRegistration(JSON.parse(stored))
        } else {
          console.log('No pending registration found')
          router.push('/register')
        }
      } catch (error) {
        console.error('Error loading registration data:', error)
        router.push('/register')
      } finally {
        setIsLoading(false)
      }
    }

    loadRegistrationData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm
        initialData={pendingRegistration}
        onClose={() => {
          sessionStorage.removeItem('pendingRegistration')
          router.push('/dashboard')
        }}
      />
    </Suspense>
  )
}
