import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/auth'

// GET /api/location - Get user's active location
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const location = await prisma.location.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({ location })
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 })
  }
}

// POST /api/location - Save/update user location
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { latitude, longitude } = await request.json()

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
    }

    // Deactivate existing locations for this user
    await prisma.location.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    })

    // Create new active location
    const location = await prisma.location.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId,
        isActive: true,
      },
    })

    return NextResponse.json({ location })
  } catch (error) {
    console.error('Error saving location:', error)
    return NextResponse.json({ error: 'Failed to save location' }, { status: 500 })
  }
}

// DELETE /api/location - Clear user location
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.location.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing location:', error)
    return NextResponse.json({ error: 'Failed to clear location' }, { status: 500 })
  }
}