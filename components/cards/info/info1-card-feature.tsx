'use client';
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card-ui"
import { Separator } from '@/components/ui/shadcn/separator-ui';

interface DefaultProps {
  className?: string;
}

const Card1 = (
  props: DefaultProps
) => {
  return (
    <Card
      className={`${props.className}`}
    >
      <CardHeader>
        <CardTitle className="text-secondary mb-4">
          Past Performance
        </CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className='flex flex-col text-secondary h-full justify-between'>
        <div className='flex flex-row items-center w-full justify-between'>
          <p>
            S&P 500
          </p>
          <p>
            +6% over last 3 years
          </p>
        </div>
        <Separator />
        <div className='flex flex-row items-center w-full justify-between'>
          <p>
            Watches
          </p>
          <p>
            +56% over last 3 years
          </p>
        </div>
        <Separator />
        <div className='flex flex-row items-center w-full justify-between'>
          <p>
            Cars
          </p>
          <p>
            +156% over last 3 years
          </p>
        </div>
        <Separator />
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-lg">
        <div className="flex gap-2 font-medium leading-none">
          Watches
        </div>
        <div className="flex gap-2 leading-none text-muted-foreground text-5xl">
          +60%
        </div>
      </CardFooter> */}
    </Card>
  )
}

export default Card1;