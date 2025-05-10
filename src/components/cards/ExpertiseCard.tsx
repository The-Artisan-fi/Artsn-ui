'use client'
import { useState, useEffect, forwardRef, Suspense, lazy } from 'react'
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
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

// Lazy load the TagMonaco component
//const TagMonaco = lazy(() => import('../three/TagMonaco'))

interface DefaultProps {
  id?: string
  className?: string
  ref?: any
}

const cards = [
  {
    primaryText: 'Expert Selection',
    secondaryText: 'curated rare assets',
    image: '/products/freak-watch.png'
  },
  {
    primaryText: 'Authentication & Verification',
    secondaryText: 'certified by experts',
    image: '/assets/home/checkmark.png',
  },
  {
    primaryText: 'Digital Transformation',
    secondaryText: 'divided into tradeable shares',
    image: '/assets/home/fractions.png',
  },
  {
    primaryText: 'Secure Storage',
    secondaryText: 'insured & stored in our vaults',
    image: '/assets/home/safe.png',
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
      <div className="swiper-container relative min-[420px]:mb-5 hidden md:block">
        <Swiper
          onSwiper={setThumbsSwiper} // Store the instance of the thumbs swiper in the state
          spaceBetween={15}
          slidesPerView={4} // Show 3 thumbnails at a time
          watchSlidesProgress // Keep track of which thumbnail is active
          className="thumbs-swiper"
        >
          {/* <SwiperSlide className="border-gray rounded-2xl p-2 w-1/4"></SwiperSlide> */}
         {/*  <SwiperSlide className="border-gray rounded-2xl pt-2">
            <Card className="h-[520px]">
              <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                {/* <div className={styles.header}>
                  <p className="text-secondary text-xl mb-4 font-bold">
                    {1}
                  </p>
                </div> 
                <div className="mb-6 flex h-80">
                  <Suspense fallback={
                    <div className="flex h-full w-full items-center justify-center">
                      <Loader2 className="h-12 w-12 animate-spin text-secondary" />
                    </div>
                  }>
                    <TagMonaco />
                  </Suspense>
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
          </SwiperSlide>*/}
          {cards.map((card, index) => (
            <SwiperSlide key={index} className="border-gray rounded-2xl pt-2">
              <Card className="h-[520px]">
                <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                  <div className="mb-6 flex h-80">
                    <div className="flex h-full w-full items-center justify-center">
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: index === 0 ? 1.2 : 1.15 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 15,
                          restDelta: 0.0000001,
                        }}
                      >
                        <Image
                          src={card.image}
                          width={249}
                          height={252}
                          alt={card.primaryText}
                          className="h-auto"
                          sizes="(max-width: 768px) 100vw, 249px"
                          quality={100}
                        />
                      </motion.div>
                    </div>
                  </div>
                  <div className={`${styles.footer} text-center`}>
                    <p className="text-center text-xl font-bold text-secondary">
                      {card.primaryText}
                    </p>
                    <p className="text-center text-xl text-slate-500">
                      {card.secondaryText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-container relative min-[420px]:mb-5 md:hidden">
        <Swiper
          onSwiper={setThumbsSwiper} // Store the instance of the thumbs swiper in the state
          spaceBetween={15}
          slidesPerView={1} // Show 3 thumbnails at a time
          watchSlidesProgress // Keep track of which thumbnail is active
          className="thumbs-swiper"
        >
          {cards.map((card, index) => (
            <SwiperSlide
              key={index}
              className="border-gray rounded-2xl p-2 font-bold"
            >
              <Card>
                <CardContent className="flex aspect-square flex-col items-center justify-center p-6 gap-7 sm:gap-13 md:gap-7">
                  <div className="flex h-80">
                    <div className="flex h-full w-full items-center justify-center">
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.3 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 15,
                          restDelta: 0.0000001,
                        }}
                      >
                        <Image
                          src={card.image}
                          width={324}
                          height={328}
                          alt={card.primaryText}
                          className="h-auto"
                          sizes="(max-width: 768px) 100vw, 324px"
                          quality={100}
                        />
                      </motion.div>
                    </div>
                  </div>
                  <div className={`${styles.footer} text-center`}>
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
