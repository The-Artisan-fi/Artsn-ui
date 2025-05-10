'use client'
import Image from 'next/image';
import { useEffect } from 'react';

export const LoadingSpinner = () => {
  // Prevent scrolling when the spinner is shown
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      // Save current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scrolling when component unmounts
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/logos/artisan-small-logo-black.svg" alt="Logo" className="h-10 w-10 object-contain" width={40} height={40} />
        </div>
        <div className="h-full w-full animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    </div>
  )
}
