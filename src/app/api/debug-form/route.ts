import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log('Raw form data received:', formData);

    // Just echo back what we received
    return NextResponse.json({
      success: true,
      received: formData,
      message: 'Debug: form data received successfully'
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}