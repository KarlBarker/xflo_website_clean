import React from 'react';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getNavigationData, getFooterData } from '@/lib/navigation';
import { API_CONFIG } from '@/config/constants';

// Rich text content interface
interface RichTextContent {
  type: string;
  children?: Array<{
    text: string;
    bold?: boolean;
  }>;
  tag?: string;
}

interface LegalPageData {
  title: string;
  lastUpdated: string;
  content: RichTextContent[];
}

// Helper to render rich text content
const renderRichText = (content: RichTextContent[]) => {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return content.map((node, index) => {
    if (node.type === 'heading') {
      const HeadingTag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingClass = node.tag === 'h1' ? 'title-6xl text-content-primary mb-6' :
                          node.tag === 'h2' ? 'title-4xl text-content-primary mb-4' :
                          'title-3xl text-content-primary mt-6 mb-4';

      return (
        <HeadingTag key={index} className={headingClass}>
          {node.children?.map(child => child.text).join('')}
        </HeadingTag>
      );
    }

    if (node.type === 'paragraph') {
      return (
        <p key={index} className="text-content-muted mb-4">
          {node.children?.map((child, childIndex) =>
            child.bold ? <strong key={childIndex}>{child.text}</strong> : child.text
          )}
        </p>
      );
    }

    if (node.type === 'list') {
      return (
        <ul key={index} className="list-disc list-inside space-y-2 ml-4">
          {node.children?.map((item, itemIndex) => (
            <li key={itemIndex} className="text-content-muted">
              {item.type === 'listitem' && item.children ? (
                item.children.map((child: any, childIndex: number) =>
                  child.format === 1 || child.bold ? (
                    <strong key={childIndex}>{child.text}</strong>
                  ) : (
                    <span key={childIndex}>{child.text}</span>
                  )
                )
              ) : (
                item.text
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (node.type === 'section') {
      return (
        <section key={index} className="mb-8">
          {node.children && renderRichText(node.children as unknown as RichTextContent[])}
        </section>
      );
    }

    return null;
  });
};

async function getTermsData(): Promise<LegalPageData | null> {
  try {
    const params = new URLSearchParams({
      'where[slug][equals]': 'terms-and-conditions',
      limit: '1'
    });

    const url = `${API_CONFIG.PAYLOAD_URL}/legal-pages?${params}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.docs.length > 0) {
        const page = data.docs[0];
        return {
          title: page.title,
          lastUpdated: page.lastUpdated || new Date().toISOString(),
          content: page.content?.root?.children || []
        };
      }
    }
  } catch {
    console.log('CMS legal pages not available, using static content');
  }

  return null;
}

export default async function TermsAndConditionsPage() {
  const navigationData = await getNavigationData();
  const footerData = await getFooterData();
  const termsData = await getTermsData();

  // Use CMS data if available, otherwise show placeholder
  const pageTitle = termsData?.title || "Terms & Conditions";
  const lastUpdated = termsData?.lastUpdated
    ? new Date(termsData.lastUpdated).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');

  return (
    <div className="min-h-screen bg-surface-light">
      <StickyNavigation navigationData={navigationData} />

      <main className="container-outer pt-32 pb-spacing-section">
        <div className="container-inner">
          <div className="w-text mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="title-6xl text-content-primary mb-6">
                {pageTitle}
              </h1>
              <p className="text-lg text-content-muted">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              {termsData?.content && Array.isArray(termsData.content) ? (
                renderRichText(termsData.content)
              ) : (
                <div className="text-content-muted">
                  <p className="mb-8">
                    This page will display the Terms & Conditions content once configured in the CMS.
                  </p>
                  <p>
                    To set up Terms & Conditions content:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4 mt-4">
                    <li>Create a &quot;Legal Pages&quot; collection in your CMS</li>
                    <li>Add fields for title, slug, lastUpdated, and rich text content</li>
                    <li>Create a page with slug &quot;terms-and-conditions&quot;</li>
                    <li>Add your Terms & Conditions content</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <CMSFooter footerData={footerData} />
    </div>
  );
}