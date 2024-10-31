'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/cards/ExpertiseCard.module.css'
import { Button }from '@/components/ui/shadcn/button-ui'
import Image from 'next/image';
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Card, CardContent } from "@/components/ui/shadcn/card-ui"
import { Swiper as SwiperType } from "swiper"; // Import the Swiper type
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/shadcn/carousel-ui"
import { Badge } from "@/components/ui/shadcn/badge-ui"
import TagMonaco from '../three/tag-monaco';
// import { motion, MotionProps } from 'framer-motion';
interface DefaultProps {
  id?: string;
  className?: string;
}

const cards = [
  // {
  //   primaryText: 'You invest into',
  //   secondaryText: 'the asset of your choice',
  //   image: '/products/watch.svg'
  // },
  {
    primaryText: 'Industry experts',
    secondaryText: 'select the right asset',
    image: '/assets/home/checkmark.svg'
  },
  {
    primaryText: 'We tokeneize the asset',
    secondaryText: 'generating fractions',
    image: '/assets/home/fractions.svg'
  },
  {
    primaryText: 'We securely buy and store',
    secondaryText: 'the asset',
    image: '/assets/home/safe.svg'
  }
]

const ExpertiseCard = (
  props: DefaultProps
) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [progressAmount, setProgressAmount] = useState(0);

  return (
    <div className={`${props.className}`}>
      <Badge className="w-fit self-center border-zinc-200">
        <span className='text-secondary'>How it Works</span>
      </Badge>
      <div className="swiper-container hidden md:block relative mb-5">
        <Swiper
          onSwiper={setThumbsSwiper} // Store the instance of the thumbs swiper in the state
          spaceBetween={15}
          slidesPerView={4} // Show 3 thumbnails at a time
          watchSlidesProgress // Keep track of which thumbnail is active
          className="thumbs-swiper"
        >
          <SwiperSlide className="border-gray rounded-2xl p-2 w-1/4"></SwiperSlide>
          <SwiperSlide className="border-gray rounded-2xl p-2 ">
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                  {/* <div className={styles.header}>
                    <p className="text-secondary text-xl mb-4 font-bold">
                      {1}
                    </p>
                  </div> */}
                  <div className='flex h-80'>
                    <TagMonaco />
                  </div>
                  <div className={styles.footer}>
                    <p className="text-secondary text-xl font-bold">
                      {cards[0].primaryText}
                    </p>
                    <p className="text-slate-500 text-xl">
                      {cards[0].secondaryText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          {cards.map((card, index) => (
            <SwiperSlide key={index} className="border-gray rounded-2xl p-2 ">
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                  {/* <div className={styles.header}>
                    <p className="text-secondary text-xl mb-4 font-bold">
                      {index + 1}
                    </p>
                  </div> */}
                  <div className='flex h-80'>
                    <Image
                      src={card.image}
                      width={249}
                      height={252}
                      alt={card.primaryText}
                      className='h-full'
                    />
                  </div>
                  <div className={styles.footer}>
                    <p className="text-secondary text-xl font-bold">
                      {card.primaryText}
                    </p>
                    <p className="text-slate-500 text-xl">
                      {card.secondaryText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-container md:hidden relative mb-5">
        <Swiper
          onSwiper={setThumbsSwiper} // Store the instance of the thumbs swiper in the state
          spaceBetween={15}
          slidesPerView={1} // Show 3 thumbnails at a time
          watchSlidesProgress // Keep track of which thumbnail is active
          className="thumbs-swiper"
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index} className="border-gray rounded-2xl p-2 font-bold">
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                  <div className={styles.header}>
                    <p className="text-secondary text-xl mb-4">
                      {index + 1}
                    </p>
                  </div>
                  <div className={styles.body}>
                    <Image
                      src={card.image}
                      width={249}
                      height={252}
                      alt={card.primaryText} 
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.footer}>
                    <p className="text-secondary text-xl">
                      {card.primaryText}
                    </p>
                    <p className="text-secondary text-xl">
                      {card.secondaryText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>    
    </div>
  );
};

export default ExpertiseCard;
