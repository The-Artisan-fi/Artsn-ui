'use client'
import { useState, useEffect } from 'react';
import styles from '@/styles/components/Home.module.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Wrapper from '@/components/ui/ui-wrapper';
import { Button } from '@/components/ui/button';

export default function HomeFeature() {
    const [selected, setSelected] = useState(0);
    const categories = [
        'Watches',
        'Cars',
        'Diamonds',
        'Whisky'
    ]

    // Function to handle manual category selection
    const handleCategorySelect = (index: number) => {
        setSelected(index);
    };

    // Reset interval when selected changes or on initial render
    useEffect(() => {
        const interval = setInterval(() => {
            setSelected((prev) => (prev + 1) % categories.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [selected, categories.length]);

    return (
        <div className='bg-bg w-screen lg:pt-2 gap-12 lg:gap-24 flex flex-col justify-center' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Wrapper id="hero" className='bg-bg relative flex flex-col w-full items-center justify-between lg:gap-12'>           
            <Image 
                src="/assets/home/home-backdrop.svg"
                alt="Background decoration"
                fill
                priority
                className='absolute hidden lg:flex md:flex object-contain z-0'
                sizes="(max-width: 768px) 0vw, 100vw"
            />
                    <p 
                        className={`'font-syne absolute bottom-[20px] md:bottom-[70px] lg:bottom-[190px] text-secondary z-[30] flex ${selected === 2 ? 'text-[55px] sm:text-[100px] md:text-[120px] lg:text-[170px] xl:text-[220px]' : 'text-7xl sm:text-[120px] lg:text-[170px] xl:text-[220px]'}`}
                        style={{ 
                            fontFamily: 'Syne',
                            fontWeight: '700',
                            lineHeight: '477.4px',
                            letterSpacing: `${selected == 1 || selected == 3 ? '.05em' : '0em'}`
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
                        <p className="flex flex-col font-semibold font-urbanist md:pb-4 lg:pb-0 text-secondary pt-10 md:pt-0 text-5xl md:text-6xl text-center z-20 ">
                            You collect, <br />
                            we manage.
                        </p>
                    </motion.h1>
                    <motion.h4>
                        <p className="flex flex-col text-secondary mt-12 md:mt-0 md:pb-12 lg:pb-0 text-2xl text-center z-20">
                            Collect & Trade luxury goods on-chain
                        </p>
                    </motion.h4>
                    <motion.picture className='flex flex-row justify-center h-full' style={{ zIndex: '20'}}>
                        {selected == 0 ? (
                            <Image 
                                src='/products/rolex-bg.svg'
                                width={700}
                                height={700}
                                quality={100}
                                className='w-[393px] h-[393px] relative md:bottom-10'
                                style={{ opacity: '.8' }}
                                alt='Luxury watch'
                                priority
                                sizes="(max-width: 640px) 393px, (max-width: 768px) 393px, 700px"
                            />
                        ) : selected == 1 ? (
                            <div className="sm:w-[550px] md:w-[600px] lg:w-[700px] h-[393px] relative md:bottom-20 flex items-center justify-center">
                                <Image 
                                    src='/products/car7.png'
                                    width={700}
                                    height={700}
                                    quality={100}
                                    style={{ opacity: '.8' }}
                                    alt='Luxury car'
                                    priority
                                    sizes="(max-width: 640px) 393px, (max-width: 768px) 393px, 700px"
                                />
                            </div>
                        ) : selected == 2 ? (
                            <div className="sm:w-[400px] md:w-[500px] lg:w-[500px] h-[393px] relative md:bottom-20 flex items-center justify-center">
                                <Image 
                                    src='/products/diamonds2.png'
                                    width={650}
                                    height={650}
                                    quality={100}
                                    style={{ opacity: '.8' }}
                                    alt='Diamonds'
                                    priority
                                    sizes="(max-width: 640px) 393px, (max-width: 768px) 393px, 700px"
                                />
                            </div>
                        ) : (
                            <div className="sm:w-[400px] md:w-[400px] lg:w-[450px] h-[393px] relative md:bottom-20 flex items-center justify-center">
                                <Image 
                                    src='/products/whisky2.png'
                                    width={650}
                                    height={650}
                                    quality={100}
                                    style={{ opacity: '.8' }}
                                    alt='Whisky bottle'
                                    priority
                                    sizes="(max-width: 640px) 393px, (max-width: 768px) 393px, 700px"
                                />
                            </div>
                        )}
                    </motion.picture>
                    <motion.hgroup className='flex flex-row justify-between items-center mx-auto sm:w-1/2 lg:w-2/5 2xl:w-1/3 z-20'>
                    {categories.map((category, index) => (
                        <Button
                            key={index}
                            type='button'
                            onClick={() => handleCategorySelect(index)}
                            className={
                                selected === index ? "bg-primary text-secondary border-2 border-secondary rounded-full" : "bg-secondary text-primary border-2 border-secondary rounded-full z-20 hover:text-black"
                            }
                        >
                            {category}
                        </Button>
                    ))}
                </motion.hgroup>
            </Wrapper>
        </div>
    )
}