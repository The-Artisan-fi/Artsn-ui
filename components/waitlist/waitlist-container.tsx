'use client'
import { useState } from "react";
import Image from "next/image"
import { Button } from "@/components/ui/shadcn/button-ui"
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/shadcn/badge-ui"
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from "@/components/ui/shadcn/card-ui";
import WaitlistSignup from "@/components/waitlist/waitlist-ui";

// Image import
import ArtsThread from "@/public/logos/arts-thread-text-logo.svg";

const WaitlistContainer = () => {

    return (
        <Card className="flex flex-col mb-4 cursor-pointer w-12/12  bg-transparent border-none items-center text-center shadow-none gap-4">
            <CardHeader >
            <p className="text-sm md:text-xl text-secondary">
                    Sign Up now to be one of the first members to have access to the
                </p>
                <p className="text-sm md:text-xl text-secondary">
                    most revolutionary platform for creators ever. Monaco will allow 
                   
                </p>
            
                <p className="text-sm md:text-xl text-secondary">
                  
                    creators to Create Protect and Monetize their work like never before.
                </p>
            </CardHeader>
            <CardContent>
            {/* Waitlist Section */}
            <WaitlistSignup />   
            </CardContent>
            <CardFooter>
                <Badge className="w-fit px-4 py-2 rounded-xl bg-black self-center">
                    <Image
                        src={ArtsThread}
                        alt="Arts Thread Logo"
                        width={120}
                        height={120}
                    />
                </Badge>
            </CardFooter>
        </Card>
    )
};

export default WaitlistContainer;