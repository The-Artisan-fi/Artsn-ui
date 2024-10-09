'use client';
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card-ui"
import { Button } from "@/components/ui/shadcn/button-ui"

interface DefaultProps {
  className?: string;
}

const Card2 = (
  props: DefaultProps
) => {
  return (
    <Card
      className={`${props.className}`}
    >
      {/* <CardHeader>
        <CardTitle>
          TOTAL VALUE
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className='py-4 pb-12 h-3/4'>
        <p className='text-4xl font-semibold text-secondary'>
          Every asset {" "}
          <span className="text-slate-400">
            authenticated
          </span>
          , { " " }
          <span className="text-slate-400">
          certified
          </span>
          , and { " " } 
          <span className="text-slate-400">
          securely vaulted.
          </span>
        </p>
        
      </CardContent>
      <CardFooter className="flex-row justify-between gap-2 text-lg">
        <p className="text-primary bg-secondary text-lg flex text-center truncate bg-black w-fit-content px-4 py-1 rounded-full">
          Certified
        </p>
        <Image
          src={'/icons/check-icon.svg'}
          width={40}
          height={40}
          alt='check icon'
        />
      </CardFooter>
    </Card>
  )
}

export default Card2;