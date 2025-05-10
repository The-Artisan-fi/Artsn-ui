'use client'

import { ReactNode } from 'react'
import { ParaProvider } from '@/providers/Para'

export default function ParaWrapper({ children }: { children: ReactNode }) {
  return (
    <ParaProvider>
      {children}
    </ParaProvider>
  )
} 