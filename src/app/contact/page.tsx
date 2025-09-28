import { Metadata } from 'next';
import { ContactForm } from '@/components/forms/contact-form';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getNavigationData, getFooterData } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'Contact Us | xFlo',
  description: 'Get in touch with xFlo for new business inquiries, recruitment opportunities, or general questions. We\'d love to hear from you.',
  openGraph: {
    title: 'Contact Us | xFlo',
    description: 'Get in touch with xFlo for new business inquiries, recruitment opportunities, or general questions.',
    type: 'website',
  },
};

export default async function ContactPage() {
  // Fetch navigation and footer data
  const [navigationData, footerData] = await Promise.all([
    getNavigationData(),
    getFooterData()
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-light" data-nav-theme="light">
      <StickyNavigation navigationData={navigationData} />

      {/* Hero Section */}
      <section className="bg-surface-light pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-inner">
          <h1 className="title-6xl font-black text-content-primary">
            Let's work together
          </h1>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-16 md:pb-24">
        <div className="container-inner">
          <ContactForm />
        </div>
      </section>

      <div className="relative z-10 mt-auto" data-nav-theme="dark">
        <CMSFooter footerData={footerData} />
      </div>
    </div>
  );
}