import { NextResponse } from 'next/server'
import { listCategories } from '@lib/data/categories'

export async function GET() {
  try {
    const categories = await listCategories()
    
    return NextResponse.json({ 
      categories: categories || [],
      success: true 
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', success: false },
      { status: 500 }
    )
  }
} 