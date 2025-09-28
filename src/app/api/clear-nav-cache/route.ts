import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST() {
  try {
    // Clear navigation cache
    revalidateTag('navigation');
    
    return NextResponse.json({ 
      message: 'Navigation cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json({ 
      message: 'Failed to clear navigation cache',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}