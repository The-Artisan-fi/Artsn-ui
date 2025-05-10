'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface DefaultProps {
  className?: string
}

const Card1 = (props: DefaultProps) => {
  return (
    <Card className={`${props.className}`}>
      <CardHeader>
        <CardTitle className="mb-4 text-secondary">Past Performance</CardTitle>
        <CardDescription>{`Source: Knight Frank Luxury Investment Index, HAGI Index`}</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between text-secondary">
        <div className="flex w-full flex-row items-center justify-between">
          <p>S&P 500</p>
          <p>+8% per year</p>
        </div>
        <Separator />
        <div className="flex w-full flex-row items-center justify-between">
          <p>Watches</p>
          <p>+20% per year</p>
        </div>
        <Separator />
        <div className="flex w-full flex-row items-center justify-between">
          <p>Cars</p>
          <p>+25% per year*</p>
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {`Time period: 2020-2023 | *Car's can experience higher volatility`}
      </CardFooter>
    </Card>
  )
}

export default Card1
