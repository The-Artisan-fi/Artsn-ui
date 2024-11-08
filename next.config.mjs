/** @type {import('next').NextConfig} */
const nextConfig = {
    "include": ["next-env.d.ts", "additional.d.ts", "**/*.ts", "**/*.tsx"],
    images: {
        remotePatterns: [{
          protocol: 'https',
          hostname: '**', 
          pathname: '/**',
        }],
      },
};

export default nextConfig;
