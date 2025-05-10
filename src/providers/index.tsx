'use client'

import { ReactNode } from 'react'
import ApolloWrapper from './ApolloProvider'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import ParaWrapper from '@/components/ParaWrapper'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ApolloWrapper>
        <ParaWrapper>
          {children}
        </ParaWrapper>
      </ApolloWrapper>
    </ReactQueryProvider>
  )
} 