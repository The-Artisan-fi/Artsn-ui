'use client'
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Camera, Loader2, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import { UPDATE_USER } from '@/graphql/mutations/user'
import * as z from 'zod'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/providers/Web3AuthProvider'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { FormControl } from '../ui/form'
import { countries } from '@/lib/countries'

// Animation variants remain the same
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// Updated Validation schema
// const socialSchema = z.object({
//   twitter: z.string().regex(/^@?(\w){1,15}$/, "Invalid Twitter username").optional(),
//   instagram: z.string().regex(/^@?(\w){1,30}$/, "Invalid Instagram username").optional(),
//   website: z.string().url("Invalid URL").optional(),
// });

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  //   social: socialSchema,
  baseProfile: z.object({
    displayName: z.string().optional(),
    displayRole: z.string().optional(),
    bio: z.string().optional(),
    photoUrl: z.string().optional(),
  }),
  investorInfo: z.object({
    investmentPreferences: z.array(z.string()).optional(),
    investmentHistory: z.array(z.string()).optional(),
    riskTolerance: z.string().optional(),
    preferredInvestmentDuration: z.string().optional(),
  }),
})

// Error Boundary Component remains the same
interface ErrorBoundaryState {
  hasError: boolean
  error: any
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Something went wrong. Please try refreshing the page or contact
            support if the issue persists.
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

const Settings = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})
  const [updateUser] = useMutation(UPDATE_USER)
  const { user } = useAuth()
  // Initial form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    // phoneNumber: "",
    // social: {
    //   twitter: "",
    //   instagram: "",
    //   website: ""
    // },
    baseProfile: {
      displayName: '',
      displayRole: '',
      bio: '',
      photoUrl: '',
    },
    investorInfo: {
      investmentPreferences: [],
      investmentHistory: [],
      riskTolerance: '',
      preferredInvestmentDuration: '',
    },
  })

  // Validate single field
  const validateField = (name: string | number, value: any) => {
    try {
      if (typeof name === 'string' && name.includes('.')) {
        const [parent, child] = name.split('.')
        // const schema = parent === 'social' ? socialSchema : userSchema;
        const schema = userSchema
        ;(schema.shape as any)[child].parse(value)
      } else {
        userSchema.shape[name as keyof typeof userSchema.shape].parse(value)
      }

      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
        }))
      }
    }
  }

  // Handle input changes
  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target

    if (name.includes('.')) {
      const [parent, child] = name.split('.') as [keyof typeof formData, string]
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(typeof prev[parent] === 'object' && prev[parent] !== null
            ? prev[parent]
            : {}),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    validateField(name, value)
  }

  // Handle image upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'coverImageUrl' | 'profilePictureUrl' | 'photoUrl'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, or WebP image',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsUploading(true)

      // Create FormData
      const formData = new FormData()
      formData.append('files', file)
      formData.append('userId', user!.publicKey)
      const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000'
      // Upload to public S3 bucket
      const response = await fetch(`${baseUrl}/api/aws/public`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      const imageUrl = result.uploads[0].url
      console.log('Uploaded image URL:', imageUrl)
      // Update the appropriate field in formData
      if (field === 'photoUrl') {
        setFormData((prev) => ({
          ...prev,
          baseProfile: {
            ...prev.baseProfile,
            photoUrl: imageUrl,
          },
        }))
      } else {
        console.log('field is ->', field)
        console.log('formData is ->', formData)
        setFormData((prev) => ({
          ...prev,
          [field]: imageUrl,
        }))
      }

      // Log the updated formData for debugging
      console.log('Updated form data after image upload:', {
        field,
        imageUrl,
        formData,
      })

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle copy to clipboard
  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied to clipboard',
        duration: 2000,
      })
    } catch (err) {
      toast({
        title: 'Failed to copy',
        variant: 'destructive',
        duration: 2000,
      })
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('user ->', user)

      const result = await updateUser({
        variables: {
          _id: user!._id,
          input: {
            ...formData,
          },
        },
        onCompleted: (data) => {
          console.log('Mutation completed with data:', data)
          toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully',
          })
        },
        onError: (error) => {
          console.error('Mutation error:', {
            message: error.message,
            graphQLErrors: error.graphQLErrors?.map((err) => ({
              message: err.message,
              path: err.path,
              extensions: err.extensions,
            })),
            networkError: error.networkError,
          })
        },
      }).catch((error) => {
        console.error('Caught in mutation catch block:', error)
        throw error
      })
      console.log('result ->', result)
      if (result.data && result.data.updateUser) {
        console.log('User updated successfully:', result.data.updateUser)
      } else {
        console.error('UpdateUser mutation returned null or undefined')
      }
    } catch (error: any) {
      console.error('Error updating user:', error)
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((graphQLError: any) => {
          console.error('GraphQL error:', graphQLError.message)
          if (graphQLError.extensions) {
            console.error('Error extensions:', graphQLError.extensions)
          }
        })
      }
      if (error.networkError) {
        console.error('Network error:', error.networkError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      console.log('User data:', user)
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        country: user.country || '',
        email: user.email || '',
        // phoneNumber: user.phoneNumber || "",
        // social: {
        //   twitter: user.social?.twitter || "",
        //   instagram: user.social?.instagram || "",
        //   website: user.social?.website || ""
        // },
        baseProfile: {
          displayName: user.baseProfile?.displayName || '',
          displayRole: user.baseProfile?.displayRole || '',
          bio: user.baseProfile?.bio || '',
          photoUrl: user.baseProfile?.photoUrl || '',
        },
        investorInfo: {
          investmentPreferences: user.investorInfo?.investmentPreferences || [],
          investmentHistory: user.investorInfo?.investmentHistory || [],
          riskTolerance: user.investorInfo?.riskTolerance || '',
          preferredInvestmentDuration:
            user.investorInfo?.preferredInvestmentDuration || '',
        },
      })
    }
  }, [user])

  return (
    <ErrorBoundary>
      <motion.div
        className="mx-auto mt-20 w-full max-w-3xl p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <form onSubmit={handleSubmit}>
          <motion.div variants={cardVariants}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        onValueChange={() => handleChange}
                        defaultValue={formData.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country, index) => (
                            <SelectItem key={index} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div> */}
                  </div>
                </motion.div>

                {/* Profile Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="baseProfile.displayName"
                      value={formData.baseProfile.displayName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Profile Picture</Label>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'photoUrl')}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayRole">Display Role</Label>
                    <Input
                      id="displayRole"
                      name="baseProfile.displayRole"
                      value={formData.baseProfile.displayRole}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="baseProfile.bio"
                      value={formData.baseProfile.bio}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Social Links */}
                {/* <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">X (Twitter)</Label>
                    <Input 
                      id="twitter"
                      name="social.twitter"
                      value={formData.social.twitter}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input 
                      id="instagram"
                      name="social.instagram"
                      value={formData.social.instagram}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      name="social.website"
                      value={formData.social.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </motion.div> */}

                {/* Investor Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium">Investor Preferences</h3>

                  <div className="space-y-2">
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Input
                      id="riskTolerance"
                      name="investorInfo.riskTolerance"
                      value={formData.investorInfo.riskTolerance}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredInvestmentDuration">
                      Preferred Investment Duration
                    </Label>
                    <Input
                      id="preferredInvestmentDuration"
                      name="investorInfo.preferredInvestmentDuration"
                      value={formData.investorInfo.preferredInvestmentDuration}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-end pt-4"
                >
                  <Button
                    type="submit"
                    disabled={
                      isLoading || Object.keys(validationErrors).length > 0
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </form>
      </motion.div>
    </ErrorBoundary>
  )
}

export default Settings
