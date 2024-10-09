'use client'
import styles from '@/styles/components/Footer.module.css'
import { Suspense } from 'react';
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card-ui"
import toast from 'react-hot-toast';
export default function FooterFeature() {
    const handleCopy = (e: string) => {
        console.log(e);
        navigator.clipboard.writeText(e);
        toast.success('Email Copied to Clipboard');
    };
    return (
        <Suspense fallback={<div />}>
            <Card
                className='w-full self-center overflow-hidden rounded-none flex flex-row justify-center md:justify-between md:py-14 items-start w-full bg-transparent md:px-12'
            >
                <CardContent className='flex flex-col py-4 gap-4 items-center w-1/2'>
                    <div className='flex flex-row md:gap-6'>
                        <Image
                            src='/logos/artisan-small-logo-black.svg'
                            alt="Logo"
                            width={25}
                            height={25}
                            className="dark:hidden cursor-pointer"
                            onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                        <Image
                            src='/logos/artisan-small-logo-white.svg'
                            alt="Logo"
                            width={32}
                            height={32}
                            className="hidden dark:flex cursor-pointer"
                            onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                        <h1 className='text-xl md:text-3xl text-secondary mt-2 md:mt-0'>The Artisan</h1>
                    </div>
                    {/* <span className={styles.subText}>
                        Baseline
                    </span> */}
                    <div className='flex flex-row gap-14 items-center justify-center align-center'>
                        <Image
                            src='/assets/footer/solana-icon.webp'
                            alt="Logo"
                            width={60}
                            height={60}
                            className="cursor-pointer"
                            onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                        <Image
                            src='/assets/footer/swiss-icon.webp'
                            alt="Logo"
                            width={60}
                            height={60}
                            className="cursor-pointer"
                            onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-row items-center w-1/2 md:w-3/4 md:gap-16 justify-evenly items-start">
                    <div className='flex flex-col justify-start mt-4'>
                        <h2 className='font-bold text-secondary'>Site</h2>
                        <ul className={styles.linkList}>
                            <li>
                                <a href='/collect' target='_blank' className='link text-secondary'>Start Collecting</a>
                            </li>
                            <li>
                                <a href='/about' target='_blank' className='link text-secondary'>About Us</a>
                            </li>
                            <li>
                                <a href='tos' target='_blank' className='link text-secondary'>Terms and Conditions</a>
                            </li>
                            <li>
                                <a href='privacy' target='_blank' className='link text-secondary'>Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.linkContainerCol}>
                        <h2 className='font-bold text-secondary'>Socials</h2>
                        <ul className={styles.linkList}>
                            <li>
                                <a href='https://www.linkedin.com/company/the-artisan-nft/?viewAsMember=true' className='link text-secondary' target='_blank'>LinkedIn</a>
                            </li>
                            <li>
                                <a href='https://twitter.com/ArtsnFi' className='link text-secondary' target='_blank'>Twitter/X</a>
                            </li>
                            <li>
                                <a 
                                    onClick={() => {
                                        handleCopy('renato@artsn.fi');
                                    }} 
                                    className='link text-secondary'
                                >
                                    Email
                                </a>
                            </li>
                            <li>
                                <a href='https://t.me/rcapizz' target='_blank' className='link text-secondary'>Telegram</a>
                            </li>
                            <li>
                                <a href='https://discord.gg/DZHY6B7Q46' target='_blank' className='link text-secondary'>Discord</a>
                            </li>
                            <li>
                                <a href='https://www.instagram.com/theartisan_nft/' target='_blank' className='link text-secondary'>Instagram</a>
                            </li>
                        </ul>
                    </div>
                </CardFooter>
            </Card>
        </Suspense>
    )
}