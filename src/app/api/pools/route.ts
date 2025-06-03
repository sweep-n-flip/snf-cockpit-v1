import { dataDb } from '@/lib/services/data-db/connection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const poolsCollection = db.collection('pools')
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const chainId = searchParams.get('chainId')
    const sortBy = searchParams.get('sortBy') || 'poolStats.liquidity'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build MongoDB filter
    const filter: any = {}
    if (chainId) {
      filter.chainId = parseInt(chainId)
    }

    // Build MongoDB sort
    const sort: any = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Execute MongoDB queries
    const [pools, totalCount] = await Promise.all([
      poolsCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      poolsCollection.countDocuments(filter),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: pools,
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
    console.error('Error fetching pools:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch pools' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const poolsCollection = db.collection('pools')
    const body = await request.json()

    // Add timestamps
    const now = new Date()
    const poolData = {
      ...body,
      createdAt: now,
      updatedAt: now,
    }

    const result = await poolsCollection.insertOne(poolData)

    return NextResponse.json({
      success: true,
      data: { ...poolData, _id: result.insertedId },
    })
  } catch (error) {
    console.error('Error creating pool:', error)
    return NextResponse.json({ success: false, error: 'Failed to create pool' }, { status: 500 })
  }
}
