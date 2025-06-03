import mongoose from 'mongoose'

// Dual database setup for PayloadCMS
// DATABASE_URI: PayloadCMS data (users, media, admin)
// DATABASE_DATA_URI: Backend-v3 data (pools, chains, collections, tokens)

export class DualDatabaseConfig {
  private static payloadConnection: mongoose.Connection | null = null
  private static dataConnection: mongoose.Connection | null = null

  static async getPayloadConnection(): Promise<mongoose.Connection> {
    if (!this.payloadConnection) {
      this.payloadConnection = mongoose.createConnection(process.env.DATABASE_URI!)
      console.log('✅ PayloadCMS database connected:', process.env.DATABASE_URI?.split('@')[1])
    }
    return this.payloadConnection
  }

  static async getDataConnection(): Promise<mongoose.Connection> {
    if (!this.dataConnection) {
      this.dataConnection = mongoose.createConnection(process.env.DATABASE_DATA_URI!)
      console.log('✅ Data database connected:', process.env.DATABASE_DATA_URI?.split('@')[1])
    }
    return this.dataConnection
  }

  static async closeConnections(): Promise<void> {
    if (this.payloadConnection) {
      await this.payloadConnection.close()
      this.payloadConnection = null
    }
    if (this.dataConnection) {
      await this.dataConnection.close()
      this.dataConnection = null
    }
  }
}

// Helper to get the appropriate connection for a collection
export function getConnectionForCollection(collectionSlug: string): string {
  const dataCollections = ['chains', 'pools', 'collections', 'tokens']

  if (dataCollections.includes(collectionSlug)) {
    return process.env.DATABASE_DATA_URI!
  }

  // Default to PayloadCMS database for users, media, etc.
  return process.env.DATABASE_URI!
}
