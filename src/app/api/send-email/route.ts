import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkRateLimit } from '@/lib/rate-limiter';
import { validateContactForm, sanitizeFormData } from '@/lib/validation';

interface EmailInquiry {
  inquiryType: 'recruitment' | 'general';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  message: string;
  position?: string; // For recruitment
  linkedinUrl?: string; // For recruitment
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

    // 3. Sanitize input
    const formData: EmailInquiry = sanitizeFormData(rawData);

    // Only process non-business inquiries
    if (formData.inquiryType === 'new-business') {
      return NextResponse.json({
        success: false,
        message: 'Business inquiries should use the CRM endpoint'
      }, { status: 400 });
    }

    // Validate required environment variables
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_EMAIL', 'SMTP_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error('Missing SMTP configuration:', missingVars);
      return NextResponse.json({
        success: false,
        message: 'Email service not configured. Please contact us directly.'
      }, { status: 500 });
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Determine recipient based on inquiry type
    const recipients = {
      recruitment: process.env.RECRUITMENT_EMAIL || 'careers@xflo.agency',
      general: process.env.GENERAL_EMAIL || 'studio@xflo.agency'
    };

    const recipient = recipients[formData.inquiryType];
    const subject = formData.inquiryType === 'recruitment'
      ? `New Job Application - ${formData.position || 'General Position'}`
      : 'New General Inquiry from Website';

    // Format email content
    const emailContent = formatEmailContent(formData);

    // Send email
    const info = await transporter.sendMail({
      from: `"R3 Agency Website" <${process.env.SMTP_EMAIL}>`,
      to: recipient,
      subject: subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: `${formData.firstName} ${formData.lastName} <${formData.email}>`,
    });

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      recipient: recipient,
      inquiryType: formData.inquiryType,
      from: formData.email
    });

    return NextResponse.json({
      success: true,
      message: formData.inquiryType === 'recruitment'
        ? 'Thank you for your application! We\'ll review it and get back to you soon.'
        : 'Thank you for your inquiry! We\'ll get back to you as soon as possible.'
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send your message. Please try again or contact us directly.'
    }, { status: 500 });
  }
}

function formatEmailContent(formData: EmailInquiry) {
  const isRecruitment = formData.inquiryType === 'recruitment';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #e32b35 0%, #171717 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">
          ${isRecruitment ? '🚀 New Job Application' : '💬 New General Inquiry'}
        </h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">R3 Agency Website Contact Form</p>
      </div>

      <!-- Contact Information -->
      <div style="background: #f8f9fa; padding: 25px; margin: 0; border-left: 4px solid #e32b35;">
        <h2 style="margin-top: 0; color: #495057; font-size: 18px;">📞 Contact Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 600; width: 120px;">Name:</td><td style="padding: 8px 0;">${formData.firstName} ${formData.lastName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${formData.email}" style="color: #e32b35; text-decoration: none;">${formData.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Phone:</td><td style="padding: 8px 0;">${formData.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Company:</td><td style="padding: 8px 0;">${formData.company || 'Not provided'}</td></tr>
          ${formData.jobTitle ? `<tr><td style="padding: 8px 0; font-weight: 600;">Job Title:</td><td style="padding: 8px 0;">${formData.jobTitle}</td></tr>` : ''}
        </table>
      </div>

      ${isRecruitment ? `
        <!-- Application Details -->
        <div style="background: #fff5f5; padding: 25px; margin: 0; border-left: 4px solid #e32b35;">
          <h2 style="margin-top: 0; color: #e32b35; font-size: 18px;">💼 Application Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${formData.position ? `<tr><td style="padding: 8px 0; font-weight: 600; width: 120px;">Position:</td><td style="padding: 8px 0;">${formData.position}</td></tr>` : ''}
            ${formData.linkedinUrl ? `<tr><td style="padding: 8px 0; font-weight: 600;">LinkedIn:</td><td style="padding: 8px 0;"><a href="${formData.linkedinUrl}" style="color: #e32b35; text-decoration: none;">${formData.linkedinUrl}</a></td></tr>` : ''}
          </table>
        </div>
      ` : ''}

      <!-- Message -->
      <div style="background: #fff; padding: 25px; margin: 0; border: 1px solid #dee2e6; border-top: none;">
        <h2 style="margin-top: 0; color: #495057; font-size: 18px;">
          ${isRecruitment ? '✨ Cover Letter / Why They\'d Be a Great Fit:' : '💬 Message:'}
        </h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.8; border-left: 4px solid #e32b35;">
          ${formData.message}
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
        <p style="margin: 0 0 8px;">📅 Submitted via R3 Agency website on ${new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p style="margin: 0;"><strong>Privacy consent:</strong> ${formData.privacyConsent ? '✅ Yes' : '❌ No'}</p>
      </div>
    </div>
  `;

  const text = `
NEW ${isRecruitment ? 'JOB APPLICATION' : 'GENERAL INQUIRY'} - R3 AGENCY

CONTACT INFORMATION:
═══════════════════
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}${formData.jobTitle ? `
Job Title: ${formData.jobTitle}` : ''}

${isRecruitment && (formData.position || formData.linkedinUrl) ? `
APPLICATION DETAILS:
══════════════════${formData.position ? `
Position of Interest: ${formData.position}` : ''}${formData.linkedinUrl ? `
LinkedIn Profile: ${formData.linkedinUrl}` : ''}
` : ''}

${isRecruitment ? 'COVER LETTER / WHY THEY\'D BE A GREAT FIT:' : 'MESSAGE:'}
${'═'.repeat(50)}
${formData.message}

${'═'.repeat(50)}
Submitted via R3 Agency website on ${new Date().toLocaleString('en-GB')}
Privacy consent: ${formData.privacyConsent ? 'Yes' : 'No'}

Reply directly to this email to respond to ${formData.firstName}.
  `;

  return { html, text };
}