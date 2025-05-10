'use client'
import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useRouter } from 'next/navigation'

// Use dynamic import with suspense for better loading experience
const Dashboard = dynamic(() => import('@/components/dashboard/Dashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})

export default function DashboardPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const loading = useAuthStore(state => state.loading); // Get loading state

  useEffect(() => {
    // Redirect if not authenticated and not loading
    if(!isAuthenticated && !loading){
      router.push('/')
    }
  }, [isAuthenticated, loading, router]); 

  // Show loading spinner while checking auth or if not authenticated yet
  if (loading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  // Only render Dashboard if authenticated
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
