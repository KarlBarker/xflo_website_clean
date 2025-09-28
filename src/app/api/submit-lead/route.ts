import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { validateContactForm, sanitizeFormData } from '@/lib/validation';
import { verifyRecaptcha } from '@/lib/recaptcha';

async function refreshZohoToken(): Promise<string | null> {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    console.error('Missing OAuth configuration for token refresh');
    return null;
  }

  try {
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token'
    });

    const response = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      console.log('Successfully refreshed Zoho access token');
      return data.access_token;
    } else {
      console.error('Failed to refresh token:', data);
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

interface BusinessInquiry {
  inquiryType: 'new-business';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  message: string;
  budget?: string;
  timeline?: string;
  privacyConsent: boolean;
}

export async function POST(request: Request) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    const rawData = await request.json();

    // 1. Check rate limit
    const rateCheck = checkRateLimit(ip + ':' + rawData.email);
    if (!rateCheck.allowed) {
      return NextResponse.json({
        success: false,
        message: rateCheck.message || 'Too many requests. Please try again later.'
      }, { status: 429 });
    }

    // 2. Validate form data
    const validation = validateContactForm(rawData);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid form data',
        errors: validation.errors
      }, { status: 400 });
    }

    // 3. Verify reCAPTCHA (if token provided)
    if (rawData.recaptchaToken) {
      const recaptchaValid = await verifyRecaptcha(rawData.recaptchaToken);
      if (!recaptchaValid) {
        return NextResponse.json({
          success: false,
          message: 'Security verification failed. Please try again.'
        }, { status: 400 });
      }
    }

    // 4. Sanitize input
    const formData: BusinessInquiry = sanitizeFormData(rawData);
    console.log('Sanitized form data:', formData);

    // Only process if it's a new business inquiry
    if (formData.inquiryType !== 'new-business') {
      return NextResponse.json({
        success: false,
        message: 'This endpoint is only for business inquiries'
      }, { status: 400 });
    }

    // Always try to get a fresh token through refresh
    const accessToken = await refreshZohoToken();

    if (!accessToken) {
      console.error('Failed to get valid Zoho access token.');
      return NextResponse.json({
        success: false,
        message: 'CRM integration not configured. Please contact support.'
      }, { status: 500 });
    }

    // Complete data with message and budget in Description
    const biginData = {
      data: [
        {
          First_Name: formData.firstName,
          Last_Name: formData.lastName,
          Email: formData.email,
          Company: formData.company,
          Lead_Source: 'Website Form',
          Description: formData.message, // Keep as backup
          Budget: formData.budget || '',  // Your custom Budget field (from CSV)
          Form_message: formData.message  // Your custom Form_message field (from CSV)
        }
      ]
    };

    // Log what we're sending
    console.log('Sending to Zoho Bigin:', {
      url: 'https://www.zohoapis.eu/bigin/v2/Contacts',
      data: biginData,
      token: accessToken ? `${accessToken.substring(0, 20)}...` : 'NO_TOKEN'
    });

    // Submit to Zoho Bigin
    const biginResponse = await fetch('https://www.zohoapis.eu/bigin/v2/Contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(biginData),
    });

    const result = await biginResponse.json();

    console.log('Zoho API response:', {
      status: biginResponse.status,
      statusText: biginResponse.statusText,
      headers: Object.fromEntries(biginResponse.headers.entries()),
      body: result
    });

    if (biginResponse.ok && result.data && result.data[0].status === 'success') {
      console.log('Successfully submitted lead to Zoho Bigin:', {
        contactId: result.data[0].details.id,
        email: formData.email,
        company: formData.company
      });

      return NextResponse.json({
        success: true,
        message: 'Thank you for your business inquiry! We\'ll be in touch soon.',
        contactId: result.data[0].details.id
      });
    } else {
      // Check if it's a duplicate error
      if (result.data && result.data[0]?.code === 'DUPLICATE_DATA') {
        const duplicateId = result.data[0].details.duplicate_record.id;
        console.log('Contact already exists, adding note to existing contact:', duplicateId);

        // For now, treat duplicate as success - they're already in the system
        return NextResponse.json({
          success: true,
          message: 'Thank you for reaching out again! We have your information and will be in touch soon.',
          contactId: duplicateId,
          updated: true
        });
      }

      console.error('Bigin API error:', {
        status: biginResponse.status,
        statusText: biginResponse.statusText,
        result: result
      });
      return NextResponse.json({
        success: false,
        message: 'We encountered an issue submitting your inquiry. Please try again or contact us directly.',
        error: result, // Always show error for debugging
        sentData: biginData // Show what we tried to send
      }, { status: 400 });
    }

  } catch (error) {
    console.error('CRM submission error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error. Please try again later or contact us directly.'
    }, { status: 500 });
  }
}