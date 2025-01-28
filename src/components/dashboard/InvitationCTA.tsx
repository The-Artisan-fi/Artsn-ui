'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const InvitationCTA = () => {
  return (
    <Card className="relative h-full w-full overflow-hidden rounded-3xl border-zinc-300 bg-transparent text-secondary dark:border-zinc-700">
      <CardContent className="flex h-full flex-col bg-transparent p-2">
        <div className="flex h-full w-full rounded-lg bg-bg p-6 text-secondary shadow-lg">
          <div className="flex flex-1 flex-col items-start pr-6">
            <h2 className="mb-4 text-2xl font-bold">
              Invite your friends & earn your reward!
            </h2>
            <p className="mb-6 w-1/2 text-sm text-zinc-400">
              You and your friend will both receive $10 when your friend invests
              in their first Artisan offering.
            </p>
            <Button className="mb-6 rounded-xl bg-zinc-900 text-[#fff] dark:bg-zinc-700">
              Join the Artisan Referral Program
            </Button>
            <p className="mt-auto text-xs text-zinc-500">
              Learn more about the Referral program
            </p>
          </div>

          <Image
            src="/products/car3.svg"
            alt="Referral program illustration"
            width={100}
            height={300}
            className="absolute -top-[1rem] right-[-60%] h-full w-full"
          />
        </div>
      </CardContent>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/30 backdrop-blur-sm">
        <div className="rounded-lg bg-white/90 px-6 py-3 shadow-lg">
          <p className="text-xl font-semibold text-gray-800">
            Feature Coming Soon
          </p>
        </div>
      </div>
    </Card>
  )
}

export default InvitationCTA
