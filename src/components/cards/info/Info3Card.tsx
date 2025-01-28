'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EyeOpenIcon } from '@radix-ui/react-icons'
interface DefaultProps {
  className?: string
}

const Card3 = (props: DefaultProps) => {
  return (
    <Card className={`${props.className}`}>
      {/* <CardHeader>
        <CardTitle>
          TOTAL VALUE
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="h-3/4 py-4">
        <p className="text-4xl font-semibold text-slate-400">
          {`Digital Security `} <br />
          <span className="text-secondary">{`Meets Physical Luxury.`}</span>
        </p>
      </CardContent>
      <CardFooter className="flex-row justify-between gap-2 text-lg">
        <p className="w-fit-content flex truncate rounded-full bg-black bg-secondary px-4 py-1 text-center text-lg text-primary">
          Transparency
        </p>
        <EyeOpenIcon className="h-10 w-10 text-black" />
      </CardFooter>
    </Card>
  )
}

export default Card3
