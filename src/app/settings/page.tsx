'use client';

import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import React, { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with suspense for better loading experience
const Settings = dynamic(() => import('@/components/settings/Settings'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
  })
  
const SettingsPage = () => {
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
    
    // Only render Settings if authenticated
    return (
      <Suspense fallback={<LoadingSpinner />}>
          <div className="mx-auto px-4 py-8 pt-24"> {/* Add padding top to account for fixed navbar */}
              <Settings />
          </div>
      </Suspense>
    );
};

export default SettingsPage; 