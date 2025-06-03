import { dataDb } from '@/lib/services/data-db/connection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const tokensCollection = db.collection('tokens')
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const nativeChain = searchParams.get('nativeChain')
    const isErc20 = searchParams.get('isErc20')
    const isCollection = searchParams.get('isCollection')

    // Build MongoDB filter
    const filter: any = {}

    if (nativeChain) {
      filter.nativeChain = parseInt(nativeChain)
    }

    if (isErc20 !== null && isErc20 !== undefined) {
      filter.isErc20 = isErc20 === 'true'
    }

    if (isCollection !== null && isCollection !== undefined) {
      filter.isCollection = isCollection === 'true'
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
    const [tokens, totalCount] = await Promise.all([
      tokensCollection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      tokensCollection.countDocuments(filter),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: tokens,
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
    console.error('Error fetching tokens:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch tokens' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const tokensCollection = db.collection('tokens')
    const body = await request.json()

    const newToken = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await tokensCollection.insertOne(newToken)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newToken },
    })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json({ success: false, error: 'Failed to create token' }, { status: 500 })
  }
}
