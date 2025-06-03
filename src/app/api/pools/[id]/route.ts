import { dataDb } from '@/lib/services/data-db/connection'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await dataDb.connect()
    const poolsCollection = db.collection('pools')
    const { id } = params

    const result = await poolsCollection.findOne({ _id: new ObjectId(id) })

    if (!result) {
      return NextResponse.json({ success: false, error: 'Pool not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching pool:', error)
    return NextResponse.json({ success: false, error: 'Pool not found' }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await dataDb.connect()
    const poolsCollection = db.collection('pools')
    const { id } = params
    const body = await request.json()

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await poolsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' },
    )

    if (!result.value) {
      return NextResponse.json({ success: false, error: 'Pool not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result.value,
    })
  } catch (error) {
    console.error('Error updating pool:', error)
    return NextResponse.json({ success: false, error: 'Failed to update pool' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await dataDb.connect()
    const poolsCollection = db.collection('pools')
    const { id } = params

    const result = await poolsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Pool not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Pool deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting pool:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete pool' }, { status: 500 })
  }
}
