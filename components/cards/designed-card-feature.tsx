import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/shadcn/card-ui";
import { Button } from "@/components/ui/shadcn/button-ui";
import { Badge } from "@/components/ui/shadcn/badge-ui";

interface DefaultProps {
  className?: string;
}

const DesignedCard = (
  props: DefaultProps
) => {
  return (
    <div className={`${props.className}`}>
      <Badge className="w-fit self-center mb-6 border-zinc-200">
        <span className='text-secondary'>User Friendly</span>
      </Badge>
      <Card className="flex-col w-11/12 h-96 md:w-8/12 self-center bg-gradient-to-br from-gray-800 to-gray-900 text-white overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 left-0 h-2/3 overflow-hidden">
              <div className="hidden md:flex absolute -top-20 md:-top-10 -space-x-16 -rotate-12 transform translate-y-8">
                  {[0, 1, 2].map((index) => (
                  <div
                      key={index}
                      className="w-auto h-auto rounded-3xl= shadow-lg flex items-center justify-center"
                      style={{
                      transform: `translateY(${index * 50}px) rotate(${index * 5}deg)`,
                      }}
                  >
                      <Image
                          src="/products/phone-mockup.svg"
                          alt="Luxury Watch"
                          width={300}
                          height={300}
                          className="h-auto w-45 md:w-7/12 lg:w-7/12 object-cover transform -rotate-[45deg] md:-rotate-[35deg] scale-150"
                      />
                  </div>
                  ))}
              </div>
              <div className="flex md:hidden absolute -top-20 md:-top-10 -space-x-16 -rotate-12 transform translate-y-8">
                  {[0].map((index) => (
                  <div
                      key={index}
                      className="w-auto h-auto rounded-3xl= shadow-lg flex items-center justify-center"
                      style={{
                      transform: `translateY(${index * 50}px) rotate(${index * 5}deg)`,
                      }}
                  >
                      <Image
                          src="/products/phone-mockup.svg"
                          alt="Luxury Watch"
                          width={300}
                          height={300}
                          className="h-auto w-45 md:w-7/12 lg:w-7/12 object-cover transform -rotate-[45deg] md:-rotate-[35deg] scale-150"
                      />
                  </div>
                  ))}
              </div>
          </div>
          <div className="mt-48 space-y-2">
            <h2 className="text-xl font-bold">Designed for everyone.</h2>
              <p className="text-primary text-sm">
              Connect with your email, pay with your card. It&apos;s that simple.
              </p>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-800 p-4">
          <Button variant="default" className="text-black border-gray-600 hover:bg-gray-600 hover:text-white">
            Pay with credit card or crypto
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DesignedCard;