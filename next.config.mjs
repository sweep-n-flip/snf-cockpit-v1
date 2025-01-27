import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
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
      //remover
      {
        hostname: 's3.cointelegraph.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/bridge',
        permanent: false,
      },
    ]
  },
}

export default withPayload(nextConfig)
