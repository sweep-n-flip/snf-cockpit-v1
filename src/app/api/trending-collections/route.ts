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
    priceInUsd?: number
  }
  floorChange: string
  volume: {
    value: string
    currency: string
    volumeInUsd?: number
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
    const collectionsCollection = db.collection('collections')
    const chainsCollection = db.collection('chains')
    const poolsCollection = db.collection('pools')

    const { searchParams } = new URL(request.url)

    console.log('🔍 Trending Collections API - Database name:', db.databaseName)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const chainId = searchParams.get('chainId')
    const sortBy = searchParams.get('sortBy') || 'volume24h' // volume24h, floorPrice, liquidityCount
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build aggregation pipeline for trending collections
    const matchStage: any = {
      enabled: true, // Only active collections
      verified: true, // Only verified collections
    }

    // Filter by chain if specified
    if (chainId && chainId !== 'all') {
      const chain = await chainsCollection.findOne({ chainId: parseInt(chainId) })
      if (chain) {
        matchStage.nativeChain = chain._id
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Aggregation pipeline
    const pipeline = [
      // Match verified and enabled collections
      { $match: matchStage },

      // Lookup chain data
      {
        $lookup: {
          from: 'chains',
          localField: 'nativeChain',
          foreignField: '_id',
          as: 'chain',
        },
      },
      { $unwind: '$chain' },

      // Lookup pools for this collection
      {
        $lookup: {
          from: 'pools',
          let: { collectionAddress: '$address' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$token0.address', '$$collectionAddress'] },
                    { $eq: ['$token1.address', '$$collectionAddress'] },
                  ],
                },
              },
            },
          ],
          as: 'pools',
        },
      },

      // Calculate trending metrics
      {
        $addFields: {
          // Pool count and liquidity data
          poolCount: { $size: '$pools' },
          totalLiquidity: {
            $sum: '$pools.poolStats.liquidity',
          },
          totalVolume24h: {
            $sum: '$pools.poolStats.dailyVolume0', // Approximate volume
          },

          // Floor price from Reservoir/market data
          floorPrice: {
            $ifNull: ['$marketData.floorPrice', 0],
          },

          // Volume change calculation (placeholder)
          volumeChange24h: {
            $ifNull: ['$marketData.volumeChange24h', 0],
          },

          // Floor change calculation (placeholder)
          floorChange24h: {
            $ifNull: ['$marketData.floorChange24h', 0],
          },
        },
      },

      // Add ranking based on sort criteria
      {
        $addFields: {
          trendingScore: {
            $switch: {
              branches: [
                {
                  case: { $eq: [sortBy, 'volume24h'] },
                  then: '$totalVolume24h',
                },
                {
                  case: { $eq: [sortBy, 'floorPrice'] },
                  then: '$floorPrice',
                },
                {
                  case: { $eq: [sortBy, 'liquidityCount'] },
                  then: '$totalLiquidity',
                },
              ],
              default: '$totalVolume24h',
            },
          },
        },
      },

      // Sort by trending score
      {
        $sort: {
          trendingScore: sortOrder === 'desc' ? -1 : 1,
          totalLiquidity: -1, // Secondary sort by liquidity
          _id: 1, // Stable sort
        },
      },

      // Add ranking number
      {
        $setWindowFields: {
          sortBy: { trendingScore: sortOrder === 'desc' ? -1 : 1 },
          output: {
            rank: { $rank: {} },
          },
        },
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },

      // Project final structure
      {
        $project: {
          rank: 1,
          collection: {
            _id: '$_id',
            name: '$name',
            image: { $ifNull: ['$image', '/default-collection.png'] },
            verified: '$verified',
            address: '$address',
          },
          chain: {
            _id: '$chain._id',
            chainId: '$chain.chainId',
            name: '$chain.name',
            symbol: '$chain.symbol',
            icon: '$chain.icon',
          },
          liquidityPools: {
            icons: {
              $slice: [
                {
                  $map: {
                    input: '$pools',
                    as: 'pool',
                    in: {
                      $cond: {
                        if: { $eq: ['$$pool.token0.address', '$address'] },
                        then: '$$pool.token1.icon',
                        else: '$$pool.token0.icon',
                      },
                    },
                  },
                },
                3, // Limit to 3 icons
              ],
            },
            hasAddButton: { $lt: ['$poolCount', 1] },
            poolCount: '$poolCount',
          },
          floor: {
            value: {
              $toString: {
                $round: [{ $ifNull: ['$floorPrice', 0] }, 2],
              },
            },
            currency: '$chain.symbol',
            priceInUsd: { $ifNull: ['$marketData.floorPriceUsd', 0] },
          },
          floorChange: {
            $concat: [
              {
                $cond: {
                  if: { $gte: ['$floorChange24h', 0] },
                  then: '+',
                  else: '',
                },
              },
              { $toString: { $round: ['$floorChange24h', 1] } },
              '%',
            ],
          },
          volume: {
            value: {
              $toString: {
                $round: [{ $divide: ['$totalVolume24h', 1000] }, 1],
              },
            },
            currency: '$chain.symbol',
            volumeInUsd: { $ifNull: ['$marketData.volume24hUsd', 0] },
          },
          volumeChange: {
            $concat: [
              {
                $cond: {
                  if: { $gte: ['$volumeChange24h', 0] },
                  then: '+',
                  else: '',
                },
              },
              { $toString: { $round: ['$volumeChange24h', 1] } },
              '%',
            ],
          },
          items: {
            $toString: {
              $ifNull: ['$totalSupply', '0K'],
            },
          },
          marketStats: {
            totalSupply: { $ifNull: ['$totalSupply', 0] },
            ownersCount: { $ifNull: ['$marketData.ownersCount', 0] },
            listedCount: { $ifNull: ['$marketData.listedCount', 0] },
          },
          updatedAt: { $ifNull: ['$updatedAt', new Date()] },
        },
      },
    ]

    // Execute aggregation
    const [trendingCollections, totalCountResult] = await Promise.all([
      collectionsCollection.aggregate(pipeline).toArray(),
      collectionsCollection.aggregate([{ $match: matchStage }, { $count: 'total' }]).toArray(),
    ])

    const totalCount = totalCountResult[0]?.total || 0
    const totalPages = Math.ceil(totalCount / limit)

    // If no data, return mock data for development
    if (trendingCollections.length === 0) {
      console.log('📋 No trending collections found, returning mock data')
      const mockCollections = generateMockTrendingCollections(page, limit)

      return addCorsHeaders(NextResponse.json({
        success: true,
        data: mockCollections,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(100 / limit), // Mock total
          totalDocs: 100,
          hasNextPage: page < Math.ceil(100 / limit),
          hasPrevPage: page > 1,
        },
      }))
    }

    console.log(`✅ Found ${trendingCollections.length} trending collections`)

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: trendingCollections,
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

