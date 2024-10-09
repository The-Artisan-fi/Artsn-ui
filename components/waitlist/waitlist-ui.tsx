'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/shadcn/button-ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/shadcn/form-ui";
import { Input } from "@/components/ui/shadcn/input-ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select-ui";
import { useToast } from '@/hooks/use-toast';
import { useAddToWaitlist } from "@/hooks/add-to-waitlist";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/shadcn/dialog-ui"

const FormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    userType: z.enum(["Seller", "Investor", "Both"]),
    interest: z.enum(["watches", "cars", "diamonds", "other"]),
    vipAccess: z.enum(["Yes", "No"]),
    referOthers: z.enum(["Yes", "No"]),
    updatePreference: z.enum(["Updates", "Launch"]),
    blockchainFamiliarity: z.enum(["Beginner", "Intermediate", "Expert"])
});

type FormValues = z.infer<typeof FormSchema>;

export default function WaitlistSignup() {
    const { toast } = useToast();
    const { addToWaitlist, isLoading, error } = useAddToWaitlist();
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          name: "",
          email: "",
          userType: "Investor",
          interest: "watches",
          vipAccess: "No",
          referOthers: "No",
          updatePreference: "Updates",
          blockchainFamiliarity: "Beginner"
        },
    });

    const onSubmit = async (_data: z.infer<typeof FormSchema>) => {
        const transformedData = {
            ..._data,
            vipAccess: _data.vipAccess === "Yes",
            referOthers: _data.referOthers === "Yes"
        };
        const res = await addToWaitlist(transformedData);
        if (res.status === 200) {
            console.log('Waitlist response SUCC:', res);
            toast({
                title: "Success!",
                description: "You've been added to the waitlist",
            })
            form.reset();
        } else {
            toast({
                title: "Error",
                description: "There was an error adding you to the waitlist",
            })
        }
    } 

    return (
        <Dialog>
            <DialogTrigger className='w-full md:w-fit'>
                <Button variant={'outline'} className='p-4 border-black w-full' asChild>
                    Join the Waitlist
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[screen]">
                <DialogHeader>
                <DialogTitle>Join the Waitlist!</DialogTitle>
                <DialogDescription>
                    Stay up to date with the latest news and updates.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
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
                            name="userType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>What kind of user are you?</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Seller">Seller</SelectItem>
                                            <SelectItem value="Investor">Investor</SelectItem>
                                            <SelectItem value="Both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="interest"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>What are you most interested in?</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your main interest" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="watches">Watches</SelectItem>
                                            <SelectItem value="cars">Cars</SelectItem>
                                            <SelectItem value="diamonds">Diamonds</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vipAccess"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Join VIP group for early access?</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select option" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Yes">Yes</SelectItem>
                                            <SelectItem value="No">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="referOthers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Refer others to join the waitlist for special rewards?</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select option" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Yes">Yes</SelectItem>
                                            <SelectItem value="No">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="updatePreference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Update Preference</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select update preference" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Updates">Receive platform updates</SelectItem>
                                            <SelectItem value="Launch">{"Just notify me when it's live"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="blockchainFamiliarity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>How familiar are you with blockchain tech?</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your familiarity level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Expert">Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-secondary text-primary hover:bg-slate-400">
                            {isLoading ? 'Submitting...' : 'Join Waitlist'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}