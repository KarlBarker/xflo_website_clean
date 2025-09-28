import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

    if (!accessToken) {
      return NextResponse.json({
        error: 'Failed to get access token'
      }, { status: 500 });
    }

    // Get fields for Contacts module
    const response = await fetch('https://www.zohoapis.eu/bigin/v2/settings/fields?module=Contacts', {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      // Extract field names and types
      const fields = data.fields?.map((field: any) => ({
        api_name: field.api_name,
        display_label: field.field_label,
        data_type: field.data_type,
        mandatory: field.system_mandatory || false,
        custom_field: field.custom_field || false
      }));

      return NextResponse.json({
        success: true,
        fields: fields,
        total: fields?.length || 0
      });
    } else {
      return NextResponse.json({
        error: 'Failed to fetch fields',
        details: data
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching fields:', error);
    return NextResponse.json({
      error: 'Server error'
    }, { status: 500 });
  }
}