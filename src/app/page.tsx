import React from 'react';
import { notFound } from 'next/navigation';
import { DynamicPage } from '@/components/layouts/dynamic-page';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getPageBySlug } from '@/lib/payload';
import { getNavigationData, getFooterData } from '@/lib/navigation';
import { cn } from '@/lib/utils';

// Enable ISR with on-demand revalidation via webhooks
// Set to 0 for instant updates (use environment variable for production caching)
export const revalidate = 0; // No caching - instant updates from CMS

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
      title: 'Home | xFlo.ai',
      description: 'xFlo.ai - AI transformation platform'
    };
  }

  // Support both new nested format (page.meta.title) and legacy flat format (page.meta_title)
  const title = page.meta?.title || page.meta_title || page.title || 'Home | xFlo.ai';
  const description = page.meta?.description || page.meta_description || 'xFlo.ai - AI transformation platform';
  const image = page.meta?.image || page.meta_image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{
        url: typeof image === 'string' ? image : image.url,
        alt: typeof image === 'object' ? image.alt : title
      }] : [],
    },
  };
}