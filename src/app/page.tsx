import React from 'react';
import { notFound } from 'next/navigation';
import { DynamicPage } from '@/components/layouts/dynamic-page';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getPageBySlug } from '@/lib/payload';
import { getNavigationData, getFooterData } from '@/lib/navigation';
import { cn } from '@/lib/utils';

// Enable ISR with on-demand revalidation via webhooks
// No caching in development/staging for instant CMS updates
export const revalidate = process.env.NODE_ENV === 'production' ? 3600 : 0;

// Generate static params to ensure homepage is pre-generated
export async function generateStaticParams() {
  // Homepage doesn't need dynamic params, but this ensures it's pre-generated
  return [];
}

export default async function HomePage() {
  // Homepage uses '/home' slug from CMS
  const [pageData, navigationData, footerData] = await Promise.all([
    getPageBySlug('/home'),
    getNavigationData(),
    getFooterData()
  ]);

  if (!pageData) {
    console.error('Homepage not found in CMS with slug: /home');
    notFound();
  }


  // Get page background color from CMS
  const bgClass = pageData.backgroundColor === 'dark' ? 'bg-surface-primary' : '';
  const navTheme = pageData.backgroundColor === 'dark' ? 'dark' : 'light';

  return (
    <div className={cn("flex flex-col min-h-screen relative", bgClass)} data-nav-theme={navTheme}>
      <StickyNavigation navigationData={navigationData} />
      <DynamicPage page={pageData} />
      <div className="relative z-10" data-nav-theme="dark">
        <CMSFooter footerData={footerData} />
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata() {
  const page = await getPageBySlug('/home');
  
  if (!page) {
    return {
      title: 'Home | XFlo Digital',
      description: 'XFlo Digital - Data-driven digital marketing agency'
    };
  }

  return {
    title: page.meta_title || page.title || 'Home | XFlo Digital',
    description: page.meta_description || 'XFlo Digital - Data-driven digital marketing agency',
    openGraph: page.meta_image ? {
      images: [page.meta_image],
    } : undefined,
  };
}