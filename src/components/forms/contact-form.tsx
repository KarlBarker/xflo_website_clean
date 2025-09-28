'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ContactFormData } from '@/types/contact';

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    inquiryType: 'new-business',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    message: '',
    budget: '',
    timeline: '',
    position: '',
    linkedinUrl: '',
    privacyConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: value as 'new-business' | 'recruitment' | 'general'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      let endpoint = '';

      if (formData.inquiryType === 'new-business') {
        endpoint = '/api/submit-lead';
      } else {
        endpoint = '/api/send-email';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          inquiryType: 'new-business',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          jobTitle: '',
          message: '',
          budget: '',
          timeline: '',
          position: '',
          linkedinUrl: '',
          privacyConsent: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
        <Tabs value={formData.inquiryType} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="new-business">
              New Business
            </TabsTrigger>
            <TabsTrigger value="recruitment">
              Join Our Team
            </TabsTrigger>
            <TabsTrigger value="general">
              General Inquiry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-business" className="space-y-8">
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-8">
          </TabsContent>

          <TabsContent value="general" className="space-y-8">
          </TabsContent>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-content-primary">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-content-primary">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-content-primary">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Company - Hide for recruitment */}
            {formData.inquiryType !== 'recruitment' && (
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-content-primary">
                  Company {formData.inquiryType === 'new-business' && '*'}
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full"
                  required={formData.inquiryType === 'new-business'}
                />
              </div>
            )}

            {/* Job Title - Show for recruitment */}
            {formData.inquiryType === 'recruitment' && (
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium text-content-primary">
                  Current Role/Title
                </Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="e.g., Senior Developer, Marketing Manager"
                />
              </div>
            )}

            {/* Position of Interest - Show for recruitment */}
            {formData.inquiryType === 'recruitment' && (
              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium text-content-primary">
                  Position of Interest
                </Label>
                <Input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position || ''}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Which role are you interested in?"
                />
              </div>
            )}

            {/* LinkedIn Profile - Show for recruitment */}
            {formData.inquiryType === 'recruitment' && (
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="text-sm font-medium text-content-primary">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl || ''}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>
            )}

            {/* Phone - Optional for all */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-content-primary">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full"
                placeholder="Optional"
              />
            </div>

            {/* Budget (only show for new business) */}
            {formData.inquiryType === 'new-business' && (
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-medium text-content-primary">
                  Project Budget Range
                </Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under £10k">Under £10k</SelectItem>
                    <SelectItem value="£10k - £25k">£10k - £25k</SelectItem>
                    <SelectItem value="£25k - £50k">£25k - £50k</SelectItem>
                    <SelectItem value="£50k - £100k">£50k - £100k</SelectItem>
                    <SelectItem value="Over £100k">Over £100k</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-content-primary">
                Message *
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full resize-none placeholder:!text-neutral-400 placeholder:opacity-100"
                placeholder={
                  formData.inquiryType === 'new-business'
                    ? "Tell us about your project, goals, and how we can help..."
                    : formData.inquiryType === 'recruitment'
                    ? "Tell us about your experience, the role you&apos;re interested in, and what excites you about R3..."
                    : "How can we help you today?"
                }
                required
              />
            </div>

            {/* Privacy Consent */}
            <div className="flex items-start space-x-3">
              <input
                id="privacyConsent"
                name="privacyConsent"
                type="checkbox"
                checked={formData.privacyConsent}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  privacyConsent: e.target.checked
                }))}
                className="mt-1 h-4 w-4 text-content-primary border-neutral-300 rounded focus:ring-content-primary focus:ring-2"
                required
              />
              <Label htmlFor="privacyConsent" className="text-sm text-content-secondary leading-relaxed">
                I agree to the processing of my personal data in accordance with R3 Agency&apos;s{' '}
                <Link href="/privacy" className="text-content-primary underline hover:no-underline">
                  Privacy Policy
                </Link>
                . *
              </Label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.privacyConsent}
                variant="outline"
                className="w-full md:w-auto px-8 py-2 text-lg tracking-wide min-w-[240px] hover:bg-white hover:text-black cta-button-adaptive"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  <strong>Thank you for your message!</strong> We&apos;ve received your inquiry and will get back to you within 24 hours.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Something went wrong.</strong> Please try again or contact us directly at studio@r3.agency.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Tabs>
    </div>
  );
}