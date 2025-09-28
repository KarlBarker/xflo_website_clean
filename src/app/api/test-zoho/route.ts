import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test with the fresh token directly
    const accessToken = '1000.581f94315ac8bc935efd9a2ea1bac0cc.75718de1ce46217e4d10db785d648109';

    const testData = {
      data: [
        {
          First_Name: 'Test',
          Last_Name: 'Contact',
          Email: 'test@example.com',
          Company: 'Test Company',
          Lead_Source: 'API Test'
        }
      ]
    };

    console.log('Testing Zoho API with:', testData);

    const response = await fetch('https://www.zohoapis.eu/bigin/v2/Contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('Zoho response:', {
      status: response.status,
      result: result
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      result: result
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}