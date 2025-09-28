import type { Metadata } from 'next';
import type { Page } from '@/lib/payload';

export function generatePageMetadata(page: Page): Metadata {
  const title = page.title || 'XFlo Digital';
  const description = `${page.title} - XFlo Digital` || 'Digital marketing and technology solutions from XFlo Digital';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://xflo.agency/${page.slug === 'home' ? '' : page.slug}`,
      siteName: 'XFlo Digital',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    // Add canonical URL
    alternates: {
      canonical: `https://xflo.agency/${page.slug === 'home' ? '' : page.slug}`,
    },
  };
}