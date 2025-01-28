import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/Web3AuthProvider'
import { useToast } from '@/hooks/use-toast'
import { UPDATE_USER } from '@/graphql/mutations/user'
import { useMutation } from '@apollo/client'

interface KYCRegistration {
  dateOfBirth: string
  email: string
  firstName: string
  lastName: string
  middleName?: string
  personalCode?: string
  phoneNumber: number
  countryCode: string
}

interface CreateIDVResponse {
  id: string
  status: string
}

interface UseKYCReturn {
  startKYCVerification: (registration: KYCRegistration) => Promise<void>
  kycStatus: 'idle' | 'pending' | 'completed' | 'failed'
  error: string | null
  loading: boolean
  verificationUrl: string | null
}

const ONDATO_IDV_URL =
  process.env.NEXT_PUBLIC_ONDATO_IDV_URL || 'https://sandbox-idv.ondato.com'

export const useKYC = (): UseKYCReturn => {
  const [kycStatus, setKYCStatus] = useState<
    'idle' | 'pending' | 'completed' | 'failed'
  >('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null)

  const [updateUser, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_USER, {
      onCompleted: (data) => {
        console.log('Update user mutation completed:', data)
      },
      onError: (error) => {
        console.error('Update user mutation error:', error)
      },
    })

  const { user } = useAuth()
  const { toast } = useToast()

  const startKYCVerification = useCallback(
    async (registration: KYCRegistration) => {
      try {
        setLoading(true)
        setError(null)

        console.log('Starting KYC verification with user:', user)
        console.log('Registration data:', registration)

        // Create identity verification
        const response = await fetch('/api/kyc/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            externalReferenceId: user?.publicKey,
            registration,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || 'Failed to create identity verification'
          )
        }

        const { id }: CreateIDVResponse = await response.json()
        console.log('Received IDV ID:', id)

        try {
          console.log('Updating user with data:', {
            _id: user?._id,
            input: {
              firstName: registration.firstName,
              lastName: registration.lastName,
              email: registration.email,
              kycInfo: {
                idvId: id,
                kycStatus: 'PENDING',
              },
            },
          })

          const { data: mutationData } = await updateUser({
            variables: {
              _id: user!._id,
              input: {
                firstName: registration.firstName,
                lastName: registration.lastName,
                email: registration.email,
                kycInfo: {
                  idvId: id,
                  kycStatus: 'PENDING',
                },
              },
            },
          })

          console.log('Update user mutation response:', mutationData)

          if (!mutationData?.updateUser) {
            throw new Error('Failed to update user information')
          }
        } catch (mutationError) {
          console.error('Mutation error:', mutationError)
          throw new Error(
            `Failed to update user: ${mutationError instanceof Error ? mutationError.message : 'Unknown error'}`
          )
        }

        // Generate verification URL
        const url = `${ONDATO_IDV_URL}/?id=${id}`
        console.log('Generated verification URL:', url)
        setVerificationUrl(url)
        setKYCStatus('pending')

        toast({
          title: 'KYC Verification Started',
          description:
            'Please complete the verification process in the new window',
        })

        // open the verification URL in a new window
        window.open(url, '_blank')
      } catch (err) {
        console.error('KYC verification error:', err)
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to start KYC verification'
        setError(errorMessage)
        setKYCStatus('failed')

        toast({
          title: 'KYC Verification Failed',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [user, updateUser, toast]
  )

  return {
    startKYCVerification,
    kycStatus,
    error,
    loading: loading || updateLoading,
    verificationUrl,
  }
}
