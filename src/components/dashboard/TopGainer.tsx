'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const TopGainer = () => {
  return (
    <Card className=" rounded-3xl w-full h-full bg-bg text-secondary border-zinc-300 dark:border-zinc-700  ">
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <h2 className="text-xl font-semibold text-secondary ">Top Gainer</h2>

        <Image
          src="/products/rolex-bg.svg"
          alt="Top Gainer"
          width={300}
          height={300}
          className="rounded-xl w-full border border-zinc-300 dark:border-zinc-700 my-8 max-h-44"
        />

        <div className="grid grid-cols-2 gap-10 ">
          <div className="flex items-end gap-1">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-300">ROI</p>
              <h1 className="text-3xl text-secondary">$10,324</h1>
            </div>
            <p className="text-sm text-zinc-300">+12%</p>
          </div>
          <div className="flex items-end gap-1">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-300">All time high</p>
              <h1 className="text-3xl text-secondary">$10,324</h1>
            </div>
            <p className="text-sm text-zinc-300">+123$</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopGainer;
