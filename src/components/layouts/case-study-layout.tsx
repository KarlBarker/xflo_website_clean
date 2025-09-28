import React from 'react';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface CaseStudyLayoutProps {
  children: React.ReactNode;
  seo?: SEOData;
  className?: string;
}

export function CaseStudyLayout({
  children,
  className
}: CaseStudyLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-surface-light", className)}>
      {/* Main Content */}
      <main role="main" className="relative">
        {children}
      </main>
    </div>
  );
}

// Utility function to generate metadata for Next.js pages
export function generateCaseStudyMetadata(seo: SEOData): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    robots: seo.noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: seo.canonicalUrl ? {
      canonical: seo.canonicalUrl,
    } : undefined,
  };
}