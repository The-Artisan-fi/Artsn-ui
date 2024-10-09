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
import { EyeOpenIcon } from '@radix-ui/react-icons'
interface DefaultProps {
  className?: string;
}

const Card3 = (
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
        <p className='text-4xl font-semibold text-slate-400'>
          Expert-curated {" "}
          <span className="text-secondary">
            assets with growth potential
          </span>
        </p>
        
      </CardContent>
      <CardFooter className="flex-row justify-between gap-2 text-lg">
        <p className="text-primary bg-secondary text-lg flex text-center truncate bg-black w-fit-content px-4 py-1 rounded-full">
          Transparency
        </p>
        <EyeOpenIcon className="w-12 h-12 text-black" />
      </CardFooter>
    </Card>
  )
}

export default Card3;