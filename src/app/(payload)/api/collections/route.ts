import { dataDb } from '@/lib/services/data-db/connection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const collectionsCollection = db.collection('collections')
    const { searchParams } = new URL(request.url)

    console.log('🔍 NFT Collections query - Database name:', db.databaseName)

    // Check if collection exists and has documents
    const totalDocsInCollection = await collectionsCollection.countDocuments({})
    console.log('📦 Total documents in collections collection:', totalDocsInCollection)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const nativeChain = searchParams.get('nativeChain')
    const verified = searchParams.get('verified')
    const enabled = searchParams.get('enabled')

    // Build MongoDB filter
    const filter: any = {}

    if (nativeChain) {
      filter.nativeChain = parseInt(nativeChain)
    }

    if (verified !== null && verified !== undefined) {
      filter.verified = verified === 'true'
    }

    if (enabled !== null && enabled !== undefined) {
      filter.enabled = enabled === 'true'
    }

    // Handle search across multiple fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ]
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Execute MongoDB queries
    const [collections, totalCount] = await Promise.all([
      collectionsCollection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collectionsCollection.countDocuments(filter),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: collections,
      pagination: {
        page,
        limit,
        totalPages,
        totalDocs: totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const collectionsCollection = db.collection('collections')
    const body = await request.json()

    const newCollection = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collectionsCollection.insertOne(newCollection)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newCollection },
    })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 },
    )
  }
}
