let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getValidAccessToken(): Promise<string | null> {
  // Check if we have a valid cached token
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  // Try to use the environment variable token first
  const envToken = process.env.ZOHO_ACCESS_TOKEN;
  if (envToken && !tokenExpiresAt) {
    // First time using env token, assume it's valid for 1 hour
    accessToken = envToken;
    tokenExpiresAt = Date.now() + 3600000; // 1 hour
    return accessToken;
  }

  // Need to refresh the token
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    console.error('Missing OAuth configuration for token refresh');
    return null;
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
      accessToken = data.access_token;
      // Set expiration to 55 minutes to refresh before actual expiry
      tokenExpiresAt = Date.now() + (55 * 60 * 1000);
      console.log('Successfully refreshed Zoho access token');
      return accessToken;
    } else {
      console.error('Failed to refresh token:', data);
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}