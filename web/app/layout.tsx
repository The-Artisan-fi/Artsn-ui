import './global.css';
import { AppLayout } from '@/components/Ui/app-layout';
import { ClusterProvider } from '@/components/Cluster/cluster-data-access';
import { SolanaProvider } from '@/components/Solana/solana-provider';
import 'react-toastify/dist/ReactToastify.css';
export const metadata = {
  title: 'The Artisan',
  description: 'A luxury watch digital boutique',
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
        <title>The Artisan</title>
      </head>
      <body>
        <ClusterProvider>
          <SolanaProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </SolanaProvider>
        </ClusterProvider>
      </body>
    </html>
  );
}
