import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DefaultProps {
  className?: string
}

const DesignedCard = (props: DefaultProps) => {
  return (
    <div className={`${props.className}`}>
      <Badge className="mb-6 w-fit self-center border-zinc-200">
        <span className="text-2xl text-secondary">User Friendly</span>
      </Badge>
      <Card className="h-96 w-11/12 flex-col self-center overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white md:w-8/12">
        <CardContent className="relative p-6">
          <div className="absolute left-0 right-0 top-0 h-2/3 overflow-hidden">
            <div className="absolute -top-20 hidden translate-y-8 -rotate-12 transform -space-x-16 md:-top-10 md:flex">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="rounded-3xl= flex h-auto w-auto items-center justify-center shadow-lg"
                  style={{
                    transform: `translateY(${index * 50}px) rotate(${index * 5}deg)`,
                  }}
                >
                  <Image
                    src="/products/phone-mockup.svg"
                    alt="Luxury Watch"
                    width={300}
                    height={300}
                    className="w-45 h-auto -rotate-[45deg] scale-150 transform object-cover md:w-7/12 md:-rotate-[35deg] lg:w-7/12"
                  />
                </div>
              ))}
            </div>
            <div className="absolute -top-20 flex translate-y-8 -rotate-12 transform -space-x-16 md:-top-10 md:hidden">
              {[0].map((index) => (
                <div
                  key={index}
                  className="rounded-3xl= flex h-auto w-auto items-center justify-center shadow-lg"
                  style={{
                    transform: `translateY(${index * 50}px) rotate(${index * 5}deg)`,
                  }}
                >
                  <Image
                    src="/products/phone-mockup.svg"
                    alt="Luxury Watch"
                    width={300}
                    height={300}
                    className="w-45 h-auto -rotate-[45deg] scale-150 transform object-cover md:w-7/12 md:-rotate-[35deg] lg:w-7/12"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-48 space-y-2">
            <h2 className="text-xl font-bold">Designed for everyone.</h2>
            <p className="text-sm text-primary">
              Connect with your email, pay with your card. It&apos;s that
              simple.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-800 p-4">
          <Button
            variant="default"
            className="border-gray-600 text-black hover:bg-gray-600 hover:text-white"
          >
            Pay with credit card or crypto
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DesignedCard
