'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { use, useState } from 'react'
import { useAddToWaitlist } from '@/hooks/add-to-waitlist'
import { useMutation } from '@apollo/client'
import { SUBSCRIBE_EMAIL } from '@/graphql/mutations/user'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form'

const formSchema = z.object({
  email: z.string().min(3, {
    message: 'Must be a valid email.',
  }),
})
interface DefaultProps {
  className?: string
}

const CtaCard3 = (props: DefaultProps) => {
  const [email, setEmail] = useState('')
  const { addToWaitlist, isLoading, error } = useAddToWaitlist()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })
  
  const { toast } = useToast()
  const [subscribeEmail] = useMutation(SUBSCRIBE_EMAIL);

  function onSubmit(values: z.infer<typeof formSchema>) {
    subscribeEmail({
      variables: {
        email: values.email,
      }
    })
      .then((result) => {
        console.log('result', result);
        const { success, message } = result.data.subscribeEmail;
        console.log('Subscription response:', message);
        
        if (success) {
          // Show success toast
          toast({
            title: "Success!",
            description: message || "Email Registered for Announcements",
          });
          // Reset form
          form.reset();
        } else {
          // Show warning toast for unsuccessful but not error responses
          toast({
            title: "Notice",
            description: message || "Could not complete registration",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Show error toast
        toast({
          title: "Error",
          description: error.message || "Failed to register email",
          variant: "destructive",
        });
      });
  }

  return (
    <Card
      className={`${props.className} align-center flex h-72 w-11/12 mx-auto flex-col justify-center rounded-none border-none bg-bg shadow-none`}
      style={{ borderTop: 'solid 1px gray', borderBottom: 'solid 1px gray' }}
    >
      <CardContent className="flex w-full flex-col items-center justify-between self-center md:flex-row">
        <div className="flex w-full flex-col text-wrap md:w-2/5">
          <h2 className="mb-4 flex flex-row gap-4 self-center text-gray-500 font-cormorant text-5xl md:self-start lg:text-6xl">
            <span className="italic text-gray-700" style={{ fontWeight: '600'}}>
              Stay
            </span>
            updated
          </h2>
          <p className="text-base text-gray-600 text-center md:text-left">
            {
              "Stay aware of everything happening in Artisan's world and all the newest features"
            }
          </p>
        </div>
        <Form {...form}>
          <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
            <div className="flex flex-col gap-2 md:flex-row md:gap-0">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        className="h-10 w-full flex-grow rounded-full bg-white focus:border-gray-300 focus:ring-0 md:rounded-r-none md:border-r-0"
                        placeholder="Your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="h-10 bg-black px-8 text-white hover:bg-gray-800 md:rounded-l-none md:rounded-r-full"
                onClick={form.handleSubmit(onSubmit)} 
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CtaCard3
