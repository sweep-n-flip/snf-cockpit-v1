import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { dataDb } from './connection'

interface GenericGetOptions {
  collectionName: string
  defaultLimit?: number
  allowedFilters?: string[]
  searchFields?: string[]
  defaultSort?: any
}

export async function createGenericGetEndpoint(options: GenericGetOptions) {
  return async function GET(request: NextRequest) {
    try {
      const db = await dataDb.connect()
      const collection = db.collection(options.collectionName)
      const { searchParams } = new URL(request.url)

      // Parse query parameters
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || options.defaultLimit?.toString() || '20')
      const search = searchParams.get('search')

      // Build MongoDB filter
      const filter: any = {}

      // Handle allowed filters
      if (options.allowedFilters) {
        options.allowedFilters.forEach((filterKey) => {
          const value = searchParams.get(filterKey)
          if (value !== null && value !== undefined) {
            // Handle boolean filters
            if (value === 'true' || value === 'false') {
              filter[filterKey] = value === 'true'
            }
            // Handle numeric filters
            else if (!isNaN(parseInt(value))) {
              filter[filterKey] = parseInt(value)
            }
            // Handle string filters
            else {
              filter[filterKey] = value
            }
          }
        })
      }

      // Handle search across multiple fields
      if (search && options.searchFields) {
        filter.$or = options.searchFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        }))
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit

      // Build sort
      const sort = options.defaultSort || { createdAt: -1 }

      // Execute MongoDB queries
      const [documents, totalCount] = await Promise.all([
        collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
        collection.countDocuments(filter),
      ])

      const totalPages = Math.ceil(totalCount / limit)

      return NextResponse.json({
        success: true,
        data: documents,
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
      console.error(`Error fetching ${options.collectionName}:`, error)
      return NextResponse.json(
        { success: false, error: `Failed to fetch ${options.collectionName}` },
        { status: 500 },
      )
    }
  }
}

export async function createGenericPostEndpoint(collectionName: string) {
  return async function POST(request: NextRequest) {
    try {
      const db = await dataDb.connect()
      const collection = db.collection(collectionName)
      const body = await request.json()

      // Add timestamps
      const now = new Date()
      const documentData = {
        ...body,
        createdAt: now,
        updatedAt: now,
      }

      const result = await collection.insertOne(documentData)

      return NextResponse.json({
        success: true,
        data: { ...documentData, _id: result.insertedId },
      })
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error)
      return NextResponse.json(
        { success: false, error: `Failed to create ${collectionName}` },
        { status: 500 },
      )
    }
  }
}

export async function createGenericByIdEndpoints(collectionName: string) {
  const GET = async function (request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const db = await dataDb.connect()
      const collection = db.collection(collectionName)
      const { id } = params

      const result = await collection.findOne({ _id: new ObjectId(id) })

      if (!result) {
        return NextResponse.json(
          { success: false, error: `${collectionName} not found` },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error)
      return NextResponse.json(
        { success: false, error: `${collectionName} not found` },
        { status: 404 },
      )
    }
  }

  const PUT = async function (request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const db = await dataDb.connect()
      const collection = db.collection(collectionName)
      const { id } = params
      const body = await request.json()

      const updateData = {
        ...body,
        updatedAt: new Date(),
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' },
      )

      if (!result.value) {
        return NextResponse.json(
          { success: false, error: `${collectionName} not found` },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        data: result.value,
      })
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error)
      return NextResponse.json(
        { success: false, error: `Failed to update ${collectionName}` },
        { status: 500 },
      )
    }
  }

  const DELETE = async function (request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const db = await dataDb.connect()
      const collection = db.collection(collectionName)
      const { id } = params

      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { success: false, error: `${collectionName} not found` },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        message: `${collectionName} deleted successfully`,
      })
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error)
      return NextResponse.json(
        { success: false, error: `Failed to delete ${collectionName}` },
        { status: 500 },
      )
    }
  }

  return { GET, PUT, DELETE }
}
