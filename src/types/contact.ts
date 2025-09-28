export interface ContactFormData {
  inquiryType: 'new-business' | 'recruitment' | 'general';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  message: string;

  // Business inquiry specific
  budget?: string;
  timeline?: string;

  // Recruitment specific
  position?: string;
  linkedinUrl?: string;

  // Required
  privacyConsent: boolean;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  contactId?: string;
}

export interface ContactFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  message?: string;
  privacyConsent?: string;
}