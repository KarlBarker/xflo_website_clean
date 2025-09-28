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
      grant_type: 'refresh_token',
      scope: 'ZohoBigin.settings.fields.READ,ZohoBigin.modules.contacts.CREATE,ZohoBigin.modules.contacts.WRITE'
    })
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
  }

  // Get fields metadata
  const fieldsResponse = await fetch('https://www.zohoapis.eu/bigin/v1/settings/fields?module=Contacts', {
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    }
  });

  const fieldsData = await fieldsResponse.json();

  // Filter for custom fields and important fields
  const customFields = fieldsData.fields?.filter((field: any) =>
    field.custom_field === true ||
    field.field_label === 'Budget' ||
    field.field_label === 'Form_message' ||
    field.field_label.includes('Budget') ||
    field.field_label.includes('Form')
  );

  return NextResponse.json({
    customFields: customFields?.map((field: any) => ({
      label: field.field_label,
      api_name: field.api_name,
      data_type: field.data_type,
      custom: field.custom_field
    })),
    allFieldNames: fieldsData.fields?.map((f: any) => ({
      label: f.field_label,
      api: f.api_name
    }))
  });
}