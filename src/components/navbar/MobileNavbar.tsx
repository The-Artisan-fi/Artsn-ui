'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Suspense } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import DarkModeButton from '@/components/ui/buttons/DarkModeButton'
import toast from 'react-hot-toast'
import { useTheme } from '@/hooks/use-theme'
import { fadeIn, slideIn } from '@/styles/animations'
import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
type NavItemsProps = {
  href?: string
  children: React.ReactNode
  index: number
  delay: number
  onClick?: (event: React.MouseEvent) => void
}

type LoginFeatureProps = {
  isOpen: boolean
  onClose: () => void
  onCompleted: () => void
}

const NavItem = ({ href, children, onClick, index, delay }: NavItemsProps) => {
  return (
    <motion.li
      className="group"
      variants={slideIn({ delay: delay + index / 10, direction: 'down' })}
      initial="hidden"
      animate="show"
    >
      {/* <Link
          href={href || `/#${children}`}
          className="block p-2 duration-500 hover:text-accent"
        > */}
      <Button
        className="block p-2 duration-500 hover:text-accent"
        variant={'ghost'}
        onClick={() => {
          onClick
        }}
      >
        <Label className="text-lg text-secondary">{children}</Label>
      </Button>
      {/* </Link> */}
    </motion.li>
  )
}
export default function MobileNavbar({
  links,
  LoginFeatureProps,
}: {
  links: { label: string; path: string }[]
  LoginFeatureProps: LoginFeatureProps
}) {
  const router = useRouter()
  const { isDarkMode, toggle } = useTheme()
  const ANIMATION_DELAY = 0.2
  const links2 = [
    { label: 'Home', path: '/' },
    // { label: 'What is Artisan?', path: '#artisan' },
    { label: 'About Us', path: '/about' },
  ]
  return (
    <Suspense fallback={<div />}>
      {LoginFeatureProps.isOpen && (
        <nav className="items-left md:blocks absolute left-1/2 top-full z-[150] flex h-screen w-full -translate-x-1/2 flex-col justify-end gap-12 self-center bg-white p-6 pb-28 text-sm shadow-xl duration-200 md:static md:left-auto md:top-auto md:h-auto md:w-auto md:transform-none md:rounded-none md:shadow-none">
          <ul className="list-style-none flex flex-col items-stretch gap-6 md:flex-row md:items-center lg:gap-5 xl:gap-6">
            {links2.map(({ label, path }, i) => (
              <NavItem
                key={i}
                href={path}
                index={i}
                delay={ANIMATION_DELAY}
                onClick={() => {
                  LoginFeatureProps.onClose(), router.push(path)
                }}
              >
                {label}
              </NavItem>
            ))}
            {/* <Button className="bg-transparent w-3/4 text-secondary rounded-full border-2 border-secondary">
                            Read the white paper 
                        </Button> */}
            <Button
              className="w-3/4 rounded-full bg-secondary text-primary"
              onClick={() => {
                LoginFeatureProps.onClose(), router.push('/marketplace')
              }}
            >
              Explore the Marketplace
            </Button>
            {/* {!clusterSelectCollapsed && (
                            <ClusterUiSelect /> 
                        )}
                        <div className="flex flex-col items-center justify-between gap-5 xl:gap-6">
                            <div className="flex flex-row items-center gap-5">
                                <p className="text-bgsecondary">Current RPC:</p>            
                                <Button className='bg-secondary text-bgsecondary' onClick={()=> setClusterSelectCollapsed(!clusterSelectCollapsed)}>
                                    {cluster.name}
                                </Button>
                            </div>
                        </div> */}
          </ul>
          <CardFooter className="mb-12 flex w-full flex-row items-center justify-between gap-8">
            {/* <DarkModeButton
                            //   onClick={() => (console.log('click'))}
                            variants={slideIn({
                                delay: ANIMATION_DELAY + (links.length + 1) / 10,
                                direction: 'down',
                            })}
                            className='text-secondary dark:text-primary'
                            initial="hidden"
                            animate="show"
                        /> */}
            <div className="flex flex-row gap-2">
              <Image
                src={'/logos/sol-logo-grey.svg'}
                width={25}
                height={25}
                alt="Solana Logo"
              />
              <p className="text-bgsecondary dark:text-secondary">
                Powered by Solana
              </p>
            </div>
          </CardFooter>
        </nav>
      )}
    </Suspense>
  )
}
