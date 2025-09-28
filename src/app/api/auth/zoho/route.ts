import { NextResponse } from 'next/server';

export async function GET() {
  // Use hardcoded values temporarily to avoid environment variable encoding issues
  const clientId = '1000.QT23C4V2P476ZFW6MO10WUFEXS9E4B';
  const redirectUri = 'https://r3website-sigma.vercel.app/api/auth/callback';
  const scopes = 'ZohoBigin.modules.leads.CREATE,ZohoBigin.modules.leads.WRITE,ZohoBigin.modules.contacts.CREATE,ZohoBigin.modules.contacts.WRITE';

  if (!clientId || !redirectUri) {
    return NextResponse.json({
      error: 'Zoho configuration missing. Check ZOHO_CLIENT_ID and ZOHO_REDIRECT_URI environment variables.'
    }, { status: 500 });
  }

  // Build authorization URL
  const authUrl = new URL('https://accounts.zoho.eu/oauth/v2/auth');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('access_type', 'offline'); // To get refresh token
  authUrl.searchParams.set('state', 'security_token_' + Date.now()); // CSRF protection

  return NextResponse.redirect(authUrl.toString());
}