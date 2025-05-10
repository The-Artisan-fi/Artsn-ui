'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const bugReportSchema = z.object({
  reporterId: z.string().email({ message: 'Please enter a valid email' }),
  issueType: z.enum(
    ['Bug', 'Feature Request', 'UI Improvement', 'Performance'],
    {
      required_error: 'Please select an issue type',
    }
  ),
  priority: z.enum(['High', 'Medium', 'Low'], {
    required_error: 'Please select a priority level',
  }),
  summary: z.string().min(10, {
    message: 'Summary must be at least 10 characters.',
  }),
  stepsToReproduce: z.string().min(10, {
    message: 'Steps must be at least 10 characters.',
  }),
  expectedBehavior: z.string().min(10, {
    message: 'Expected behavior must be at least 10 characters.',
  }),
  actualBehavior: z.string().min(10, {
    message: 'Actual behavior must be at least 10 characters.',
  }),
  deviceInfo: z.string().min(5, {
    message: 'Please provide device information.',
  }),
  appVersion: z.string(),
  screenName: z.string().min(2, {
    message: 'Please specify where this occurred.',
  }),
  frequency: z.enum(['Always', 'Sometimes', 'Rarely', 'Once'], {
    required_error: 'Please select frequency',
  }),
  networkStatus: z.enum(['Online', 'Offline'], {
    required_error: 'Please select network status',
  }),
  additionalNotes: z.string().optional(),
})

type BugReportType = z.infer<typeof bugReportSchema>

export const BugReport = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const form = useForm<BugReportType>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      networkStatus: 'Online',
      // Pre-fill device info
      deviceInfo: `${navigator.userAgent}`,
      // Pre-fill current page
      screenName: typeof window !== 'undefined' ? window.location.pathname : '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/bug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.getValues()),
      })

      if (!response.ok) {
        throw new Error('Failed to submit bug report')
      }

      const result = await response.json()

      toast({
        title: 'Bug Report Submitted',
        description: `Issue ID: ${result.issueId}`,
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit bug report. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'fixed bottom-4 left-4 h-12 w-12 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl',
            className
          )}
        >
          <Bug className="h-6 w-6" />
          <span className="sr-only">Report an Issue</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Help us improve by reporting any bugs or issues you encounter.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="reporterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bug">Bug</SelectItem>
                        <SelectItem value="Feature Request">
                          Feature Request
                        </SelectItem>
                        <SelectItem value="UI Improvement">
                          UI Improvement
                        </SelectItem>
                        <SelectItem value="Performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Always">Always</SelectItem>
                        <SelectItem value="Sometimes">Sometimes</SelectItem>
                        <SelectItem value="Rarely">Rarely</SelectItem>
                        <SelectItem value="Once">Once</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stepsToReproduce"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps to Reproduce</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="1. Navigate to...
                                  2. Click on...
                                  3. Observe that..."
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="expectedBehavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Behavior</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What should happen?"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actualBehavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Behavior</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What actually happened?"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional context or information..."
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit Bug Report
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
