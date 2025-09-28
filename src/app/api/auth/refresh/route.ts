import { NextResponse } from 'next/server';

export async function GET() {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    return NextResponse.json({
      error: 'Missing required OAuth configuration'
    }, { status: 500 });
  }

  try {
    const tokenUrl = 'https://accounts.zoho.eu/oauth/v2/token';
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token'
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      console.log('Successfully refreshed access token');
      console.log('New access token:', data.access_token);
      console.log('Add this to your .env.local as ZOHO_ACCESS_TOKEN');

      return NextResponse.json({
        success: true,
        message: 'Token refreshed successfully',
        access_token: data.access_token,
        expires_in: data.expires_in
      });
    } else {
      console.error('Failed to refresh token:', data);
      return NextResponse.json({
        error: 'Failed to refresh token',
        details: data
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({
      error: 'Server error refreshing token'
    }, { status: 500 });
  }
}