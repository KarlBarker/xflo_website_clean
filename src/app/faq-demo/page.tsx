import React from 'react';
import { FAQSection } from '@/components/blocks/faq-section';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getNavigationData, getFooterData } from '@/lib/navigation';
import { faqData } from '@/data/faq-data';

// Disable caching for demo page
export const revalidate = 0;

export default async function FAQDemoPage() {
  const [navigationData, footerData] = await Promise.all([
    getNavigationData(),
    getFooterData()
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <StickyNavigation navigationData={navigationData} />

      {/* Page Header */}
      <div className="bg-surface-primary py-24 md:py-32" data-nav-theme="dark">
        <div className="container-outer">
          <div className="text-center">
            <h1 className="title-6xl font-bold text-content-inverse mb-4">
              FAQ Demo Page
            </h1>
            <p className="text-xl text-content-inverse/80 max-w-2xl mx-auto">
              This is a demo of the FAQ accordion component built with shadcn/ui and the xFlo design system.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section - Categories Layout */}
      <FAQSection
        title={faqData.title}
        subtitle={faqData.subtitle}
        categories={faqData.categories}
        backgroundColor="white"
        layout="categories"
        spacingTop="section"
        spacingBottom="section"
      />

      {/* Alternative Dark Background Example */}
      <div className="bg-surface-tertiary py-12">
        <div className="container-outer">
          <div className="text-center">
            <h2 className="title-4xl font-semibold text-content-primary mb-4">
              Alternative Styling
            </h2>
            <p className="text-lg text-content-secondary max-w-2xl mx-auto">
              The FAQ component supports different backgrounds and layouts. Below is a single-column layout on a light background.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section - Single Column Layout (first category only as example) */}
      <FAQSection
        title="Platform & Technology"
        categories={[faqData.categories[0]]}
        backgroundColor="white"
        layout="single-column"
        spacingTop="section"
        spacingBottom="section"
      />

      {/* Dark Background Example */}
      <FAQSection
        title="Dark Background Example"
        subtitle="The component adapts to dark backgrounds automatically"
        categories={[faqData.categories[1]]}
        backgroundColor="primary"
        layout="categories"
        spacingTop="section"
        spacingBottom="section"
      />

      <div className="relative z-10" data-nav-theme="dark">
        <CMSFooter footerData={footerData} />
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'FAQ Demo | XFlo Digital',
    description: 'Demo page showcasing the FAQ accordion component',
  };
}
