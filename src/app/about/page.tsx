'use client';

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'

// Use dynamic import with suspense
const About = dynamic(() => import('@/components/about/About'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})

export default function AboutPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <About />
    </Suspense>
  )
}
