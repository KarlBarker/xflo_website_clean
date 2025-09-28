import React from 'react';
import { notFound } from 'next/navigation';
import { DynamicPage } from '@/components/layouts/dynamic-page';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getPageBySlug, type Page } from '@/lib/payload';
import { getNavigationData, getFooterData } from '@/lib/navigation';
import { generatePageMetadata } from '@/components/seo/page-metadata';
import { cn } from '@/lib/utils';
import { API_CONFIG } from '@/config/constants';

// Enable ISR with on-demand revalidation via webhooks
export const revalidate = 0; // Force dynamic rendering for now

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  // Join the slug array to create the full path with leading slash
  const fullSlug = `/${slug.join('/')}`;

  // Exclude specific routes that have their own page components
  const excludedRoutes = [
    '/terms-and-conditions',
    '/privacy-policy',
    '/contact',
    '/about',
    '/careers'
  ];

  if (excludedRoutes.includes(fullSlug)) {
    console.log(`Route ${fullSlug} excluded from catch-all, passing to specific route`);
    notFound(); // This will let Next.js handle the specific route
  }

  const [pageData, navigationData, footerData] = await Promise.all([
    getPageBySlug(fullSlug),
    getNavigationData(),
    getFooterData()
  ]);

  // If no page found, return 404
  if (!pageData) {
    console.error(`Page not found with slug: ${fullSlug}`);
    notFound();
  }

  // Debug logging for page data
  console.log(`Page found: ${pageData.title}`);
  console.log(`Page blocks count: ${pageData.layout?.length || 0}`);
  console.log(`Page blocks:`, pageData.layout?.map(block => block.blockType) || []);

  // Get page background color from CMS
  const bgClass = pageData.backgroundColor === 'dark' ? 'bg-surface-primary' : '';
  const navTheme = pageData.backgroundColor === 'dark' ? 'dark' : 'light';

  return (
    <div className={cn("flex flex-col min-h-screen relative", bgClass)} data-nav-theme={navTheme}>
      {/* Sticky Navigation */}
      <StickyNavigation navigationData={navigationData} />
      
      {/* CMS-Driven Page Content */}
      <DynamicPage page={pageData} />
      
      {/* Footer */}
      <div className="relative z-10" data-nav-theme="dark">
        <CMSFooter footerData={footerData} />
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = `/${slug.join('/')}`;
  const page = await getPageBySlug(fullSlug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  }

  return generatePageMetadata(page);
}

// Generate static params for all pages (optional for performance)
export async function generateStaticParams() {
  try {
    // Fetch all pages to pre-generate routes
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/pages?limit=100`);
    const data = await response.json();
    
    return data.docs?.map((page: Page) => ({
      slug: page.slug.startsWith('/') ? page.slug.substring(1).split('/') : page.slug.split('/'), // Remove leading slash before splitting
    })) || [];
  } catch (error) {
    console.error('Error generating static params for pages:', error);
    return [];
  }
}