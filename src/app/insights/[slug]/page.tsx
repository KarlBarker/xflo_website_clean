import { notFound } from 'next/navigation';
import { getInsightBySlug } from '@/lib/insights';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getNavigationData, getFooterData } from '@/lib/navigation';
import { LexicalRenderer } from '@/components/ui/lexical-renderer';

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for known insights
export async function generateStaticParams() {
  // Return mock insights for now
  return [
    { slug: 'isora-grc-ux-awards-2024' },
    { slug: 'advanced-analytics-strategies' },
    { slug: 'fintech-trends-2024' },
    { slug: 'nextjs-scalable-apps' },
    { slug: 'future-ux-design' }
  ];
}

export async function generateMetadata({ params }: InsightPageProps) {
  const { slug } = await params;

  try {
    const insight = await getInsightBySlug(slug);

    if (!insight) {
      return {
        title: 'Insight Not Found',
        description: 'The requested insight could not be found.',
      };
    }

    return {
      title: `${insight.title} | Insights | xFlo.ai`,
      description: insight.excerpt || insight.description || 'xFlo.ai - AI transformation insights',
      keywords: [
        insight.category?.name || '',
        'insights',
        'AI transformation',
        'business automation',
        'xFlo.ai'
      ].filter(Boolean),
    };
  } catch (error) {
    console.error('Error generating metadata for insight:', error);
    return {
      title: 'Insight | xFlo.ai',
      description: 'xFlo.ai - AI transformation insights',
    };
  }
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;

  try {
    // Fetch insight data
    const insight = await getInsightBySlug(slug);

    if (!insight) {
      notFound();
    }

    // Fetch navigation and footer data
    const [navigationData, footerData] = await Promise.all([
      getNavigationData(),
      getFooterData()
    ]);

    return (
      <div className="min-h-screen bg-surface-light">
        <StickyNavigation navigationData={navigationData} />

        <main className="pt-16">
          {/* Insight Header */}
          <div className="bg-surface-light pt-16 md:pt-24 pb-8 md:pb-12" data-nav-theme="light">
            <div className="container-inner">
              <div className="max-w-4xl mx-auto text-center">
                {/* Category Badge */}
                {insight.category && (
                  <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-button text-sm font-standard bg-interactive-secondary text-content-inverse">
                      {insight.category.name}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="title-6xl font-featured text-content-primary mb-6">
                  {insight.title}
                </h1>

                {/* Excerpt */}
                {insight.excerpt && (
                  <p className="text-body-xl text-content-primary mb-8 leading-relaxed">
                    {insight.excerpt}
                  </p>
                )}

                {/* Author and Meta */}
                <div className="flex items-center justify-center gap-4 text-content-muted">
                  {insight.author && (
                    <>
                      <span className="text-base font-standard">{insight.author.name}</span>
                      <span className="w-1 h-1 bg-content-muted rounded-full"></span>
                    </>
                  )}
                  {insight.publishedAt && (
                    <>
                      <span className="text-base">{new Date(insight.publishedAt).toLocaleDateString('en-GB')}</span>
                      <span className="w-1 h-1 bg-content-muted rounded-full"></span>
                    </>
                  )}
                  {insight.readTime && (
                    <span className="text-base">{insight.readTime}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="pt-8 pb-16">
            <div className="container-inner">
              <div className="max-w-4xl mx-auto">
                {/* Render content using Lexical Renderer */}
                {insight.content ? (
                  <LexicalRenderer content={insight.content} className="prose prose-lg max-w-none" />
                ) : (
                  <p className="text-content-muted">Content will be loaded from CMS.</p>
                )}
              </div>
            </div>
          </div>
        </main>

        <CMSFooter footerData={footerData} />
      </div>
    );
  } catch (error) {
    console.error('Error loading insight:', error);
    notFound();
  }
}