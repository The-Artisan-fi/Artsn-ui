'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
      <CardContent className='py-4 h-3/4'>
        <p className='text-4xl font-semibold text-slate-400'>
          {`Digital Security `} <br />
          <span className="text-secondary">
            {`Meets Physical Luxury.`}
          </span>
        </p>
        
      </CardContent>
      <CardFooter className="flex-row justify-between gap-2 text-lg">
        <p className="text-primary bg-secondary text-lg flex text-center truncate bg-black w-fit-content px-4 py-1 rounded-full">
          Transparency
        </p>
        <EyeOpenIcon className="w-10 h-10 text-black" />
      </CardFooter>
    </Card>
  )
}

export default Card3;