import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ApolloWrapper from '@/providers/ApolloProvider';
import { AuthProvider } from '@/providers/Web3AuthProvider';
import { UiLayout } from "@/components/ui/ui-layout";
import { Suspense } from "react";
import { ReactQueryProvider } from "./react-query-provider";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { Toaster } from "@/components/ui/toaster"

// const geistSans = localFont({
//   src: "../../fonts/GeistSans.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "../../fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
  { label: 'Counter Program', path: '/counter' },
];

export const metadata: Metadata = {
  title: "Artsn.fi",
  description: "Luxury Asset Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
           antialiased`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ReactQueryProvider>
            <ApolloWrapper>
              <AuthProvider>
                
              <div className="max-w-full overflow-x-hidden">
                <UiLayout links={links}>
                  {children}
                </UiLayout>
              </div>
                
              </AuthProvider>
            </ApolloWrapper>
          </ReactQueryProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
