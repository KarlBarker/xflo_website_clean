import { NextResponse } from 'next/server';

export async function GET() {
  // Get fresh token
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  const tokenResponse = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken!,
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: 'refresh_token'
    })
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Get a contact to see all fields
  const contactsResponse = await fetch('https://www.zohoapis.eu/bigin/v2/Contacts?fields=All&per_page=1', {
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    }
  });

  const data = await contactsResponse.json();

  if (data.data && data.data[0]) {
    // Get all field names from the first contact
    const fieldNames = Object.keys(data.data[0]);

    // Look for custom fields (usually have different naming patterns)
    const customFields = fieldNames.filter(name =>
      name.includes('cf_') ||
      name.includes('Budget') ||
      name.includes('Form') ||
      name.includes('_')
    );

    return NextResponse.json({
      allFields: fieldNames,
      possibleCustomFields: customFields,
      sampleContact: data.data[0]
    });
  }

  return NextResponse.json({
    error: 'No contacts found',
    response: data
  });
}