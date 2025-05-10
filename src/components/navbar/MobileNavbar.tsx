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
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { usePara } from '@/providers/Para'

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
        onClick={onClick}
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
  const { isDarkMode } = useTheme()
  const { isAuthenticated } = useAuthStore();
  const { openModal } = usePara();

  const ANIMATION_DELAY = 0.2
  const links2 = [


    { label: 'About Us', path: '/about' },
    { label: 'Assets', path: '/marketplace' },
  ]
  return (
    <Suspense fallback={<div />}>
      {LoginFeatureProps.isOpen && (
        <nav className="fixed inset-0 top-0 left-0 right-0 z-[200] flex h-screen w-full flex-col justify-end gap-12 self-center bg-white p-6 pb-20 text-sm duration-200">
          <Image
            src={'/logos/logo-blur.svg'}
            alt="Logo"
            layout="fill"
            objectFit="cover"
            quality={100}
            className='-z-200 opacity-30
            transform translate-x-10
            '
          />
          <ul className="list-style-none z-[500] flex flex-col items-stretch gap-6 md:flex-row md:items-center lg:gap-5 xl:gap-6">
            {links2.map(({ label, path }, i) => (
              <NavItem
                key={i}
                href={path}
                index={i}
                delay={ANIMATION_DELAY}
                onClick={(e) => {
                  e.preventDefault();
                  LoginFeatureProps.onClose();
                  router.push(path);
                }}
              >
                {label}
              </NavItem>
            ))}
            
            {isAuthenticated ? (
              <>
                <NavItem
                  href="/settings"
                  index={links2.length}
                  delay={ANIMATION_DELAY}
                  onClick={(e) => {
                    e.preventDefault();
                    LoginFeatureProps.onClose();
                    router.push('/settings');
                  }}
                >
                  Settings
                </NavItem>
                <NavItem
                  href="/dashboard"
                  index={links2.length + 1}
                  delay={ANIMATION_DELAY}
                  onClick={(e) => {
                    e.preventDefault();
                    LoginFeatureProps.onClose();
                    router.push('/dashboard');
                  }}
                >
                  My Assets
                </NavItem>
                
                <Button
                  className="w-3/4 rounded-full bg-secondary text-white"
                  onClick={() => openModal()}
                >
                  Account
                </Button>
              </>
            ) : (
              <Button
                className="w-3/4 rounded-full bg-black text-white"
                onClick={(e) => {
                  e.preventDefault();
                  LoginFeatureProps.onClose();
                  openModal();
                }}
              >
                Login
              </Button>
            )}
            
          </ul>
          <CardFooter className=" flex w-full flex-row items-center justify-center p-0 mt-14 mb-4 ">
            <div className="flex flex-row gap-2 justify-center">
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