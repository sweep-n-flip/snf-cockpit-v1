import type { CollectionBeforeOperationHook } from 'payload'
import { DualDatabaseConfig } from '../config/dual-db'

// Hook to ensure data collections use the correct database connection
export const beforeOperationHook: CollectionBeforeOperationHook = async ({ args, operation }) => {
  const dataCollections = ['chains', 'pools', 'collections', 'tokens']

  if (dataCollections.includes(args.collection.slug)) {
    // Force data collections to use DATABASE_DATA_URI connection
    const dataConnection = await DualDatabaseConfig.getDataConnection()

    // Override the mongoose connection for this operation
    if (args.req?.payload?.db?.connection !== dataConnection) {
      console.log(`🔄 Switching to data database for collection: ${args.collection.slug}`)
    }
  }

  return args
}
