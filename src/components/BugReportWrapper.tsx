'use client'

import dynamic from 'next/dynamic'

// Dynamically import BugReport with no SSR
const BugReport = dynamic(
  () => import('@/components/forms/BugReport').then((mod) => mod.BugReport),
  {
    ssr: false,
    loading: () => null,
  }
)

export default function BugReportWrapper() {
  return <BugReport />
} 