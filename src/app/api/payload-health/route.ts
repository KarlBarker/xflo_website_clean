import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/constants';

export async function GET() {
  try {
    // Test connection to Payload CMS
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/access`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Payload health check failed: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      status: 'healthy',
      payloadUrl: API_CONFIG.PAYLOAD_URL,
      timestamp: new Date().toISOString(),
      payload: data
    });
  } catch (error) {
    console.error('Payload health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        payloadUrl: API_CONFIG.PAYLOAD_URL,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}