import type { Metadata } from 'next'
import { Cormorant_Infant, Syne } from 'next/font/google'
import './globals.css'
import { UiLayout } from '@/components/ui/ui-layout'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/providers'
import BugReportWrapper from '@/components/BugReportWrapper'

// Initialize the fonts
const cormorantInfant = Cormorant_Infant({
  subsets: ['latin'],
  variable: '--font-cormorant-infant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const links = [
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorantInfant.variable} ${syne.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
      <body className="antialiased">
        <Providers>
          <div className="max-w-full overflow-x-hidden">
            <UiLayout links={links}>{children}</UiLayout>
          </div>
          <BugReportWrapper />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
