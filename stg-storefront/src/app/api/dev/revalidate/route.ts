import { NextRequest, NextResponse } from 'next/server'
import { forceRevalidateAll } from '@lib/data/dev-revalidate'

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    await forceRevalidateAll()

    return NextResponse.json({
      success: true,
      message: 'All caches revalidated',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error revalidating caches:', error)
    return NextResponse.json({
      error: 'Failed to revalidate caches'
    }, { status: 500 })
  }
}

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  return NextResponse.json({
    message: 'Development revalidation endpoint',
    usage: 'POST to force revalidate all caches',
    environment: process.env.NODE_ENV
  })
} 