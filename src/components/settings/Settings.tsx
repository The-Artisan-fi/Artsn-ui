'use client'
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Camera, Loader2, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { useAuthStore } from '@/lib/stores/useAuthStore'
import * as z from 'zod'
import { useMutation } from '@apollo/client'
import { UPDATE_USER ,DELETE_USER} from '@/graphql/mutations/user'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'

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

// Removed onClose from props interface
interface SettingProps {}

// Removed onClose from component props
const Setting: React.FC<SettingProps> = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})
  const [updateUser] = useMutation(UPDATE_USER)
  const [deleteUser] = useMutation(DELETE_USER)
  const { currentUser } = useAuthStore()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const router = useRouter()

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
    // }
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
  


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('currentUser ->', currentUser)
      
      // Get the paraSession from the auth store
      const paraSession = useAuthStore.getState().authToken
      
      if (!paraSession) {
        toast({
          title: 'Authentication error',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      if (!currentUser || (!currentUser._id && !currentUser.uuid)) {
        toast({
          title: 'Authentication error',
          description: 'User information is missing. Please log in again.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Log the paraSession for debugging
      console.log('Using paraSession:', paraSession.substring(0, 20) + '...')
      console.log('currentUser object:', JSON.stringify(currentUser, null, 2))
      console.log('User ID being used:', currentUser!._id || currentUser!.uuid)

      const result = await updateUser({
        variables: {
          id: currentUser!._id || currentUser!.uuid,
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
          
          // Check if the error is due to authentication
          if (error.message.includes('Not authenticated') || 
              error.message.includes('Authentication failed')) {
            toast({
              title: 'Authentication error',
              description: 'Your session has expired. Please log in again.',
              variant: 'destructive',
            })
          } else {
            toast({
              title: 'Error updating profile',
              description: error.message,
              variant: 'destructive',
            })
          }
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

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const paraSession = useAuthStore.getState().authToken
      
      if (!paraSession) {
        toast({
          title: 'Authentication error',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        })
        return
      }

      if (!currentUser || (!currentUser._id && !currentUser.uuid)) {
        toast({
          title: 'Authentication error',
          description: 'User information is missing. Please log in again.',
          variant: 'destructive',
        })
        return
      }

      // Use _id if available, otherwise use uuid
      const userId = currentUser._id || currentUser.uuid;
      
      // Log the user ID for debugging
      console.log('Attempting to delete user with ID:', userId);

      const result = await deleteUser({
        variables: {
          id: userId,
        }
      })

      if (result.data?.deleteUser) {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        })
        
        // Reset all auth state and clear storage
        useAuthStore.getState().resetAuth()
        localStorage.clear()
        
        // Make logout request to Para API
        await fetch('https://api.beta.getpara.com/logout', {
          method: 'GET',
        });
        
        window.location.href = '/';
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      console.log('User data:', currentUser)
      setFormData({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        country: currentUser?.country || '',
        email: currentUser?.email || '',
        // phoneNumber: user.phoneNumber || "",
      })
    }
  }, [currentUser])

  return (
    <ErrorBoundary>
      <div
        className="mx-auto w-full"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <Card className="w-full border-none shadow-none">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  {/* Role field alone at the top */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="p-2 border rounded bg-gray-100">
                      {currentUser?.role || 'No role assigned'}
                    </div>
                  </div>
                  
                  {/* Other inputs in a grid */}
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
                        value={formData.country || currentUser?.country || ''}
                        onValueChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            country: value
                          }));
                          validateField('country', value);
                        }}
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
                  </div>
                </div>

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




    

                {/* Submit Button */}
                <div
                  className="flex justify-between gap-4 pt-4"
                >
                  <Button
                    type="button"
                    className="bg-red-500 text-black hover:bg-red-600"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Account
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isLoading || Object.keys(validationErrors).length > 0
                    }
                    className="text-white bg-secondary"
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
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        {/* Delete Account Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  )
}

export default Setting
