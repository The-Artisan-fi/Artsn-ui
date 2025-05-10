'use client'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import WaitlistSignup from '@/components/waitlist/Waitlist'
import { useMutation } from '@apollo/client'
import { SUBSCRIBE_EMAIL } from '@/graphql/mutations/user'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  email: z.string().min(3, {
    message: 'Must be a valid email.',
  }),
})

const CtaCard4 = () => {
  // 1. Define your form.
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
    <Card className="flex flex-col items-center rounded-none bg-zinc-700 p-4">
      <div className="h-96 w-full bg-[url(/img/hero-pattern.svg)] bg-cover bg-no-repeat"></div>
      {/* <CardHeader>
        <CardTitle>
          TOTAL VALUE
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-col items-center gap-8 py-4 pb-12">
        <p className="text-center text-6xl">
          <span className="font-light italic">Stay</span> updated
        </p>
        <p className="text-2xl text-slate-500">
            {
              "Stay aware of everything happening in Artisan's world and all the newest features"
            }
        </p>
      </CardContent>
      <CardFooter className="w-full flex-col items-center gap-8 px-4 md:w-1/2 lg:w-1/3">
        <Form {...form}>
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col gap-2 md:flex-row md:gap-0">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        className="h-16 w-full flex-grow rounded-full bg-white focus:border-gray-300 focus:ring-0 md:rounded-r-none md:border-r-0"
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
                className="h-16 bg-black px-8 text-white hover:bg-gray-800 md:rounded-l-none md:rounded-r-full"
                onClick={form.handleSubmit(onSubmit)} 
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                Submit
              </Button>
            </div>
          </div>
        </Form>
      </CardFooter>
    </Card>
  )
}

export default CtaCard4
