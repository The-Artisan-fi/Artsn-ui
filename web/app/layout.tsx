import './global.css';
import { ApolloWrapper } from "./ApolloWrapper";
import { AppLayout } from '@/components/Ui/app-layout';
import { ClusterProvider } from '@/components/Cluster/cluster-data-access';
import { SolanaProvider } from '@/components/Solana/solana-provider';
import { seoData } from '@/lib/seoData';
import type { Metadata } from 'next';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: seoData.title,
  authors: [
    {
      name: seoData.author,
    },
  ],
  description: seoData.description,
  keywords: seoData.keywords.join(','),
  metadataBase: new URL(seoData.url),
  alternates: {
    canonical: seoData.url,
  },
  openGraph: {
    type: 'website',
    url: seoData.url,
    title: seoData.title,
    description: seoData.description,
    images: seoData.image,
    siteName: seoData.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: seoData.title,
    description: seoData.description,
    images: seoData.image,
    site: seoData.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* <!-- HTML Meta Tags --> */}
        <title>The Artisan</title>
        <meta name="description" content="The Artisan is a digital boutique specializing in fractionalized high-end collectibles on the Solana blockchain." />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://beta.artsn.fi/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Artisan" />
        <meta property="og:description" content="The Artisan is a digital boutique specializing in fractionalized high-end collectibles on the Solana blockchain." />
        <meta property="og:image" content="/assets/opengraph.png" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="beta.artsn.fi" />
        <meta property="twitter:url" content="https://beta.artsn.fi/" />
        <meta name="twitter:title" content="The Artisan" />
        <meta name="twitter:description" content="The Artisan is a digital boutique specializing in fractionalized high-end collectibles on the Solana blockchain." />
        <meta name="twitter:image" content="/assets/opengraph.png" />
      </head>
      <body>
        
        <ClusterProvider>
          <SolanaProvider>
            <ApolloWrapper>
              <AppLayout>
                {children}
              </AppLayout>
            </ApolloWrapper>
          </SolanaProvider>
        </ClusterProvider>
        <ToastContainer
          position="bottom-left"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          // style={{
          //     backgroundColor: "#aaaaaa"
          // }}
        />
      </body>
    </html>
  );
}