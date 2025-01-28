'use client'
import { useState, useEffect, forwardRef } from 'react'
import styles from '@/styles/cards/ExpertiseCard.module.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Swiper as SwiperType } from 'swiper' // Import the Swiper type
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import TagMonaco from '../three/TagMonaco'
// import { motion, MotionProps } from 'framer-motion';
interface DefaultProps {
  id?: string
  className?: string
  ref?: any
}

const cards = [
  // {
  //   primaryText: 'You invest into',
  //   secondaryText: 'the asset of your choice',
  //   image: '/products/watch.svg'
  // },
  {
    primaryText: 'Authentication & Verification',
    secondaryText: 'certified by experts',
    image: '/assets/home/checkmark.svg',
  },
  {
    primaryText: 'Digital Transformation',
    secondaryText: 'divided into tradeable shares',
    image: '/assets/home/fractions.svg',
  },
  {
    primaryText: 'Secure Storage',
    secondaryText: 'insured & stored in our vaults',
    image: '/assets/home/safe.svg',
  },
]

const ExpertiseCard = forwardRef((props: DefaultProps, ref: any) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [progressAmount, setProgressAmount] = useState(0)

  return (
    <div ref={ref} className={`${props.className}`}>
      <Badge className="w-fit self-center border-zinc-200">
        <span className="text-2xl text-secondary">How it Works</span>
      </Badge>
      <div className="swiper-container relative mb-5 hidden md:block">
        <Swiper
          onSwiper={setThumbsSwiper} // Store the instance of the thumbs swiper in the state
          spaceBetween={15}
          slidesPerView={4} // Show 3 thumbnails at a time
          watchSlidesProgress // Keep track of which thumbnail is active
          className="thumbs-swiper"
        >
          {/* <SwiperSlide className="border-gray rounded-2xl p-2 w-1/4"></SwiperSlide> */}
          <SwiperSlide className="border-gray rounded-2xl p-2">
            <Card className="h-[500px]">
              <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                {/* <div className={styles.header}>
                  <p className="text-secondary text-xl mb-4 font-bold">
                    {1}
                  </p>
                </div> */}
                <div className="mb-6 flex h-80">
                  <TagMonaco />
                </div>
                <div className={styles.footer}>
                  <p className="text-xl font-bold text-secondary">
                    {'Expert Selection'}
                  </p>
                  <p className="text-xl text-slate-500">
                    {'curated rare assets'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
          {cards.map((card, index) => (
            <SwiperSlide key={index} className="border-gray rounded-2xl p-2">
              <Card className="h-[500px]">
                <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                  {/* <div className={styles.header}>
                    <p className="text-secondary text-xl mb-4 font-bold">
                      {index + 1}
                    </p>
                  </div> */}
                  <div className="mb-6 flex h-80">
                    <Image
                      src={card.image}
                      width={249}
                      height={252}
                      alt={card.primaryText}
                      className="h-full"
                    />
                  </div>
                  <div className={styles.footer}>
                    <p className="text-xl font-bold text-secondary">
                      {card.primaryText}
                    </p>
                    <p className="text-xl text-slate-500">
                      {card.secondaryText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-container relative mb-5 md:hidden">
        <Swiper
          onSwiper={setThumbsSwiper} // Store the instance of the thumbs swiper in the state
          spaceBetween={15}
          slidesPerView={1} // Show 3 thumbnails at a time
          watchSlidesProgress // Keep track of which thumbnail is active
          className="thumbs-swiper"
        >
          <SwiperSlide className="border-gray rounded-2xl p-2">
            <Card>
              <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                {/* <div className={styles.header}>
                  <p className="text-secondary text-xl mb-4 font-bold">
                    {1}
                  </p>
                </div> */}
                <div className="flex h-80">
                  <TagMonaco />
                </div>
                <div className="flex flex-col">
                  <p className="text-center text-xl font-bold text-secondary">
                    {'Expert Selection'}
                  </p>
                  <p className="text-center text-xl font-bold text-slate-500">
                    {'curated rare assets'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
          {cards.map((card, index) => (
            <SwiperSlide
              key={index}
              className="border-gray rounded-2xl p-2 font-bold"
            >
              <Card>
                <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                  {/* <div className={styles.header}>
                    <p className="text-secondary text-xl mb-4">
                      {index + 1}
                    </p>
                  </div> */}
                  <div className="flex h-80">
                    <Image
                      src={card.image}
                      width={249}
                      height={252}
                      alt={card.primaryText}
                      className="h-full"
                    />
                  </div>
                  <div className={styles.footer}>
                    <p className="text-center text-xl font-bold text-secondary">
                      {card.primaryText}
                    </p>
                    <p className="text-center text-xl font-bold text-slate-500">
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
  )
})

export default ExpertiseCard
ExpertiseCard.displayName = 'ExpertiseCard'
