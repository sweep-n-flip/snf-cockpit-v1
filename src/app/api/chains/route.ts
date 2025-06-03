import { dataDb } from '@/lib/services/data-db/connection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const chainsCollection = db.collection('chains')
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const isTestnet = searchParams.get('isTestnet')

    // Build MongoDB filter
    const filter: any = {}
    if (isTestnet !== null && isTestnet !== undefined) {
      filter.isTestnet = isTestnet === 'true'
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Execute MongoDB queries
    const [chains, totalCount] = await Promise.all([
      chainsCollection.find(filter).sort({ chainId: 1 }).skip(skip).limit(limit).toArray(),
      chainsCollection.countDocuments(filter),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: chains,
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
    console.error('Error fetching chains:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch chains' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const chainsCollection = db.collection('chains')
    const body = await request.json()

    // Add timestamps
    const now = new Date()
    const chainData = {
      ...body,
      createdAt: now,
      updatedAt: now,
    }

    const result = await chainsCollection.insertOne(chainData)

    return NextResponse.json({
      success: true,
      data: { ...chainData, _id: result.insertedId },
    })
  } catch (error) {
    console.error('Error creating chain:', error)
    return NextResponse.json({ success: false, error: 'Failed to create chain' }, { status: 500 })
  }
}
