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

export interface TrendingCollection {
  rank: number
  collection: {
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
  liquidityPools: {
    icons: string[]
    hasAddButton?: boolean
    poolCount: number
  }
  floor: {
    value: string
    currency: string
  }
  floorChange: string
  volume: {
    value: string
    currency: string
  }
  volumeChange: string
  items: string
  marketStats: {
    totalSupply: number
    ownersCount: number
    listedCount: number
  }
  updatedAt: string
}

export interface TrendingCollectionsResponse {
  success: boolean
  data: TrendingCollection[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalDocs: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await dataDb.connect()
    const trendingCollectionsCollection = db.collection('trending-collections')
    const chainsCollection = db.collection('chains')

    const { searchParams } = new URL(request.url)

    console.log('🔍 Trending Collections API - Database name:', db.databaseName)
    console.log('🔍 Using trending-collections collection with Reservoir data')

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const chainId = searchParams.get('chainId')
    const sortBy = searchParams.get('sortBy') || 'volume24h'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Debug: Check what's in the collections
    const totalDocsInCollection = await trendingCollectionsCollection.countDocuments({})
    const enabledDocs = await trendingCollectionsCollection.countDocuments({ enabled: true })
    const allChains = await chainsCollection.find({}).toArray()
    
    console.log(`🔍 Debug: Total docs in trending-collections: ${totalDocsInCollection}`)
    console.log(`🔍 Debug: Enabled docs: ${enabledDocs}`)
    console.log(`🔍 Debug: Available chains:`, allChains.map(c => ({ chainId: c.chainId, name: c.name })))

    // Build aggregation pipeline for trending collections
    const matchStage: any = {}

    // Remove the enabled filter for now to see all data
    // enabled: true, // Only active collections

    // Filter by chain if specified
    if (chainId && chainId !== 'all') {
      const chainNumericId = parseInt(chainId)
      // Filter by the chainId inside the nativeChain object (after lookup)
      matchStage['nativeChain.chainId'] = chainNumericId
    }

    console.log(`🔍 Debug: Match stage:`, JSON.stringify(matchStage, null, 2))

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Determine sort criteria based on sortBy parameter
    let sortCriteria: any = {}
    switch (sortBy) {
      case 'volume24h':
        sortCriteria = { 'volume.volume1Day': sortOrder === 'desc' ? -1 : 1 }
        break
      case 'volume7d':
        sortCriteria = { 'volume.volume7Day': sortOrder === 'desc' ? -1 : 1 }
        break
      case 'volume30d':
        sortCriteria = { 'volume.volume30Day': sortOrder === 'desc' ? -1 : 1 }
        break
      case 'floorPrice':
        sortCriteria = { floorAskPrice: sortOrder === 'desc' ? -1 : 1 }
        break
      case 'marketCap':
        sortCriteria = { marketCap: sortOrder === 'desc' ? -1 : 1 }
        break
      case 'owners':
        sortCriteria = { ownerCount: sortOrder === 'desc' ? -1 : 1 }
        break
      case 'rank1Day':
        sortCriteria = { rank1Day: 1 } // Always ascending for rank
        break
      case 'rank7Day':
        sortCriteria = { rank7Day: 1 } // Always ascending for rank
        break
      case 'rank30Day':
        sortCriteria = { rank30Day: 1 } // Always ascending for rank
        break
      default:
        sortCriteria = { trendingScore1Day: -1 } // Default to trending score
    }

    // Build aggregation pipeline with lookup for nativeChain
    const pipeline = [
      // First, populate the nativeChain field
      {
        $lookup: {
          from: 'chains',
          localField: 'nativeChain',
          foreignField: '_id',
          as: 'nativeChain'
        }
      },
      
      // Unwind the nativeChain array (since it's a single document)
      {
        $unwind: {
          path: '$nativeChain',
          preserveNullAndEmptyArrays: true
        }
      },

      // Now apply the match stage after nativeChain is populated
      { $match: matchStage },

      // Sort by specified criteria
      { $sort: { ...sortCriteria, _id: 1 } }, // Add _id for stable sort

      // Add ranking within the filtered results
      {
        $setWindowFields: {
          sortBy: sortCriteria,
          output: {
            rank: { $rank: {} },
          },
        },
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ]

    // Execute aggregation
    const [collections, totalCountResult] = await Promise.all([
      trendingCollectionsCollection.aggregate(pipeline).toArray(),
      trendingCollectionsCollection.aggregate([
        // Same lookup and unwind for counting
        {
          $lookup: {
            from: 'chains',
            localField: 'nativeChain',
            foreignField: '_id',
            as: 'nativeChain'
          }
        },
        {
          $unwind: {
            path: '$nativeChain',
            preserveNullAndEmptyArrays: true
          }
        },
        { $match: matchStage }, 
        { $count: 'total' }
      ]).toArray(),
    ])

    const totalCount = totalCountResult[0]?.total || 0
    const totalPages = Math.ceil(totalCount / limit)

    console.log(`📊 Found ${collections.length} trending collections from trending-collections table`)

    // Transform data to match frontend interface
    const transformedCollections = collections.map((collection: any) => {
      const floorPrice = collection.floorAskPrice || 0
      const volume1Day = collection.volume?.volume1Day || 0
      const volumeChange1Day = collection.volume?.volumeChange1Day || 0
      const floorChange1Day = collection.floorChange?.percentage1Day || 0

      return {
        rank: collection.rank || 0,
        collection: {
          _id: collection._id?.toString() || '',
          name: collection.name || collection.symbol || 'Unknown Collection',
          image: collection.image || '',
          verified: collection.verified || collection.openseaVerificationStatus === 'verified',
          address: collection.address || '',
        },
        chain: {
          _id: collection.nativeChain._id?.toString() || '',
          chainId: collection.nativeChain.chainId || 1,
          name: collection.nativeChain.name || 'Unknown Chain',
          symbol: collection.nativeChain.network?.token?.symbol || 'ETH',
          icon: collection.nativeChain.logo || '/crypto---polygon.svg',
        },
        liquidityPools: {
          icons: [], // This would need to be calculated from pools data if needed
          hasAddButton: true,
          poolCount: 0,
        },
        floor: {
          value: floorPrice.toFixed(4),
          currency: collection.nativeChain.network?.token?.symbol || 'ETH',
        },
        floorChange: `${floorChange1Day >= 0 ? '+' : ''}${floorChange1Day.toFixed(1)}%`,
        volume: {
          value: (volume1Day / 1000).toFixed(1), // Convert to K format
          currency: collection.nativeChain.network?.token?.symbol || 'ETH',
        },
        volumeChange: `${volumeChange1Day >= 0 ? '+' : ''}${volumeChange1Day.toFixed(1)}%`,
        items: collection.totalSupply ? 
          (collection.totalSupply >= 1000 ? 
            `${(collection.totalSupply / 1000).toFixed(1)}K` : 
            collection.totalSupply.toString()
          ) : '0',
        marketStats: {
          totalSupply: collection.totalSupply || 0,
          ownersCount: collection.ownerCount || 0,
          listedCount: collection.onSaleCount || 0,
        },
        updatedAt: collection.updatedAt?.toISOString() || new Date().toISOString(),
      }
    })

    console.log(`✅ Successfully transformed ${transformedCollections.length} trending collections`)

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: transformedCollections,
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
    console.error('❌ Error fetching trending collections:', error)
    return addCorsHeaders(NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trending collections',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    ))
  }
}
