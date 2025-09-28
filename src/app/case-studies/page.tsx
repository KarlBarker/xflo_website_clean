import { getCaseStudies, getCaseStudyCategories, getResponsiveImageUrls, type CaseStudy, type CaseStudyCategory } from '@/lib/payload';
import { SectionContainer } from '@/components/blocks/section-container';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Case Studies | R3 Digital',
  description: 'Explore our successful digital marketing campaigns and client results.',
};

export default async function CaseStudiesPage() {
  // Fetch data with error handling for build time
  let caseStudies: CaseStudy[] = [];
  let categories: CaseStudyCategory[] = [];
  
  try {
    const caseStudiesResponse = await getCaseStudies({ 
      where: { status: { equals: 'published' } },
      limit: 20 
    });
    caseStudies = caseStudiesResponse.docs || [];
  } catch (error) {
    console.warn('Failed to fetch case studies during build:', error);
  }
  
  try {
    const categoriesResponse = await getCaseStudyCategories();
    categories = categoriesResponse.docs || [];
  } catch (error) {
    console.warn('Failed to fetch categories during build:', error);
  }

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <div className="bg-surface-primary py-24">
        <SectionContainer>
          <h1 className="title-6xl font-featured text-content-inverse mb-6">
            Case Studies
          </h1>
          <p className="title-2xl text-content-inverse max-w-3xl">
            Discover how we&apos;ve helped businesses achieve remarkable results through strategic digital marketing.
          </p>
        </SectionContainer>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="py-12 bg-surface-light border-b border-stroke-muted">
          <SectionContainer>
            <h2 className="title-3xl font-featured text-content-primary mb-8">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/case-studies"
                className="px-6 py-3 bg-interactive-primary text-content-inverse rounded-button hover:bg-interactive-primary-hover transition-colors"
              >
                All Case Studies
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/case-studies/category/${category.slug}`}
                  className="px-6 py-3 bg-surface-secondary text-content-primary rounded-button hover:bg-surface-tertiary transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </SectionContainer>
        </div>
      )}

      {/* Case Studies Grid */}
      <div className="py-24">
        <SectionContainer>
          {caseStudies.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="title-4xl font-featured text-content-primary mb-4">
                No Case Studies Found
              </h2>
              <p className="text-content-secondary">
                Case studies will appear here once they&apos;re published in the CMS.
              </p>
            </div>
          ) : (
            <>
              <h2 className="title-4xl font-featured text-content-primary mb-12">
                Featured Case Studies ({caseStudies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((caseStudy) => {
                  // Safely get hero image with fallback
                  const heroImage = caseStudy.hero?.backgroundImage 
                    ? getResponsiveImageUrls(caseStudy.hero.backgroundImage)
                    : { desktop: '/placeholder-image.jpg', alt: 'Case study image' };
                  
                  return (
                    <Link
                      key={caseStudy.id}
                      href={`/case-studies/${caseStudy.slug}`}
                      className="group block bg-surface-primary rounded-card overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Case Study Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={heroImage.desktop}
                          alt={heroImage.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {/* Category Badge */}
{(() => {
                          const category = (caseStudy as unknown as Record<string, unknown>).category;
                          if (category && typeof category === 'object' && category !== null) {
                            const categoryObj = category as Record<string, unknown>;
                            if (categoryObj.name && typeof categoryObj.name === 'string') {
                              return (
                                <div className="absolute top-4 left-4">
                                  <span className="bg-interactive-primary text-content-inverse px-3 py-1 rounded-button text-sm font-medium">
                                    {categoryObj.name}
                                  </span>
                                </div>
                              );
                            }
                          }
                          return null;
                        })()}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Client Logo */}
                        {caseStudy.client?.logo?.url && (
                          <div className="mb-4">
                            <div className="logo-container">
                              <Image
                                src={caseStudy.client.logo.url}
                                alt={`${caseStudy.client.name} logo`}
                                width={120}
                                height={40}
                                className="logo-standardized case-study-card-logo"
                              />
                            </div>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="title-2xl font-featured text-content-inverse mb-3 group-hover:text-interactive-primary transition-colors">
                          {caseStudy.title}
                        </h3>

                        {/* Introduction */}
                        {caseStudy.introduction?.highlightedText && (
                          <p className="text-content-secondary line-clamp-3 mb-4">
                            {caseStudy.introduction.highlightedText}
                          </p>
                        )}

                        {/* Client Info */}
                        <div className="flex items-center justify-between text-sm text-content-muted">
                          <span>{caseStudy.client?.name || 'Client'}</span>
                          {caseStudy.client?.industry && (
                            <span>{caseStudy.client.industry}</span>
                          )}
                        </div>

                        {/* Read More */}
                        <div className="mt-4 text-interactive-primary font-medium group-hover:text-interactive-primary-hover transition-colors">
                          Read Case Study →
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </SectionContainer>
      </div>

      {/* CTA Section */}
      <div className="bg-surface-secondary py-24">
        <SectionContainer>
          <div className="text-center">
            <h2 className="title-5xl font-featured text-content-primary mb-6">
              Ready to Create Your Success Story?
            </h2>
            <p className="title-2xl text-content-secondary mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help your business achieve similar results.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-interactive-primary text-content-inverse rounded-button hover:bg-interactive-primary-hover transition-colors font-medium"
            >
              Get Started Today
            </Link>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}