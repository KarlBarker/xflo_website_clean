import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const location = searchParams.get('location');
  const accountsServer = searchParams.get('accounts-server');

  console.log('Callback received:', { code: code?.substring(0, 20) + '...', state, location, accountsServer });

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  // Return the code immediately for manual exchange
  return new Response(`
    <html>
      <head>
        <title>Authorization Code - XFlo Agency</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
          .container { max-width: 800px; margin: 0 auto; }
          .info { background: #e7f3ff; color: #0366d6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔑 Authorization Code Received</h1>

          <div class="info">
            <p><strong>Authorization Code:</strong></p>
            <pre>${code}</pre>

            <p><strong>State:</strong> ${state}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Accounts Server:</strong> ${accountsServer}</p>
          </div>

          <p>Use this code immediately to exchange for tokens via curl or Postman:</p>
          <pre>curl -X POST https://accounts.zoho.eu/oauth/v2/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code&client_id=1000.QT23C4V2P476ZFW6MO10WUFEXS9E4B&client_secret=428a25c47ee986ea723c014dd49cb03336a78a350e&redirect_uri=https://xflowebsite-sigma.vercel.app/api/auth/callback&code=${code}"</pre>
        </div>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });

  try {
    // Exchange code for tokens (keeping this for later)
    const tokenResponse = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: '1000.QT23C4V2P476ZFW6MO10WUFEXS9E4B',
        client_secret: '428a25c47ee986ea723c014dd49cb03336a78a350e',
        redirect_uri: 'https://xflowebsite-sigma.vercel.app/api/auth/callback',
        code: code,
      }),
    });

    const tokens = await tokenResponse.json();

    // Log detailed response for debugging
    console.log('Token response status:', tokenResponse.status);
    console.log('Token response:', tokens);

    if (!tokenResponse.ok || tokens.error) {
      console.error('Token exchange error:', {
        status: tokenResponse.status,
        response: tokens,
        url: tokenResponse.url
      });
      return NextResponse.json({
        error: 'Failed to exchange code for tokens',
        details: tokens.error || `HTTP ${tokenResponse.status}`,
        zohoError: tokens
      }, { status: 400 });
    }

    // IMPORTANT: Log these tokens - you'll need to add the access_token to your environment variables
    console.log('=== IMPORTANT: SAVE THESE TOKENS ===');
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Expires in:', tokens.expires_in, 'seconds');

    // Return success page
    return new Response(`
      <html>
        <head>
          <title>OAuth Success - R3 Agency</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .success { background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .warning { background: #fff3cd; color: #856404; padding: 20px; border-radius: 8px; margin: 20px 0; }
            pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
            .token { word-break: break-all; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 Zoho OAuth Success!</h1>

            <div class="success">
              <strong>✅ Successfully authenticated with Zoho Bigin</strong>
              <p>Your access tokens have been generated and logged to the server console.</p>
            </div>

            <div class="warning">
              <h3>⚠️ Next Steps Required:</h3>
              <ol>
                <li>Copy the access token below</li>
                <li>Add it to your environment variables as <code>ZOHO_ACCESS_TOKEN</code></li>
                <li>Deploy the changes to enable CRM integration</li>
              </ol>
            </div>

            <h3>Access Token (copy this):</h3>
            <pre class="token">${tokens.access_token}</pre>

            <h3>Refresh Token (save for later):</h3>
            <pre class="token">${tokens.refresh_token}</pre>

            <p><small>This token expires in ${tokens.expires_in} seconds (${Math.floor(tokens.expires_in / 3600)} hours)</small></p>

            <hr style="margin: 40px 0;">
            <p><strong>Security Note:</strong> These tokens provide access to your Zoho CRM. Keep them secure and never share them publicly.</p>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}