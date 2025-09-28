import DOMPurify from 'isomorphic-dompurify';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

// Honeypot field names that bots might fill
const HONEYPOT_FIELDS = ['website', 'url', 'fax', 'address'];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateContactForm(data: any): ValidationResult {
  const errors: string[] = [];

  // Check for honeypot fields (invisible to users, filled by bots)
  for (const field of HONEYPOT_FIELDS) {
    if (data[field]) {
      return { isValid: false, errors: ['Invalid submission detected'] };
    }
  }

  // Required fields
  if (!data.firstName?.trim()) errors.push('First name is required');
  if (!data.lastName?.trim()) errors.push('Last name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.message?.trim()) errors.push('Message is required');
  if (!data.privacyConsent) errors.push('Privacy consent is required');

  // Field length limits
  if (data.firstName?.length > 50) errors.push('First name too long');
  if (data.lastName?.length > 50) errors.push('Last name too long');
  if (data.company?.length > 100) errors.push('Company name too long');
  if (data.message?.length > 2000) errors.push('Message too long (max 2000 characters)');
  if (data.message?.length < 10) errors.push('Message too short (min 10 characters)');

  // Email validation
  if (data.email && !EMAIL_REGEX.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (if provided)
  if (data.phone && !PHONE_REGEX.test(data.phone)) {
    errors.push('Invalid phone format');
  }

  // Check for suspicious patterns (all caps, excessive punctuation)
  const suspiciousPatterns = [
    /^[A-Z\s]{50,}$/, // All caps
    /(.)\1{5,}/, // Repeated characters
    /https?:\/\//i, // URLs in message (optional - may want to allow)
    /<script|<iframe|javascript:|onclick|onerror/i, // XSS attempts
  ];

  if (data.message) {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(data.message)) {
        errors.push('Message contains suspicious content');
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  // Remove HTML tags and dangerous content
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }).trim();
}

export function sanitizeFormData(data: any): any {
  const sanitized: any = {};

  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeInput(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
}