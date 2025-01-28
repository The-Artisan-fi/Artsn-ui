import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import './globals.css'
import ApolloWrapper from '@/providers/ApolloProvider'
import { UiLayout } from '@/components/ui/ui-layout'
import { Suspense } from 'react'
import { ReactQueryProvider } from './react-query-provider'
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'
import { Toaster } from '@/components/ui/toaster'

const BugReport = dynamic(
  () => import('@/components/forms/BugReport').then((mod) => mod.BugReport),
  {
    ssr: false,
  }
)

const AuthProvider = dynamic(
  () => import('@/providers/Web3AuthProvider').then((mod) => mod.AuthProvider),
  {
    ssr: false,
  }
)

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
  { label: 'Counter Program', path: '/counter' },
]

export const metadata: Metadata = {
  title: 'Artsn.fi',
  description: 'Luxury Asset Marketplace',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Syne:wght@400..800&display=swap"
          rel="stylesheet"
        />
        {/* <!-- HTML Meta Tags --> */}
        <title>The Artisan</title>
        <meta
          name="description"
          content="The Artisan is a digital boutique specializing in fractionalized high-end collectibles on the Solana blockchain."
        />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://beta.artsn.fi/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Artisan" />
        <meta
          property="og:description"
          content="The Artisan is a digital boutique specializing in fractionalized high-end collectibles on the Solana blockchain."
        />
        <meta property="og:image" content="/assets/opengraph.png" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="beta.artsn.fi" />
        <meta property="twitter:url" content="https://beta.artsn.fi/" />
        <meta name="twitter:title" content="The Artisan" />
        <meta
          name="twitter:description"
          content="The Artisan is a digital boutique specializing in fractionalized high-end collectibles on the Solana blockchain."
        />
        <meta name="twitter:image" content="/assets/opengraph.png" />
      </head>
      <body className={`antialiased`}>
        <Suspense fallback={<LoadingSpinner />}>
          <ReactQueryProvider>
            <ApolloWrapper>
              <AuthProvider>
                <div className="max-w-full overflow-x-hidden">
                  <UiLayout links={links}>{children}</UiLayout>
                </div>
              </AuthProvider>
            </ApolloWrapper>
          </ReactQueryProvider>
        </Suspense>
        <BugReport />
        <Toaster />
      </body>
    </html>
  )
}
