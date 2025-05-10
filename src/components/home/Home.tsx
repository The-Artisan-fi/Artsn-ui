// /components/home/Home.tsx
'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { CtaCard3 } from '@/components/cards/cta'
import { ExpertiseCard } from '@/components/cards'
import PerformanceCard from '../cards/PerformanceCard'
import OfferCard from '../cards/OfferCard'
import HomeFeature from './HomeFeature'
import FAQSection from '../faq/FAQSection'
import Link from 'next/link'


export default function Home() {
  const expertiseRef = useRef<HTMLDivElement>(null)
  
  // Add image preloading for critical images
  useEffect(() => {
    // Preload critical hero images
    const images = [
      '/products/rolex-bg.svg',
      '/products/car7.png',
      '/products/diamonds2.png',
      '/products/whisky2.png',
      '/assets/home/home-backdrop.svg'
    ];
    
    images.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);


  return (
      <div
        className="flex w-screen flex-col justify-center md:gap-12 bg-bg pt-[90px] lg:gap-0 lg:pt-12"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >

        <HomeFeature />
        
        <div
          id="performance"
          className="mt-16 flex flex-col items-center justify-between bg-bg"
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
        <div className="flex items-center gap-1 w-full justify-center mb-5">
          <Link href="/docs/Attestation-daffiliation-SO-FIT-OAR.pdf" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center gap-3 sm:flex-row sm:text-left">
            <Image 
              src="/assets/home/switzerland.svg"
              alt="Swiss Cross"
              width={27}
              height={27}
              className="w-[35px] h-[35px] sm:w-[55px] sm:h-[55px]"
              priority
            />
            <span className="text-sm md:text-lg font-medium">
              Regulated Financial intermediary Switzerland
            </span>
          </Link>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <OfferCard />
          <div className='flex flex-col w-full relative items-center z-20 mt-4'>
                    <p className='text-slate-400 pb-4'>
                        Trusted by
                    </p>
                    <Image
                        src='/assets/home/partners-row.svg'
                        width={10}
                        height={10}
                        className='w-full'
                        alt='partners'
                        priority
                    />
                </div>
          <FAQSection />
        </div>
        <CtaCard3 className="md:self-center" />
      </div>
  )
}
