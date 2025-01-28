import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the Navbar with no SSR
const Navbar = dynamic(() => import('./Navbar'), { ssr: false })

export function NavbarWrapper({
  links,
  searchParams,
}: {
  links: { label: string; path: string }[]
  searchParams?: { get: (key: string) => string | null }
}) {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <Navbar links={links} searchParams={searchParams} />
    </Suspense>
  )
}
