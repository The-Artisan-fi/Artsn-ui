//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hostname } = require('os');
const { composePlugins, withNx } = require('./.nx-helpers/compiled.js');

/**
 * @type {import('./.nx-helpers/compiled.js').WithNxOptions}
 **/
const nextConfig = {
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      'bigint',
      'node-gyp-build',
    ];
    return config;
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

// module.exports = composePlugins(...plugins)(nextConfig);

module.exports = {
  images: {
    formats: [
      "image/avif", 
      "image/webp",
      "image/jpg",
      "image/jpeg",
      "image/png",
    ],
    domains: ['https://www.example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artisan-solana.s3.eu-central-1.amazonaws.com', //https://artisan-solana.s3.eu-central-1.amazonaws.com
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/',
      },
      
      {
        protocol: 'https',
        hostname: 'arweave.net',
        port: '',
        pathname: '/**',
      },
    ],
  },

  composePlugins: composePlugins(...plugins),
  ...nextConfig,
}
