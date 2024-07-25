import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Users } from './lib/payloadcms/collections/Users'
import { Media } from './lib/payloadcms/collections/Media'
import { snf } from './lib/payloadcms/plugins'
import { seoPlugin } from '@payloadcms/plugin-seo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  /// todo: setup cors and csrf
  /// csrf
  //  cors
  admin: {
    user: Users.slug,
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'lib/payloadcms/graphql/schemas/default.graphql'),
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'lib/payloadcms/types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        [Media.slug]: true,
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
    snf.plugin(),
    seoPlugin({
      collections: [`pages`],
      uploadsCollection: `media`,
      generateTitle: async ({ doc }) => {
        return `${doc.title} `
      },
      generateDescription: ({ doc }) => doc.excerpt,
    }),
  ],
})
