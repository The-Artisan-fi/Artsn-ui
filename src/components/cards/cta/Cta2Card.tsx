'use client';
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnvelopeClosedIcon, TwitterLogoIcon } from '@radix-ui/react-icons'

interface DefaultProps {
  className?: string;
}

const CtaCard2 = (
  props: DefaultProps
) => {
  return (
    <Card className={`${props.className}`}>
      {/* <CardHeader>
        <CardTitle>
          TOTAL VALUE
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className='flex flex-col py-4 gap-6'>
        <p className='text-3xl text-center text-secondary'>
            
            <span className='italic font-normal'>Diversify with luxury:</span>
        </p>
        <p className='text-2xl text-center text-zinc-400'>
          Own and trade real-world assets
        </p>
      </CardContent>
      <CardFooter className="flex-col justify-center">
        <Button asChild variant='ghost' className='w-3/4 h-12 gap-6 rounded-xl bg-secondary-text text-xl underline' >
          <Link href="/marketplace" target="_blank" >
            Explore the marketplace
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CtaCard2;