// Mock data generator for development
function generateMockTrendingCollections(page: number, limit: number): TrendingCollection[] {
  const mockNames = [
    'CryptoPunks',
    'Bored Ape Yacht Club',
    'Mutant Ape Yacht Club',
    'Mutant Hound Collars',
    'The Captainz',
    'Otherdeed for Otherside',
    'Bored Ape Kennel Club',
    'Art Blocks',
    'The Potatoz',
    'The Memes by 6529',
  ]

  const startRank = (page - 1) * limit + 1

  return Array.from({ length: Math.min(limit, mockNames.length) }, (_, i) => ({
    rank: startRank + i,
    collection: {
      _id: `mock-collection-${startRank + i}`,
      name: mockNames[i % mockNames.length],
      image: `/rectangle-2-${(i % 2) + 1}.png`,
      verified: true,
      address: `0x${(startRank + i).toString(16).padStart(40, '0')}`,
    },
    chain: {
      _id: 'mock-chain-1',
      chainId: 137,
      name: 'Polygon',
      symbol: 'MATIC',
      icon: '/crypto---polygon.svg',
    },
    liquidityPools: {
      icons: ['/crypto---polygon.svg', '/blockchain-icons.svg'],
      hasAddButton: Math.random() > 0.6,
      poolCount: Math.floor(Math.random() * 5),
    },
    floor: {
      value: (Math.random() * 100).toFixed(2),
      currency: 'MATIC',
      priceInUsd: Math.random() * 1000,
    },
    floorChange: `${(Math.random() * 100 - 50).toFixed(0)}%`,
    volume: {
      value: (Math.random() * 50000).toFixed(0),
      currency: 'MATIC',
      volumeInUsd: Math.random() * 100000,
    },
    volumeChange: `${(Math.random() * 200 - 100).toFixed(0)}%`,
    items: `${(Math.random() * 100).toFixed(1)}K`,
    marketStats: {
      totalSupply: Math.floor(Math.random() * 100000),
      ownersCount: Math.floor(Math.random() * 50000),
      listedCount: Math.floor(Math.random() * 10000),
    },
    updatedAt: new Date().toISOString(),
  }))
}
