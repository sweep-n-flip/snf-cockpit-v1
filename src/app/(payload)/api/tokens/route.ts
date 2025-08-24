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
    const chainId = parseInt(searchParams.get('chainId') || '0')
    const isErc20 = searchParams.get('isErc20')
    const isCollection = searchParams.get('isCollection')
    const tokenAddress = searchParams.get('tokenAddress')
    const tokenName = searchParams.get('tokenName')
    const tokenSymbol = searchParams.get('tokenSymbol')

    // Build MongoDB filter
    const filter: any = {}

    // Handle chainId filter - filter directly by chainId
    if (chainId > 0) {
      filter.chainId = chainId
    }

    // Filter by token type (ERC20 or Collection)
    if (isErc20 !== null && isErc20 !== undefined) {
      filter.isErc20 = isErc20 === 'true'
    }

    if (isCollection !== null && isCollection !== undefined) {
      filter.isCollection = isCollection === 'true'
    }

    // Filter by specific token address
    if (tokenAddress) {
      filter.address = { $regex: tokenAddress, $options: 'i' }
    }

    // Filter by specific token name
    if (tokenName) {
      filter.name = { $regex: tokenName, $options: 'i' }
    }

    // Filter by specific token symbol
    if (tokenSymbol) {
      filter.symbol = { $regex: tokenSymbol, $options: 'i' }
    }

    // Handle general search across multiple fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ]
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Execute MongoDB queries - simplified since chainId is now direct
    const [tokens, totalCount] = await Promise.all([
      tokensCollection.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      tokensCollection.countDocuments(filter),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    // Transform token data to handle the new structure
    const tokensData = tokens.map(token => ({
      ...token,
      logo: token.logo || token.collection?.logo || null,
      name: token.name || token.collection?.name || null,
      symbol: token.symbol || token.collection?.symbol || null,
      address: token.address || token.collection?.address || null,
      tokenIds: token.tokenIds || null,
      wrapper: token.wrapper || null,
      collection: token.collection ? {
        ...token.collection,
        id: token.id || token.collection.id,
      } : token.collection,
    }))

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: tokensData,
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
    console.error('Error fetching tokens:', error)
    return addCorsHeaders(NextResponse.json(
      { success: false, error: 'Failed to fetch tokens' },
      { status: 500 }
    ))
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

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newToken },
    }))
  } catch (error) {
    console.error('Error creating token:', error)
    return addCorsHeaders(NextResponse.json(
      { success: false, error: 'Failed to create token' },
      { status: 500 }
    ))
  }
}

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
