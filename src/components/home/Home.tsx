// /components/home/Home.tsx
'use client'
import { useState, useEffect, Suspense, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import Wrapper from '@/components/ui/ui-wrapper'
import { Button } from '@/components/ui/button'
import { Card1, Card2, Card3 } from '@/components/cards/info'
import { CtaCard1, CtaCard2, CtaCard3, CtaCard4 } from '@/components/cards/cta'
import { CollectionsCard, ExpertiseCard } from '@/components/cards'
import PerformanceCard from '../cards/PerformanceCard'
import OfferCard from '../cards/OfferCard'
import DesignedCard from '../cards/DesignedCard'
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll'
import HeroSection from './HeroSection'
import FAQSection from '../faq/FAQSection'

export default function Home() {
  const [selected, setSelected] = useState(0)
  // const canScrollVertically = useHorizontalScroll();
  const categories = ['Watches', 'Cars', 'Diamonds', 'Whisky']
  const expertiseRef = useRef<HTMLDivElement>(null)

  const scrollToExpertise = () => {
    expertiseRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    if (window.location.hash === '#howitworks') {
      const element = document.getElementById('howitworks')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  // create a useEffect that `setSelected` from 0-3 every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div
        className="flex w-screen flex-col justify-center gap-12 bg-bg pt-[90px] lg:gap-0 lg:pt-12"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* <Wrapper
                    id="hero"
                    className='bg-bg relative flex flex-col w-full items-center justify-between lg:gap-12'
                >             */}
        {/* <div 
                        className='absolute hidden lg:flex md:flex bg-top w-full h-full bg-[url(/assets/home/home-backdrop.svg)] bg-no-repeat bg-contain bg-center z-0'
                    />
                    <p 
                        className={`'font-syne absolute bottom-[20px] md:bottom-[140px] lg:bottom-[120px] text-secondary z-[30] flex text-7xl md:text-[220px]`}
                        style={{ 
                            fontFamily: 'Syne',
                            // fontSize: '220px',
                            // fontSize: `${selected == 1 || selected == 3 ? '220px' : '220px'}`,
                            fontWeight: '700',
                            lineHeight: '477.4px',
                            letterSpacing: `${selected == 1 || selected == 3 ? '.05em' : '0em'}`,
                        }}
                    >
                        {
                            selected == 0 ? 'Watches' :
                            selected == 1 ? 'Cars' :
                            selected == 2 ? 'Diamonds' :
                            selected == 3 ? 'Whisky' : 'Watches'
                        }
                    </p>
                    <motion.h1>
                        <p className="flex flex-col font-semibold font-urbanist text-secondary pt-10 md:pt-0 text-5xl md:text-4xl md:text-6xl text-center z-20 ">
                            You collect, <br />
                            we manage.
                        </p>
                    </motion.h1>
                    <motion.h4>
                        <p className="flex flex-col text-secondary mt-12 md:mt-0 text-2xl text-center z-20">
                            Collect & Trade luxury goods on-chain
                        </p>
                    </motion.h4>
                    <motion.picture className='flex flex-row justify-center h-full' style={{ zIndex: '20'}}>
                        <Image 
                            src={
                                selected == 0 ? '/products/rolex-bg.svg' :
                                selected == 1 ? '/products/car7.svg' :
                                selected == 2 ? '/products/diamonds2.svg' :
                                selected == 3 ? '/products/whisky2.svg' : '/products/freak.svg'
                            }
                            width={100}
                            height={100}
                            // className='w-[293px] h-[293px]'
                            className={
                                // `${selected == 0 || selected == 2 ? 'w-[393px] h-[293px]' : 'w-[393px] h-[393px]'}`
                                `w-[393px] h-[393px] relative ${selected == 0 ?  'md:bottom-10' : 'md:bottom-20'} ${selected == 1 && 'w-[700px]'}`
                            }
                            style={{ opacity: '.8' }}
                            alt='freak watch'
                            priority
                        />
                    </motion.picture> */}

        <HeroSection />
        {/* </Wrapper> */}
        {/* <div className='flex flex-col w-full relative items-center z-20' style={{ gap: '12px'}}>
                    <p className='text-slate-400'>
                        Trusted by
                    </p>
                    <Image
                        src='/assets/home/partners-row.svg'
                        width={10}
                        height={10}
                        className='w-full'
                        alt='partners'
                    />
                </div> */}
        {/* <MarketplaceSnippet /> */}
        <div
          id="performance"
          className="mt-20 flex flex-col items-center justify-between bg-bg"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <PerformanceCard />
          <ExpertiseCard
            ref={expertiseRef}
            id="howitworks"
            className="mt-12 flex w-11/12 flex-col overflow-x-auto"
          />
        </div>

        {/* <div className='flex flex-col gap-4 w-full items-top justify-center align-top md:gap-0 md:flex-row lg:flex-row'>
                    <Card2 className='mx-4 h-60 justify-between md:w-1/3 md:self-center pt-6'/>
                    <Card3 className='mx-4 h-60 justify-between md:w-1/3 md:self-center pt-6'/>
                </div> */}
        {/* <Wrapper
                    id="design"
                    className='bg-bg flex flex-col items-center justify-between'
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}
                > 
                    <DesignedCard className='flex flex-col w-full' />
                </Wrapper> */}

        {/* <CollectionsCard id="collectionsCard" className='flex flex-col w-full overflow-x-auto' />  */}

        {/* <CtaCard1 className='mx-6 md:w-8/12 md:self-center md:mb-12'/> */}
        {/* <CtaCard2 className='mx-6 md:w-8/12 md:self-center md:mb-12'/> */}
        <div className="flex w-full flex-col items-center justify-center gap-12">
          <OfferCard />
          <FAQSection />
        </div>
        <CtaCard3 className="md:self-center" />
        {/* <CtaCard4 /> */}
      </div>
    </Suspense>
  )
}
