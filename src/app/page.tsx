import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'

// Use dynamic import with suspense for better loading experience
const Home = dynamic(() => import('@/components/home/Home'), {
  ssr: true,
})

// Import the client component for prefetching
const PrefetchComponents = dynamic(() => import('@/components/home/PrefetchComponents'), {
  ssr: true,
})

export default function HomePage() {
  return (
    <>
      <PrefetchComponents />
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    </>
  )
}
