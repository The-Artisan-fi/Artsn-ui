'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnvelopeClosedIcon, TwitterLogoIcon } from '@radix-ui/react-icons'

interface DefaultProps {
  className?: string
}

const CtaCard2 = (props: DefaultProps) => {
  return (
    <Card className={`${props.className}`}>
      {/* <CardHeader>
        <CardTitle>
          TOTAL VALUE
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-col gap-6 py-4">
        <p className="text-center text-3xl text-secondary">
          <span className="font-normal italic">Diversify with luxury:</span>
        </p>
        <p className="text-center text-2xl text-zinc-400">
          Own and trade real-world assets
        </p>
      </CardContent>
      <CardFooter className="flex-col justify-center">
        <Button
          asChild
          variant="ghost"
          className="bg-secondary-text h-12 w-3/4 gap-6 rounded-xl text-xl underline"
        >
          <Link href="/marketplace" target="_blank">
            Explore the marketplace
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CtaCard2
