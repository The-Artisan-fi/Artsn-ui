'use client'
import styles from '@/styles/cards/ExpertiseCard.module.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ChevronRightIcon, TriangleUpIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/shadcn/carousel-ui"
// import { motion, MotionProps } from 'framer-motion';
import TransparentCard from './TransparentCard'
import { Badge } from '@/components/ui/badge'
import { Card1, Card2 } from './info'
import { ChartC } from '../charts'

interface DefaultProps {
  className?: string
}

const PerformanceCard = () => {
  return (
    <TransparentCard className="flex w-full flex-col items-center justify-center gap-4 text-center text-2xl text-secondary">
      {/* <Badge>
            <span className='text-secondary text-2xl'>The Artisan</span>
        </Badge> */}
      <TransparentCard className="mx-2 flex w-7/12 flex-col items-center justify-center self-center text-2xl text-secondary">
        <p className="my-2 text-center text-2xl md:my-4 md:text-4xl">
          <span className="font-bold text-slate-400">Over the past decade</span>{' '}
          <br />
          Luxury Assets outperformed the S&P 500 .
        </p>
      </TransparentCard>

      {/* <div className='flex flex-col w-full gap-12 md:gap-0 md:w-8/12 self-center items-center md:flex-row'>
            
            <Card1 className='sm:w-11/12 md:w-1/2 h-96 mx-auto self-center justify-between flex flex-col'/> 

            <TopPerformerCard className='w-11/12 md:w-1/4 h-96 self-center min-h-max justify-center items-center flex flex-col mx-2'/>
            <TopPerformer2Card className='w-11/12 md:w-1/4 h-96 self-center min-h-max justify-center items-center flex flex-col mx-2'/>
        </div> */}

      <ChartC className="h-120 w-11/12 self-center overflow-hidden md:w-8/12" />
    </TransparentCard>
  )
}

export default PerformanceCard

const TopPerformerCard = (props: DefaultProps) => {
  return (
    <Card className={`${props.className}`}>
      {/* <CardHeader>
          <CardTitle>
            TOTAL VALUE
          </CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader> */}
      <CardContent className="flex h-3/4 flex-col items-center justify-center gap-4 py-4">
        <Image
          src={'/products/patek-cubitus.jpg'}
          width={200}
          height={200}
          alt="top performer icon"
          className="h-full w-full object-contain"
        />
      </CardContent>
      <CardFooter className="flex h-1/4 flex-col items-center justify-center">
        <p className="text-xl font-semibold text-secondary">Patek Philippe</p>
        <p className="text-4xl text-secondary">$212,000</p>
        <Badge className="rounded-full border-green-400 bg-green-500 text-secondary">
          <TriangleUpIcon className="text-white" />
          <span className="text-white">+207%</span>
        </Badge>
      </CardFooter>
    </Card>
  )
}

const TopPerformer2Card = (props: DefaultProps) => {
  return (
    <Card className={`${props.className}`}>
      <CardContent className="flex h-3/4 flex-col items-center justify-center py-4">
        <Image
          src={'/products/ferarri.svg'}
          width={100}
          height={100}
          className="h-full w-full object-contain"
          alt="top performer icon"
        />
      </CardContent>
      <CardFooter className="flex h-1/4 flex-col items-center justify-center">
        <p className="text-xl font-semibold text-secondary">Ferrari 250 GTO</p>
        <p className="text-4xl text-secondary">£52m</p>
        <Badge className="rounded-full border-green-400 bg-green-500 text-secondary">
          <TriangleUpIcon className="text-white" />
          <span className="text-white">+25%</span>
        </Badge>
      </CardFooter>
    </Card>
  )
}

const PastPerformanceChartCard = (props: DefaultProps) => {
  return (
    <Card className={`${props.className}`}>
      {/* <CardHeader>
            <CardTitle>
            TOTAL VALUE
            </CardTitle>
            <CardDescription>January - June 2024</CardDescription>
        </CardHeader> */}
      <CardContent className="flex flex-col items-center justify-center gap-4 py-4">
        <Image
          src={'/products/car.svg'}
          width={400}
          height={400}
          alt="top performer icon"
          className="pt-12"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold text-secondary">Super Car</p>
        <p className="text-4xl text-secondary">$32,032</p>
        <Badge className="rounded-full border-green-400 bg-green-500 text-secondary">
          <TriangleUpIcon className="text-white" />
          <span className="text-white">+56%</span>
        </Badge>
      </CardFooter>
    </Card>
  )
}
