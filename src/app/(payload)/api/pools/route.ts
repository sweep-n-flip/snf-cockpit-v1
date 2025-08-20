import { dataDb } from '@/lib/services/data-db/connection'
import { NextRequest, NextResponse } from 'next/server'

export interface TopPool {
  rank: number
  collectionPool: {
    _id: string
    name: string
    image: string
    verified: boolean
    address: string
  }
  chain: {
    _id: string
    chainId: number
    name: string
    symbol: string
    icon: string
  }
  lp: {
    icons: string[]
    hasAddButton?: boolean
  }
  nftPrice: {
    value: string
    currency: string
  }
  listings: string
  ethOffers: {
    value: string
    currency: string
  }
  liquidity: string
  volume: string
  apy: string
  poolStats: {
    nftPrice: number
    nftListings: string | number
    offers: number
    apr: number
    totalVolume: number
    liquidity: number
    reserve0: number
    reserve1: number
    dailyVolume0: number
    dailyVolume1: number
    updatedAt: string
  }
  expandedData?: {
    subPools: any[]
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const poolsCollection = db.collection('pools')
    const chainsCollection = db.collection('chains')
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const chainId = searchParams.get('chainId')
    const sortBy = searchParams.get('sortBy') || 'poolStats.liquidity'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search')

    // Build match stage
    const matchStage: any = {}

    // Filter by chain if specified
    if (chainId && chainId !== 'all') {
      const chainNumericId = parseInt(chainId)
      const chain = await chainsCollection.findOne({ chainId: chainNumericId })
      if (chain) {
        matchStage.chainId = chain._id
      } else {
        // If chain not found, return empty results
        return addCorsHeaders(NextResponse.json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            totalPages: 0,
            totalDocs: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }))
      }
    }

    // Add search filter if specified
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i') // Case-insensitive search
      matchStage.$or = [
        { 'name': searchRegex },
        { 'token0.collection.name': searchRegex },
        { 'token0.collection.symbol': searchRegex },
        { 'token1.collection.name': searchRegex },
        { 'token1.collection.symbol': searchRegex },
        { 'token0.symbol': searchRegex },
        { 'token1.symbol': searchRegex },
      ]
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Aggregation pipeline to get pools with chain data
    const pipeline = [
      { $match: matchStage },

      // Lookup chain data using ObjectId reference
      {
        $lookup: {
          from: 'chains',
          localField: 'chainId',
          foreignField: '_id',
          as: 'chainData',
        },
      },
      { $unwind: { path: '$chainData', preserveNullAndEmptyArrays: true } },

      // Sort pools by the specified field
      {
        $sort: {
          [sortBy]: sortOrder === 'desc' ? -1 : 1,
          _id: 1, // Stable sort
        },
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ]

    // Execute aggregation
    const pools = await poolsCollection.aggregate(pipeline).toArray()

    // Get total count for pagination
    const totalCount = await poolsCollection.countDocuments(matchStage)
    const totalPages = Math.ceil(totalCount / limit)

    // Transform data to match frontend interface and add rank
    const transformedPools = pools.map((pool: any, index: number) => {
      // Determine collection and native tokens based on isCollection flag
      const collectionToken = pool.token0?.isCollection ? pool.token0 : pool.token1
      const nativeToken = pool.token0?.isCollection ? pool.token1 : pool.token0
      const chain = pool.chainData || {}

      // Get collection info from the collection object within the token
      const collectionInfo = collectionToken?.collection || {}
      return {
        rank: index + 1,
        pool: {
          poolId: pool.poolId,
          token0Id: pool.token0?.id,
          token1Id: pool.token1?.id,
        },
        collectionPool: {
          id: collectionInfo.id,
          name: pool.name,
          image: collectionInfo.logo,
          verified: collectionInfo.verified || false,
          address: collectionInfo.address || collectionToken?.address || '',
        },
        chain: {
          _id: chain._id?.toString(),
          chainId: chain.chainId,
          name: chain.name,
          symbol: chain.symbol,
          icon: chain.logo,
        },
        lp: {
          icons: [
            chain.logo,
            collectionInfo.logo,
          ],
          hasAddButton: false,
        },
        nftPrice: {
          value: (pool.poolStats?.nftPrice || 0).toFixed(3),
          currency: nativeToken?.symbol || chain.symbol || 'ETH',
        },
        listings: (pool.poolStats?.nftListings || 0).toString(),
        ethOffers: {
          value: (pool.poolStats?.offers || 0).toString(),
          currency: nativeToken?.symbol || chain.symbol || 'ETH',
        },
        liquidity: (pool.poolStats?.liquidity || 0).toFixed(3),
        volume: (pool.poolStats?.totalVolume || 0).toFixed(3), // Using totalVolume since dailyVolume0/1 are not populated
        apy: `${(pool.poolStats?.apr || 0).toFixed(1)}%`,
        poolStats: {
          nftPrice: pool.poolStats?.nftPrice || 0,
          nftListings: pool.poolStats?.nftListings || 0,
          offers: pool.poolStats?.offers || 0,
          apr: pool.poolStats?.apr || 0,
          totalVolume: pool.poolStats?.totalVolume || 0,
          liquidity: pool.poolStats?.liquidity || 0,
          reserve0: pool.poolStats?.reserve0 || 0,
          reserve1: pool.poolStats?.reserve1 || 0,
          dailyVolume0: pool.poolStats?.dailyVolume0 || 0,
          dailyVolume1: pool.poolStats?.dailyVolume1 || 0,
          updatedAt: pool.poolStats?.updatedAt?.toISOString() || new Date().toISOString(),
        },
        expandedData: {
          subPools: [],
        },
      }
    })

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: transformedPools,
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
    console.error('Error fetching pools:', error)
    return addCorsHeaders(NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pools',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    ))
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

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: { ...poolData, _id: result.insertedId },
    }))
  } catch (error) {
    console.error('Error creating pool:', error)
    return addCorsHeaders(NextResponse.json({ success: false, error: 'Failed to create pool' }, { status: 500 }))
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
