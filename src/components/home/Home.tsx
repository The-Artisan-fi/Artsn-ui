'use client'
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import Wrapper from '@/components/ui/ui-wrapper';
import { Button } from '@/components/ui/button';
import { Card1, Card2, Card3 } from '@/components/cards/info';
import { CtaCard1, CtaCard2, CtaCard3, CtaCard4 } from '@/components/cards/cta';
import { CollectionsCard, ExpertiseCard } from '@/components/cards';
import PerformanceCard from '../cards/PerformanceCard';
import OfferCard from '../cards/OfferCard';
import DesignedCard from '../cards/DesignedCard';
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll';

export default function Home() {
    const [selected, setSelected] = useState(0);
    // const canScrollVertically = useHorizontalScroll();
    const categories = [
        'Watches',
        'Cars',
        'Diamonds',
        'Whisky'
    ]

    // useEffect(() => {
    //     function preventScroll(e : any) {

    //         if (!canScrollVertically) {
    //             window.scrollTo(0, window.scrollY);
    //         }
    //     }

    //     if (!canScrollVertically) {
    //         window.addEventListener('scroll', preventScroll);
    //     }

    //     return () => {
    //         window.removeEventListener('scroll', preventScroll);
    //     };
    // }, [canScrollVertically]);


    return (
        <Suspense fallback={<LoadingSpinner />}>
        <div className='bg-bg w-screen pt-[90px] lg:pt-12 gap-12 lg:gap-0 flex flex-col justify-center' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Wrapper
                id="hero"
                className='bg-bg relative flex flex-col w-full items-center justify-between lg:gap-12'
            >            
                <div 
                    className='absolute hidden lg:flex md:flex bg-top w-full h-full bg-[url(/assets/home/home-backdrop.svg)] bg-no-repeat bg-contain bg-center z-0'
                />
                <p 
                    className={`'font-syne absolute bottom-[20px] md:bottom-[140px] lg:bottom-[190px] text-secondary z-[30] flex text-7xl md:text-[220px]`}
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
                            selected == 0 ? '/products/freak-watch.png' :
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
                    />
                </motion.picture>
                <motion.hgroup className='flex flex-row sm:w-11/12 justify-between items-center mx-auto md:w-1/2 lg:w-1/3 z-20'>
                    {categories.map((category, index) => (
                        <Button
                            key={index}
                            type='button'
                            onClick={() => setSelected(index)}
                            className={
                                selected === index ? "bg-primary text-secondary border-2 border-secondary rounded-full" : "bg-secondary text-primary border-2 border-secondary rounded-full z-20"
                            }
                        >
                            {category}
                        </Button>
                    ))}
                </motion.hgroup>

                
            </Wrapper>
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
            <Wrapper
                id="performance"
                className='bg-bg flex flex-col items-center justify-between'
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}
            >  
                <PerformanceCard />
                <OfferCard />
            </Wrapper>
            
            <div className='flex flex-col gap-4 w-full items-top justify-center align-top md:gap-0 md:flex-row lg:flex-row'>
                <Card2 className='mx-4 h-60 justify-between md:w-1/3 md:self-center pt-6'/>
                <Card3 className='mx-4 h-60 justify-between md:w-1/3 md:self-center pt-6'/>
            </div>
            {/* <Wrapper
                id="design"
                className='bg-bg flex flex-col items-center justify-between'
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}
            > 
                <DesignedCard className='flex flex-col w-full' />
            </Wrapper> */}
            
            {/* <CollectionsCard id="collectionsCard" className='flex flex-col w-full overflow-x-auto' />  */}
            <ExpertiseCard id="expertiseCard" className='flex flex-col w-full overflow-x-auto mt-12'/>

            <CtaCard1 className='mx-6 md:w-8/12 md:self-center md:mb-12'/>
            {/* <CtaCard2 className='mx-6 md:w-8/12 md:self-center md:mb-12'/> */}
            <CtaCard3 className='md:self-center'/>
            {/* <CtaCard4 /> */}
        </div>
        </Suspense>
    )
}