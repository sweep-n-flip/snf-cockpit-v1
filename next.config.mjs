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
    ],
  },
  async headers() {
    return [
      {
        // Aplica esses cabeçalhos a todas as rotas da API
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
