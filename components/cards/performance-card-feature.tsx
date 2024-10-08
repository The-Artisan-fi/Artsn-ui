'use client';
import styles from '@/styles/cards/ExpertiseCard.module.css'
import { Button }from '@/components/ui/shadcn/button-ui'
import Image from 'next/image';
import { ChevronRightIcon, TriangleUpIcon } from "@radix-ui/react-icons"
import { Card, CardContent, CardFooter } from "@/components/ui/shadcn/card-ui"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/shadcn/carousel-ui"
// import { motion, MotionProps } from 'framer-motion';
import TransparentCard from '../ui/cards/TransparentCard';
import { Badge } from '../ui/shadcn/badge-ui';
import { Card1, Card2 } from './info';
import { ChartC } from '../charts';

interface DefaultProps {
  className?: string;
}


const PerformanceCard = () => {

  return (
    <TransparentCard className='text-secondary text-2xl w-full items-center justify-center flex flex-col text-center gap-4'>
        <Badge>
            <span className='text-secondary'>The Artisan</span>
        </Badge>
        <TransparentCard className="mx-2 flex flex-col w-7/12 items-center justify-center self-center text-secondary text-2xl"> 
            <p className='text-2xl text-center my-2 md:text-4xl md:my-4'>
                <span className='text-slate-400 font-bold'>
                    In the past decade
                </span> 
                , certain Luxury Assets outperformed the S&P 500 .
            </p>
        </TransparentCard>
        {/* <div className='text-secondary text-2xl w-full md:w-3/4 lg:w-3/4'>
            <span className='font-bold'>In the past decade</span>, certain Luxury Assets outperformed the S&P 500 .
        </div> */}
        <div className='flex flex-col w-full gap-12 md:gap-0 md:w-8/12 self-center items-center md:flex-row'>
            
            <Card1 className='sm:w-11/12 md:w-1/2 h-96 mx-auto self-center justify-between flex flex-col'/> 

            <TopPerformerCard className='w-11/12 md:w-1/4 h-96 self-center min-h-max justify-between items-center flex flex-col mx-2'/>
            <TopPerformer2Card className='w-11/12 md:w-1/4 h-96 self-center min-h-max justify-between items-center flex flex-col mx-2'/>
        </div>
        <ChartC className='w-11/12 md:w-8/12 self-center h-96 overflow-hidden'/>
    </TransparentCard>  
  );

};

export default PerformanceCard;

const TopPerformerCard = (
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
        <CardContent className='py-4 flex flex-col items-center min-h-3/4 justify-center gap-4'>
            <Image
                src={'/products/freak-watch.png'}
                width={200}
                height={200}
                alt='top performer icon'
            />
        </CardContent>
        <CardFooter className='flex flex-col items-center justify-center'>
            <p className='text-2xl font-semibold text-secondary'>
                Ulysse Nardin
            </p>
            <p className='text-4xl text-secondary'>
                $32,032
            </p>
            <Badge className='text-secondary bg-green-500 border-green-400 rounded-full'>
                <TriangleUpIcon className='text-white'/>
                <span className='text-white'>+56%</span>
            </Badge>
        </CardFooter>
      </Card>
    )
  }


const TopPerformer2Card = (
    props: DefaultProps
) => {
    return (    
        <Card className={`${props.className}`}>
            <CardContent className='py-4 flex flex-col justify-center items-center gap-4'>
                <Image
                    src={'/products/car.svg'}
                    width={400}
                    height={400}
                    alt='top performer icon'
                    className='pt-12'
                />
            </CardContent>
            <CardFooter className='flex flex-col items-center justify-center'>
                <p className='text-2xl font-semibold text-secondary'>
                    Super Car
                </p>
                <p className='text-4xl text-secondary'>
                    $32,032
                </p>
                <Badge className='text-secondary bg-green-500 border-green-400 rounded-full'>
                    <TriangleUpIcon className='text-white'/>
                    <span className='text-white'>+56%</span>
                </Badge>
            </CardFooter>
        </Card>
    )
}


const PastPerformanceChartCard = (
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
        <CardContent className='py-4 flex flex-col justify-center items-center gap-4'>
            <Image
                src={'/products/car.svg'}
                width={400}
                height={400}
                alt='top performer icon'
                className='pt-12'
            />
        </CardContent>
        <CardFooter className='flex flex-col items-center justify-center'>
            <p className='text-2xl font-semibold text-secondary'>
                Super Car
            </p>
            <p className='text-4xl text-secondary'>
                $32,032
            </p>
            <Badge className='text-secondary bg-green-500 border-green-400 rounded-full'>
                <TriangleUpIcon className='text-white'/>
                <span className='text-white'>+56%</span>
            </Badge>
        </CardFooter>
        </Card>
    )
}