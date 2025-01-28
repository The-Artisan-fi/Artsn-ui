'use client'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface DefaultProps {
  className?: string
}

const Card2 = (props: DefaultProps) => {
  return (
    <Card className={`${props.className}`}>
      {/* <CardHeader>
        <CardTitle>
          TOTAL VALUE
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="h-3/4 py-4 pb-12">
        <p className="text-4xl font-semibold text-secondary">
          Blockchain Secured. <br />
          <span className="text-slate-400">Value Assured.</span>
        </p>
      </CardContent>
      <CardFooter className="flex-row justify-between gap-2 text-lg">
        <p className="w-fit-content flex truncate rounded-full bg-black bg-secondary px-4 py-1 text-center text-lg text-primary">
          Certified
        </p>
        <Image
          src={'/icons/check-icon.svg'}
          width={40}
          height={40}
          alt="check icon"
        />
      </CardFooter>
    </Card>
  )
}

export default Card2
