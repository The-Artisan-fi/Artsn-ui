'use client'

import { useEffect } from 'react'

export const PrefetchComponents = () => {
  useEffect(() => {
    // Prefetch marketplace components after initial page load
    // const timer = setTimeout(() => {
    //   void import('@/components/marketplace/Marketplace')
    //   void import('@/components/product/components/ProductCard')
    // }, 500)

    // Preload critical paths
    const links = ['@/components/marketplace/Marketplace', '@/components/product/components/ProductCard'].map(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = path;
      return link;
    });
    links.forEach(link => document.head.appendChild(link));
    return () => {
      //clearTimeout(timer)
      links.forEach(link => link.remove());
    }
  }, [])

  // This component doesn't render anything
  return null
}

export default PrefetchComponents 