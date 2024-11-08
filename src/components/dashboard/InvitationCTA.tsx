'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const InvitationCTA = () => {
  return (
    <Card className="rounded-3xl h-full w-full bg-transparent text-secondary border-zinc-300 dark:border-zinc-700 relative overflow-hidden">
      <CardContent className="p-2 h-full flex flex-col bg-transparent">
        <div className="w-full h-full bg-bg text-secondary p-6 rounded-lg shadow-lg flex">
          <div className="flex-1 pr-6 flex flex-col items-start">
            <h2 className="text-2xl font-bold mb-4">
              Invite your friends & earn your reward!
            </h2>
            <p className="text-zinc-400 text-sm mb-6 w-1/2">
              You and your friend will both receive $10 when your friend invests
              in their first Artisan offering.
            </p>
            <Button className="mb-6 rounded-xl bg-zinc-900 text-[#fff] dark:bg-zinc-700">
              Join the Artisan Referral Program
            </Button>
            <p className="text-zinc-500 text-xs mt-auto">
              Learn more about the Referral program
            </p>
          </div>

          <Image
            src="/products/car3.svg"
            alt="Referral program illustration"
            width={100}
            height={300}
            className="absolute -top-[1rem] right-[-60%] h-full w-full "
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationCTA;
