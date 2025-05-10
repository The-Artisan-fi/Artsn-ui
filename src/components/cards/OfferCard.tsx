import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const OfferCard = () => {
  return (
    <Card className="h-96 w-11/12 self-center overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white md:w-11/12">
      <CardContent className="relative h-full p-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-800 to-gray-900 opacity-50"></div>
        <div className="absolute left-0 right-0 top-0 z-[2] h-full w-full bg-gradient-to-b from-black to-transparent p-6 opacity-60" />
        <div className="absolute right-0 top-[10px] z-[1] flex w-full flex-col items-end">
          <Image
            src="/products/watch.png"
            alt="Luxury Watch"
            width={300}
            height={300}
            quality={100}
            className="w-45 h-auto -rotate-[5deg] md:w-1/2 md:scale-100"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-[3] bg-gradient-to-t from-black to-transparent p-6">
          <h2 className="mb-2 text-2xl font-bold">
            {`Your Gateway to Luxury Watch Investment | Start with $100`}
          </h2>
          <p className="mb-4 text-gray-300">
            {`Join the luxury asset investment revolution with fractional ownership`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default OfferCard
