import { notFound } from 'next/navigation';
import { getCaseStudies, getCategoryBySlug, getResponsiveImageUrls } from '@/lib/payload';
import type { LexicalContent, LexicalNode, LexicalTextNode } from '@/types/lexical';
import { SectionContainer } from '@/components/blocks/section-container';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} Case Studies | R3 Digital`,
    description: `Explore our ${category.name.toLowerCase()} case studies and client success stories.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const caseStudiesResponse = await getCaseStudies({
    where: { 
      'category.slug': { equals: slug },
      status: { equals: 'published' }
    },
    limit: 20
  });

  const caseStudies = caseStudiesResponse.docs;

  // Helper function to render rich text
  const renderRichText = (richText: LexicalContent | string | undefined): string => {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;
    if ('text' in richText) return typeof richText.text === 'string' ? richText.text : '';
    if ('root' in richText && richText.root?.children) {
      return richText.root.children.map((node: LexicalNode) => {
        if (node.type === 'text') {
          return (node as LexicalTextNode).text || '';
        }
        return '';
      }).join(' ');
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <div className="relative bg-surface-primary py-24">
        {/* Background Image */}
        {category.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={category.heroImage.url}
              alt={category.heroImage.alt || `${category.name} background`}
              fill
              className="object-cover opacity-20"
            />
          </div>
        )}
        
        <SectionContainer className="relative z-10">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-content-inverse">
              <li>
                <Link href="/" className="hover:text-interactive-primary transition-colors">
                  Home
                </Link>
              </li>
              <span className="mx-2">/</span>
              <li>
                <Link href="/case-studies" className="hover:text-interactive-primary transition-colors">
                  Case Studies
                </Link>
              </li>
              <span className="mx-2">/</span>
              <li className="text-content-muted">{category.name}</li>
            </ol>
          </nav>

          <h1 className="title-6xl font-featured text-content-inverse mb-6">
            {category.name} Case Studies
          </h1>
          
          {category.description && (
            <div className="title-2xl text-content-inverse max-w-3xl">
              {renderRichText(category.description)}
            </div>
          )}
        </SectionContainer>
      </div>

      {/* Stats Bar */}
      <div className="bg-surface-secondary py-12">
        <SectionContainer>
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="title-3xl font-featured text-content-primary">
                {caseStudies.length} {category.name} {caseStudies.length === 1 ? 'Case Study' : 'Case Studies'}
              </h2>
              <p className="text-content-secondary">
                Discover how we&apos;ve helped businesses succeed with {category.name.toLowerCase()}.
              </p>
            </div>
            <Link
              href="/case-studies"
              className="px-6 py-3 bg-interactive-primary text-content-inverse rounded-button hover:bg-interactive-primary-hover transition-colors"
            >
              View All Categories
            </Link>
          </div>
        </SectionContainer>
      </div>

      {/* Case Studies Grid */}
      <div className="py-24">
        <SectionContainer>
          {caseStudies.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="title-4xl font-featured text-content-primary mb-4">
                No {category.name} Case Studies Yet
              </h2>
              <p className="text-content-secondary mb-8">
                We&apos;re working on some amazing {category.name.toLowerCase()} projects. Check back soon!
              </p>
              <Link
                href="/case-studies"
                className="inline-flex items-center px-6 py-3 bg-interactive-primary text-content-inverse rounded-button hover:bg-interactive-primary-hover transition-colors"
              >
                Browse All Case Studies
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((caseStudy) => {
                const heroImage = caseStudy.hero?.backgroundImage ? getResponsiveImageUrls(caseStudy.hero.backgroundImage) : { desktop: '', mobile: '', alt: '' };
                
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
{(() => {
                        const publishedDate = (caseStudy as unknown as Record<string, unknown>).publishedDate;
                        if (publishedDate && typeof publishedDate === 'string') {
                          return (
                            <div className="absolute top-4 right-4">
                              <span className="bg-surface-primary bg-opacity-80 text-content-inverse px-3 py-1 rounded-button text-sm">
                                {new Date(publishedDate).getFullYear()}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Client Logo */}
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

                      {/* Title */}
                      <h3 className="title-2xl font-featured text-content-inverse mb-3 group-hover:text-interactive-primary transition-colors">
                        {caseStudy.title}
                      </h3>

                      {/* Introduction */}
                      <p className="text-content-secondary line-clamp-3 mb-4">
                        {caseStudy.introduction?.highlightedText}
                      </p>

                      {/* Client Info */}
                      <div className="flex items-center justify-between text-sm text-content-muted">
                        <span>{caseStudy.client.name}</span>
                        {caseStudy.client.industry && (
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
          )}
        </SectionContainer>
      </div>

      {/* Related Categories */}
      <div className="bg-surface-secondary py-24">
        <SectionContainer>
          <div className="text-center">
            <h2 className="title-5xl font-featured text-content-primary mb-6">
              Explore More Case Studies
            </h2>
            <p className="title-2xl text-content-secondary mb-8">
              See how we&apos;ve delivered results across different industries and specialties.
            </p>
            <Link
              href="/case-studies"
              className="inline-flex items-center px-8 py-4 bg-interactive-primary text-content-inverse rounded-button hover:bg-interactive-primary-hover transition-colors font-medium"
            >
              View All Case Studies
            </Link>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}