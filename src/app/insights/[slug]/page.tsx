import { notFound } from 'next/navigation';
import { getInsightBySlug } from '@/lib/insights';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { StickyNavigation } from '@/components/blocks/sticky-navigation';
import { CMSFooter } from '@/components/blocks/cms-footer';
import { getNavigationData, getFooterData } from '@/lib/navigation';

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
      title: `${insight.title} | Insights | R3 Digital`,
      description: insight.excerpt || insight.description || 'R3 Digital insight',
      keywords: [
        insight.category?.name || '',
        'insights',
        'digital marketing',
        'analytics',
        'R3 Digital'
      ].filter(Boolean),
    };
  } catch (error) {
    console.error('Error generating metadata for insight:', error);
    return {
      title: 'Insight | R3 Digital',
      description: 'R3 Digital insight',
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
          <div className="bg-surface-light py-16 md:py-24" data-nav-theme="light">
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

          {/* Featured Image */}
          {insight.featuredImage && (
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
              <OptimizedImage
                src={insight.featuredImage ? (insight.featuredImage as unknown as Record<string, unknown>).url as string || '/images/blog-placeholder.jpg' : '/images/blog-placeholder.jpg'}
                alt={insight.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content Blocks */}
          <div className="py-16">
            <div className="container-inner">
              <div className="max-w-4xl mx-auto">
                {/* Render content using RichTextRenderer */}
                {insight.content ? (
                  <div className="prose prose-lg max-w-none">
                    <pre>{JSON.stringify(insight.content, null, 2)}</pre>
                  </div>
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