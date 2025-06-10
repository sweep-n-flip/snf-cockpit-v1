import { dataDb } from '@/lib/services/data-db/connection'
import { NextRequest, NextResponse } from 'next/server'

// Add CORS headers to response
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

// Handle CORS preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  return addCorsHeaders(response)
}

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

    return addCorsHeaders(NextResponse.json({
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
    }))
  } catch (error) {
    console.error('Error fetching chains:', error)
    return addCorsHeaders(NextResponse.json({ success: false, error: 'Failed to fetch chains' }, { status: 500 }))
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

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: { ...chainData, _id: result.insertedId },
    }))
  } catch (error) {
    console.error('Error creating chain:', error)
    return addCorsHeaders(NextResponse.json({ success: false, error: 'Failed to create chain' }, { status: 500 }))
  }
}
