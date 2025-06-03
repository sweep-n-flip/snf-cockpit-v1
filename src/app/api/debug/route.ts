import { dataDb } from '@/lib/services/data-db/connection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const db = await dataDb.connect()

    // List all collections in the database
    const collections = await db.listCollections().toArray()
    console.log(
      '📊 All collections in database:',
      collections.map((c) => c.name),
    )

    const stats = {}
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments({})
      stats[collection.name] = count
    }

    return NextResponse.json({
      success: true,
      database: db.databaseName,
      collections: collections.map((c) => c.name),
      documentCounts: stats,
    })
  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json({ success: false, error: 'Failed to get debug info' }, { status: 500 })
  }
}
