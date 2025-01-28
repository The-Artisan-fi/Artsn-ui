import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useKYC } from '@/hooks/use-kyc'
import { countries } from '@/lib/countries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Form validation schema
const kycFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  dateOfBirth: z.string().refine(
    (dob) => {
      const date = new Date(dob)
      const age =
        (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      return age >= 18
    },
    { message: 'You must be at least 18 years old' }
  ),
  phoneNumber: z
    .string()
    .min(10, { message: 'Please enter a valid phone number' }),
  countryCode: z.string().min(2, { message: 'Please select a country' }).max(2),
})

type KYCFormValues = z.infer<typeof kycFormSchema>

interface KYCVerificationProps {
  onComplete?: () => void
  className?: string
}

const KycForm = ({ onComplete, className }: KYCVerificationProps) => {
  const { startKYCVerification, kycStatus, loading, verificationUrl } = useKYC()
  const form = useForm<KYCFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      phoneNumber: '',
      countryCode: '',
    },
  })

  const onSubmit = async (data: KYCFormValues) => {
    await startKYCVerification({
      ...data,
      phoneNumber: parseInt(data.phoneNumber.replace(/[^0-9]/g, ''), 10),
    })
    onComplete?.()
  }

  if (verificationUrl) {
    return (
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Verification</CardTitle>
          <CardDescription>
            Please complete your verification process by clicking the button
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => {
              window.open(verificationUrl, '_blank')
              onComplete?.()
            }}
          >
            Start Verification Process
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`mx-auto w-full max-w-lg ${className || ''}`}>
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
        <CardDescription>
          Please provide your information to begin the verification process.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            {/* Form fields remain the same */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country, index) => (
                          <SelectItem key={index} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Starting Verification...' : 'Start KYC Verification'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default KycForm
