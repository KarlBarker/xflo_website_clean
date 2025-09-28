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

  // Test different field name patterns
  const testData = {
    data: [
      {
        First_Name: 'Field',
        Last_Name: 'Test',
        Email: `fieldtest${Date.now()}@test.com`,
        Company: 'Field Test Co',
        Lead_Source: 'API Test',
        Description: 'Testing field names',
        // Try different patterns for custom fields
        'Project_Budget': 'Test Budget 1',
        'cf_Project_Budget': 'Test Budget 2',
        'Project_Spend': 'Test Budget 3',
        'cf_project_spend': 'Test Budget 4',
      }
    ]
  };

  const response = await fetch('https://www.zohoapis.eu/bigin/v2/Contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData),
  });

  const result = await response.json();

  return NextResponse.json({
    status: response.status,
    result: result,
    note: 'Check which fields were accepted in Zoho Bigin'
  });
}