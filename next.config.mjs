/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
      remotePatterns: [{
          protocol: 'https',
          hostname: '*',
          pathname: '/**',
      }],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
        has: [
          {
            type: 'query',
            key: '_rsc',
            // This ensures the rewrite only happens when _rsc parameter is present
            value: '(.*)',
          },
        ],
      },
    ];
  },
  // headers: async () => [
  //   {
  //     source: '/(.*)',
  //     headers: [
  //       {
  //         key: 'Content-Security-Policy',
  //         value: process.env.NODE_ENV === 'development' 
  //           ? "default-src 'self' http://localhost:* https://localhost:* https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:* https://www.gstatic.com https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com https://js.stripe.com https://crypto-js.stripe.com https://m.stripe.network https://m.stripe.com https://vercel.live; style-src 'self' 'unsafe-inline' http://localhost:* https://localhost:* https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com; img-src 'self' data: blob: http://localhost:* https://localhost:* https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com https://m.stripe.network https://m.stripe.com; font-src 'self' data: http://localhost:* https://localhost:* https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com data:; connect-src 'self' blob: http://localhost:* https://localhost:* https://www.gstatic.com https://*.getpara.com https://*.para.dev https://*.solana.com https://*.solana-devnet.com https://*.usecapsule.com https://*.stripe.com https://api.beta.getpara.com https://m.stripe.network https://m.stripe.com https://soft-cold-energy.solana-devnet.quiknode.pro https://*.ingest.us.sentry.io https://devnet.helius-rpc.com wss://ws-us3.pusher.com wss://mpc-network.beta.getpara.com/ wss://*.getpara.com wss://mpc-network.beta.getpara.com/ws/protocols/* wss://mpc-network.beta.getpara.com/ws/* ws://mpc-network.beta.getpara.com/ws/* ws://mpc-network.beta.getpara.com/ws/protocols/*; worker-src 'self' blob: https://www.gstatic.com https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com; frame-src 'self' https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com https://m.stripe.network https://m.stripe.com https://vercel.live;"
  //           : "default-src 'self' https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com https://js.stripe.com https://crypto-js.stripe.com https://m.stripe.network https://m.stripe.com https://vercel.live; style-src 'self' 'unsafe-inline' https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com; img-src 'self' data: https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com https://m.stripe.network https://m.stripe.com; font-src 'self' https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com data:; connect-src 'self' blob: https://www.gstatic.com https://*.getpara.com https://*.para.dev https://*.solana.com https://*.solana-devnet.com https://*.usecapsule.com https://*.stripe.com https://api.beta.getpara.com https://m.stripe.network https://m.stripe.com https://soft-cold-energy.solana-devnet.quiknode.pro https://*.ingest.us.sentry.io https://devnet.helius-rpc.com wss://ws-us3.pusher.com wss://mpc-network.beta.getpara.com/ wss://*.getpara.com wss://mpc-network.beta.getpara.com/ws/protocols/* wss://mpc-network.beta.getpara.com/ws/* ws://mpc-network.beta.getpara.com/ws/* ws://mpc-network.beta.getpara.com/ws/protocols/*; worker-src 'self' blob: https://www.gstatic.com https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com; frame-src 'self' https://*.getpara.com https://*.para.dev https://*.usecapsule.com https://*.stripe.com https://m.stripe.network https://m.stripe.com https://vercel.live;",
  //       },
  //       {
  //         key: 'X-Content-Type-Options',
  //         value: 'nosniff',
  //       },
  //       {
  //         key: 'X-Frame-Options',
  //         value: 'SAMEORIGIN',
  //       },
  //       {
  //         key: 'Cross-Origin-Opener-Policy',
  //         value: 'same-origin-allow-popups',
  //       },
  //     ],
  //   },
  //   {
  //     source: '/docs/:path*',
  //     headers: [
  //       {
  //         key: 'Content-Disposition',
  //         value: 'inline',
  //       },
  //       {
  //         key: 'Cache-Control',
  //         value: 'public, max-age=86400',
  //       }
  //     ],
  //   },
  // ],
};

export default nextConfig;
