import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Users } from '@/lib/payloadcms/collections/Users'
import { Media } from '@/lib/payloadcms/collections/Media'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { snf } from '@/lib/payloadcms/plugins'
import { serverClient } from '@/lib/services/graphql/config/server'
import { GET_BRIDGE_TRANSACTION_STATUS_QUERY } from '@/lib/services/graphql/entities/bridge/queries'
import {
  GET_ERC721_BALANCE_QUERY,
  GET_ERC721_APPROVAL_QUERY,
  GET_ERC721_COLLECTION_METADATA_QUERY,
  GET_ERC721_OWNER_COLLECTIONS_QUERY,
} from '@/lib/services/graphql/entities/ERC721/queries'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor(),
  graphQL: {
    schemaOutputFile: path.resolve(
      dirname,
      'lib/payloadcms/plugins/snf/graphql/schemas/default.graphql',
    ),
  },
  collections: [Users, Media],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'lib/payloadcms/types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  /// dev: the order of plugins is important
  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // dev: Specify which collections should use Vercel Blob
      collections: {
        [Media.slug]: true,
      },
      // dev:Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
    snf.plugin({
      graphQL: {
        query: serverClient.query,
        mutate: serverClient.mutate,
        subscribe: serverClient.subscribe,
        queries: {
          /// @dev: bridge transactions
          getBridgeTransactionStatus: GET_BRIDGE_TRANSACTION_STATUS_QUERY,

          /// @dev: ERC721
          getERC721Approval: GET_ERC721_APPROVAL_QUERY,
          getERC721Balance: GET_ERC721_BALANCE_QUERY,
          getERC721CollectionMetadata: GET_ERC721_COLLECTION_METADATA_QUERY,
          getERC721Collections: GET_ERC721_OWNER_COLLECTIONS_QUERY,
        },
        mutations: {},
        subscriptions: {},
      },
    }),
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
