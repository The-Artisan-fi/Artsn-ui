'use client'
import styles from '@/styles/components/Footer.module.css'
import { Suspense } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
export default function FooterFeature() {
  const handleCopy = (e: string) => {
    console.log(e)
    navigator.clipboard.writeText(e)
  }
  return (
    <Suspense fallback={<div />}>
      <Card className="flex w-full flex-row items-start justify-center self-center overflow-hidden rounded-none bg-transparent md:justify-between md:px-12 md:py-14">
        <CardContent className="flex w-1/2 flex-col items-center gap-4 py-4">
          <div className="flex flex-row md:gap-6">
            <Image
              src="/logos/artisan-small-logo-black.svg"
              alt="Logo"
              width={25}
              height={25}
              className="cursor-pointer dark:hidden"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
            <Image
              src="/logos/artisan-small-logo-white.svg"
              alt="Logo"
              width={32}
              height={32}
              className="hidden cursor-pointer dark:flex"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
            <h1 className="mt-2 text-xl text-secondary md:mt-0 md:text-3xl">
              The Artisan
            </h1>
          </div>
          {/* <span className={styles.subText}>
                        Baseline
                    </span> */}
          <div className="align-center flex flex-row items-center justify-center gap-14">
            <Image
              src="/assets/footer/solana-icon.webp"
              alt="Logo"
              width={60}
              height={60}
              className="cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
            <Image
              src="/assets/footer/swiss-icon.webp"
              alt="Logo"
              width={60}
              height={60}
              className="cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="w-1/2 flex-row items-start items-center justify-evenly md:w-3/4 md:gap-16">
          <div className="mt-4 flex flex-col justify-start">
            <h2 className="font-bold text-secondary">Site</h2>
            <ul className={styles.linkList}>
              <li>
                <a
                  href="/marketplace"
                  target="_blank"
                  className="link text-secondary"
                >
                  Start Collecting
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  target="_blank"
                  className="link text-secondary"
                >
                  About Us
                </a>
              </li>
              {/* <li>
                                <a href='tos' target='_blank' className='link text-secondary'>Terms and Conditions</a>
                            </li>
                            <li>
                                <a href='privacy' target='_blank' className='link text-secondary'>Privacy Policy</a>
                            </li> */}
            </ul>
          </div>
          <div className={styles.linkContainerCol}>
            <h2 className="font-bold text-secondary">Socials</h2>
            <ul className={styles.linkList}>
              <li>
                <a
                  href="https://www.linkedin.com/company/the-artisan-nft/?viewAsMember=true"
                  className="link text-secondary"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/ArtsnFi"
                  className="link text-secondary"
                  target="_blank"
                >
                  Twitter/X
                </a>
              </li>
              {/* <li>
                                <a 
                                    onClick={() => {
                                        handleCopy('renato@artsn.fi');
                                    }} 
                                    className='link text-secondary'
                                >
                                    Email
                                </a>
                            </li> */}
              {/* <li>
                                <a href='https://t.me/rcapizz' target='_blank' className='link text-secondary'>Telegram</a>
                            </li> */}
              <li>
                <a
                  href="https://discord.gg/DZHY6B7Q46"
                  target="_blank"
                  className="link text-secondary"
                >
                  Discord
                </a>
              </li>
              {/* <li>
                                <a href='https://www.instagram.com/theartisan_nft/' target='_blank' className='link text-secondary'>Instagram</a>
                            </li> */}
            </ul>
          </div>
        </CardFooter>
      </Card>
    </Suspense>
  )
}
