import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV == 'production' ? 'standalone' : undefined,
  reactStrictMode: true,
  swcMinify: true,
}

export default withPayload(nextConfig)
