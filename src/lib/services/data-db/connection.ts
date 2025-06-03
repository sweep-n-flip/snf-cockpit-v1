import { Db, MongoClient } from 'mongodb'

class DataDatabaseService {
  private static instance: DataDatabaseService
  private client: MongoClient | null = null
  private db: Db | null = null

  private constructor() {}

  static getInstance(): DataDatabaseService {
    if (!DataDatabaseService.instance) {
      DataDatabaseService.instance = new DataDatabaseService()
    }
    return DataDatabaseService.instance
  }

  async connect(): Promise<Db> {
    if (!this.db) {
      console.log(
        '🔗 Connecting to DATABASE_DATA_URI:',
        process.env.DATABASE_DATA_URI?.split('@')[1],
      )
      this.client = new MongoClient(process.env.DATABASE_DATA_URI!)
      await this.client.connect()
      // Use the correct database name 'snf'
      this.db = this.client.db('snf')
      console.log('✅ Connected to data database:', this.db.databaseName)
    }
    return this.db
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db
  }
}

export const dataDb = DataDatabaseService.getInstance()
