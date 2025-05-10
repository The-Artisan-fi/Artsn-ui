import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Building2,
  TrendingUp,
  Shield,
  WatchIcon,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function HeroSection() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is standard md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="relative h-[640px] overflow-hidden bg-background pt-[65px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        {' '}
        {/* Adjusted height */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <Image
          src="/hero/bg.svg"
          alt="Background"
          className="h-full w-full object-cover"
          height={640}
          width={1920}
        />
      </div>

      {/* Main Content */}
      <div className="container relative z-20 mx-auto">
        <div className="flex max-w-[600px] flex-col px-4 pt-4 md:pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Luxury Assets
            <br />
            Made Accessible
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-lg text-pretty rounded-2xl bg-white/10 px-2 text-lg text-black backdrop-blur-sm dark:text-white md:mb-8"
          >
            Start with as little as $100
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 mt-12 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="w-full bg-primary text-lg hover:border hover:border-white hover:bg-primary/90 sm:w-auto"
              onClick={() => router.push('/marketplace')}
            >
              Explore the Marketplace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden grid-cols-3 gap-8 md:grid"
          >
            <div className="flex flex-col">
              <WatchIcon className="mb-2 h-6 w-6" />
              <div className="text-xl font-bold">$35B</div>
              <div className="text-sm text-muted-foreground">Market Size</div>
            </div>
            <div className="flex flex-col">
              <TrendingUp className="mb-2 h-6 w-6" />
              <div className="text-xl font-bold">+20%</div>
              <div className="text-sm text-muted-foreground">
                Avg. Annual Growth
              </div>
            </div>
            <div className="flex flex-col">
              <Shield className="mb-2 h-6 w-6" />
              <div className="text-xl font-bold">Swiss</div>
              <div className="text-sm text-muted-foreground">Regulated</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Phone Mockup with Slanted Cutoff */}
      <div className="relative mt-12 hidden md:block">
        {/* Slanted Overlay */}
        <div
          className={`
            absolute 
            left-0 
            right-0 
            z-[11] 
            h-[15vh] 
            bg-background 
            md:h-[20vh]
            lg:h-[25vh]
            ${isMobile ? 'bottom-[10vh]' : 'bottom-[15vh] xl:bottom-[20vh]'}
          `}
          style={{
            transform: 'skewY(-6deg)',
            transformOrigin: 'bottom left',
          }}
        />

        {/* Phone Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative -right-[300px] -top-[600px] mx-auto px-4 md:-right-[275px] md:-top-[500px] lg:-right-[300px] lg:-top-[600px] xl:-top-[700px]"
          style={{
            width: '80%',
            marginTop: '2rem',
          }}
        >
          <Image
            src="/hero/desktop.svg"
            alt="Phone frame"
            className="relative z-10 hidden h-auto w-full dark:block"
            style={{
              transform: 'translateY(10%)',
            }}
            height={200}
            width={200}
          />
          <Image
            src="/hero/desktop.svg"
            alt="Phone frame"
            className="relative z-10 block h-auto w-full dark:hidden"
            style={{
              transform: 'translateY(10%)',
            }}
            height={200}
            width={200}
          />
        </motion.div>
      </div>

      {/* Mobile Phone Mockup with Slanted Cutoff*/}
      <div className="relative mt-24 block md:hidden">
        {/* Slanted Overlay */}
        <div
          className={`
            absolute 
            left-0 
            right-0 
            z-[11] 
            h-[25vh]
            bg-background 
            bottom-0
          `}
          style={{
            transform: 'skewY(-6deg)',
            transformOrigin: 'bottom left',
          }}
        />

        {/* Phone Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative bottom-[150px] mx-auto w-full px-4"
        >
          <Image
            src="/hero/mobile.svg"
            alt="Phone frame"
            className="relative z-10 hidden h-auto w-full dark:block"
            style={{
              transform: 'translateY(10%)',
            }}
            height={200}
            width={200}
          />
          <Image
            src="/hero/mobile.svg"
            alt="Phone frame"
            className="relative z-10 block h-auto w-full dark:hidden"
            style={{
              transform: 'translateY(10%)',
            }}
            height={200}
            width={200}
          />
        </motion.div>
      </div>
    </div>
  )
}
