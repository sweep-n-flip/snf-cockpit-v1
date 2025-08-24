import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  eslint: {
    // Disable ESLint during builds to avoid build failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      encoding: false,
      'pino-pretty': false,
    }

    return config
  },
  images: {
    remotePatterns: [
      {
        hostname: 'ipfs.io',
      },
      {
        hostname: 'localhost',
      },
      {
        hostname: 's2.coinmarketcap.com',
      },
      {
        hostname: 'img.reservoir.tools',
      },
      {
        hostname: 'picsum.photos',
      },
      {
        hostname: 'i.seadn.io',
      },
    ],
  },
}

export default withPayload(nextConfig)
