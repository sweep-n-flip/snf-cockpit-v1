import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
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
