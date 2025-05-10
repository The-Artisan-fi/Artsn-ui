import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import WaitlistSignup from '@/components/waitlist/Waitlist'

// Image import
import ArtsThread from '@/public/logos/arts-thread-text-logo.svg'

const WaitlistContainer = () => {
  return (
    <Card className="w-12/12 mb-4 flex cursor-pointer flex-col items-center gap-4 border-none bg-transparent text-center shadow-none">
      <CardHeader>
        <p className="text-sm text-secondary md:text-xl">
          Sign Up now to be one of the first members to have access to the
        </p>
        <p className="text-sm text-secondary md:text-xl">
          most revolutionary platform for creators ever. Monaco will allow
        </p>

        <p className="text-sm text-secondary md:text-xl">
          creators to Create Protect and Monetize their work like never before.
        </p>
      </CardHeader>
      <CardContent>
        {/* Waitlist Section */}
        <WaitlistSignup />
      </CardContent>
      <CardFooter>
        <Badge className="w-fit self-center rounded-xl bg-black px-4 py-2">
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
}

export default WaitlistContainer
