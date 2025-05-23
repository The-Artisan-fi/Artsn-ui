'use client'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TwitterLogoIcon } from '@radix-ui/react-icons'
import WaitlistSignup from '@/components/waitlist/Waitlist'

interface DefaultProps {
  className?: string
}

const CtaCard1 = (props: DefaultProps) => {
  return (
    <Card className={`relative overflow-hidden ${props.className}`}>
      <div className="absolute inset-0 bg-[url('/assets/home/logo-vector.svg')] bg-contain bg-right bg-no-repeat opacity-100" />
      <CardContent className="relative z-10 flex flex-col gap-4 py-8">
        <h2 className="font-urbanist text-3xl">
          Gain{' '}
          <span className="italic" style={{ fontWeight: '300' }}>
            priority
          </span>{' '}
          access by
          <br />
          joining the waitlist
        </h2>
        <p className="text-sm text-gray-600">
          Get Updated And Discover All
          <br />
          The News in The Artisan
        </p>
      </CardContent>
      <CardFooter className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {/* <Button className='w-full sm:w-auto px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800' variant='default'>
          Join the waitlist now
        </Button> */}
        <WaitlistSignup />
        {/* <Button className='w-full sm:w-auto py-2 rounded-lg bg-white text-black border border-black hover:bg-gray-100' variant='outline'>
          Join the Waitlist
        </Button> */}
      </CardFooter>
    </Card>
  )
}

export default CtaCard1
