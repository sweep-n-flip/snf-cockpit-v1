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
  volume24h: string
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

    console.log('🔍 Top Pools API - Database name:', db.databaseName)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const chainId = searchParams.get('chainId')
    const sortBy = searchParams.get('sortBy') || 'poolStats.liquidity'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build match stage
    const matchStage: any = {}

    // Filter by chain if specified
    if (chainId && chainId !== 'all') {
      const chain = await chainsCollection.findOne({ chainId: parseInt(chainId) })
      if (chain) {
        matchStage.chainId = chain._id
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Simple aggregation pipeline
    const pipeline = [
      { $match: matchStage },

      // Lookup chain data
      {
        $lookup: {
          from: 'chains',
          localField: 'chainId',
          foreignField: '_id',
          as: 'chainData',
        },
      },
      { $unwind: { path: '$chainData', preserveNullAndEmptyArrays: true } },

      // Sort pools
      {
        $sort: {
          'poolStats.liquidity': -1,
          _id: 1,
        },
      },

      // Add rank
      {
        $group: {
          _id: null,
          pools: { $push: '$$ROOT' },
        },
      },
      {
        $unwind: {
          path: '$pools',
          includeArrayIndex: 'rank',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$pools', { rank: { $add: ['$rank', 1] } }],
          },
        },
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ]

    // Execute aggregation
    const pools = await poolsCollection.aggregate(pipeline).toArray()

    // Get total count
    const totalCount = await poolsCollection.countDocuments(matchStage)
    const totalPages = Math.ceil(totalCount / limit)

    // Transform data to match frontend interface
    const transformedPools = pools.map((pool: any) => {
      // Determine collection and native tokens
      const collectionToken = pool.token0?.isCollection ? pool.token0 : pool.token1
      const nativeToken = pool.token0?.isCollection ? pool.token1 : pool.token0
      const chain = pool.chainData || {}

      return {
        rank: pool.rank,
        collectionPool: {
          _id: pool._id?.toString() || '',
          name: collectionToken?.name || 'Unknown Collection',
          image: collectionToken?.image || '/rectangle-2-7.png',
          verified: collectionToken?.verified || false,
          address: collectionToken?.address || '',
        },
        chain: {
          _id: chain._id?.toString() || '',
          chainId: chain.chainId || 1,
          name: chain.name || 'Unknown Chain',
          symbol: chain.symbol || 'ETH',
          icon: chain.icon || '/crypto---polygon.svg',
        },
        lp: {
          icons: [
            nativeToken?.icon || '/default-token.png',
            collectionToken?.icon || '/default-nft.png',
          ],
          hasAddButton: false,
        },
        nftPrice: {
          value: (pool.poolStats?.nftPrice || 0).toFixed(3),
          currency: chain.symbol || 'ETH',
        },
        listings: (pool.poolStats?.nftListings || 0).toString(),
        ethOffers: {
          value: (pool.poolStats?.offers || 0).toFixed(2),
          currency: chain.symbol || 'ETH',
        },
        liquidity: ((pool.poolStats?.liquidity || 0) / 1000).toFixed(1),
        volume24h: (
          (pool.poolStats?.dailyVolume0 || 0) + (pool.poolStats?.dailyVolume1 || 0)
        ).toFixed(0),
        apy: `${(pool.poolStats?.apr || 0).toFixed(1)}%`,
        poolStats: pool.poolStats || {
          nftPrice: 0,
          nftListings: 0,
          offers: 0,
          apr: 0,
          totalVolume: 0,
          liquidity: 0,
          reserve0: 0,
          reserve1: 0,
          dailyVolume0: 0,
          dailyVolume1: 0,
          updatedAt: new Date().toISOString(),
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
