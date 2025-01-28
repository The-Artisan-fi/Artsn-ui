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

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Must be a valid email.',
  }),
})

const CtaCard4 = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
          Stay aware of everythings happening in Artisan’s wolrd and all the
          newest features
        </p>
      </CardContent>
      <CardFooter className="flex-col items-start items-center gap-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center space-y-8 px-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input
                      className="h-16 w-80 rounded-3xl bg-white"
                      placeholder="Your email address"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <WaitlistSignup /> */}
          </form>
        </Form>
      </CardFooter>
    </Card>
  )
}

export default CtaCard4
