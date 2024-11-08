import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const OfferCard = () => {
  return (
    <Card className="w-11/12 h-96 md:w-8/12 self-center bg-gradient-to-br from-gray-800 to-gray-900 text-white overflow-hidden">
      <CardContent className="p-0 relative h-full ">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-800 to-gray-900 opacity-50"></div>
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black to-transparent w-full h-full z-[2] opacity-60" />
        <div className="absolute top-[10px] right-0 flex flex-col w-full items-end z-[1]">
            <Image
                src="/products/watch.svg"
                alt="Luxury Watch"
                width={300}
                height={300}
                className="h-auto w-45 md:w-1/2 -rotate-[5deg] md:scale-100"
            />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-[3]">
          <h2 className="text-2xl font-bold mb-2">
            {`Your Gateway to Luxury Watch Investment | Start with $100`}
          </h2>
          <p className="text-gray-300 mb-4">
            {`Join the luxury asset investment revolution with fractional ownership`}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-black bg-opacity-50 p-4">
        <Button variant="outline" className="bg-white text-black hover:bg-gray-200">
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;