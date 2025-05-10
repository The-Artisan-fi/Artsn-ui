'use client'
import styles from '@/styles/components/Footer.module.css'
import { Suspense } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import Link from 'next/link'
export default function FooterFeature() {
  return (
    <Suspense fallback={<div />}>
      <Card className="flex w-full flex-row items-start justify-center self-center overflow-hidden rounded-none border-0 bg-transparent md:px-12 md:py-14">
        <CardContent className="flex flex-col mt-4 md:mt-0 md:gap-4">
          <div className="flex flex-row gap-2 md:gap-6">
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
            <p className="mt-1 text-xl md:mt-0 text-black lg:text-3xl">
              The Artisan
            </p>
          </div>
          {/* <span className={styles.subText}>
                        Baseline
                    </span> */}
          <div className="align-center flex flex-row items-center justify-center gap-4 md:gap-14">
            <Image
              src="/assets/footer/solana-icon.png"
              alt="Logo"
              width={60}
              height={90}
              className="cursor-pointer h-[60px] w-auto"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
            <Link href="/docs/Attestation-daffiliation-SO-FIT-OAR.pdf" target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/footer/swiss-icon.webp"
                alt="Logo"
                width={60}
                height={90}
                className="cursor-pointer h-[90px] w-auto"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </Link>
          </div>
        </CardContent>
        <CardFooter className="w-1/2 flex-row items-start justify-evenly md:w-3/4 md:gap-16 mt-4 md:mt-0">
          <div className="flex flex-col justify-start">
            <h2 className="font-bold text-secondary text-lg lg:text-xl">Site</h2>
            <ul className={styles.linkList}>
              <li className="mb-1">
              <Link 
              className="about-link text-xs md:text-base" 
              href="/about"
            >
                  About Us
                </Link>
              </li>
              <li className="mb-1">
                <a href="/docs/Terms_and_Conditions_TimeVerse_HeadingsBold.pdf" target="_blank" rel="noopener noreferrer" className='link text-secondary text-xs md:text-base'>
                  <span className="md:hidden">T &amp; C</span>
                  <span className="hidden md:inline">Terms and Conditions</span>
                </a>
              </li>
              <li className="mb-1">
                 <a href="/docs/Artisan_Privacy_Policy.pdf" target="_blank" rel="noopener noreferrer" className='link text-secondary text-xs md:text-base'>Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-start">
            <h2 className="font-bold text-secondary text-lg lg:text-xl">Socials</h2>
            <ul className={styles.linkList}>
              <li className="mb-1">
                <a
                  href="https://www.linkedin.com/company/the-artisan-nft/?viewAsMember=true"
                  className="link text-secondary text-xs md:text-base"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="https://twitter.com/ArtsnFi"
                  className="link text-secondary text-xs md:text-base"
                  target="_blank"
                >
                  Twitter/X
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="https://discord.gg/DZHY6B7Q46"
                  target="_blank"
                  className="link text-secondary text-xs md:text-base"
                >
                  Discord
                </a>
              </li>
              <li>
                 <a href='https://www.instagram.com/artsn.fi' 
                  target="_blank"
                  className="link text-secondary text-xs md:text-base"
                  >
                    Instagram
                  </a>
              </li>
            </ul>
          </div>
        </CardFooter>
      </Card>
    </Suspense>
  )
}