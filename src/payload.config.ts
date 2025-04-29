import { Media } from '@/lib/payloadcms/collections/Media'
import { Pools } from '@/lib/payloadcms/collections/Pools'
import { Users } from '@/lib/payloadcms/collections/Users'
import { snf } from '@/lib/payloadcms/plugins'
import { serverClient } from '@/lib/services/graphql/config/server'
import { GET_TOP_POOLS_QUERY } from '@/lib/services/graphql/entities/amm/queries'
import { GET_BRIDGE_TRANSACTION_STATUS_QUERY } from '@/lib/services/graphql/entities/bridge/queries'
import {
  GET_ERC721_APPROVAL_QUERY,
  GET_ERC721_BALANCE_QUERY,
  GET_ERC721_COLLECTION_METADATA_QUERY,
  GET_ERC721_OWNER_COLLECTIONS_QUERY,
} from '@/lib/services/graphql/entities/ERC721/queries'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
// import sharp from 'sharp'
import { Logger } from '@/lib/services/logger'
import { fileURLToPath } from 'url'
import { initServer } from './server'

const logger = new Logger('PayloadConfig')
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Configuração base
const baseConfig = {
  admin: {
    user: Users.slug,
  },
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  editor: lexicalEditor(),
  graphQL: {
    schemaOutputFile: path.resolve(
      dirname,
      'lib/payloadcms/plugins/snf/graphql/schemas/default.graphql',
    ),
  },
  collections: [Users, Media, Pools],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'lib/payloadcms/types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  endpoints: [],
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

          /// @dev: AMM
          getTopPools: GET_TOP_POOLS_QUERY,
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
  onInit: async () => {
    try {
      logger.info('Payload inicializado, iniciando serviços do servidor...')
      await initServer()
      logger.info('Servidor inicializado com sucesso')
    } catch (error) {
      logger.error(`Erro ao inicializar servidor: ${error}`)
    }
  },
}

// Configuração de CORS e CSRF baseada em variáveis de ambiente
const serverConfig = process.env.PUBLIC_URL
  ? {
      serverURL: `${process.env.PUBLIC_URL}:${process.env.PAYLOAD_PORT || 3000}`,
      cors: [`${process.env.PUBLIC_URL}:${process.env.PAYLOAD_PORT || 3000}`],
      csrf: [`${process.env.PUBLIC_URL}:${process.env.PAYLOAD_PORT || 3000}`],
    }
  : {
      serverURL: 'http://localhost:3000',
      cors: ['http://localhost:3000', 'http://localhost:3001'],
      csrf: ['http://localhost:3000', 'http://localhost:3001'],
    }

export default buildConfig({
  ...baseConfig,
  ...serverConfig,
})
