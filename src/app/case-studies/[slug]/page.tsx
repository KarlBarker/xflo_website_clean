import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCaseStudyBySlug, getCaseStudiesForGallery, getCaseStudies } from '@/lib/payload';
import { generateCaseStudyMetadata } from '@/components/layouts/case-study-layout';
import { HeroSection } from '@/components/blocks/hero';
import { IntroductionSection } from '@/components/blocks/introduction';
import { CaseStudyBodyIntro } from '@/components/blocks/case-study-body-intro';
import PainPoints from '@/components/blocks/pain-points';
import { CaseStudyBodyText } from '@/components/blocks/case-study-body-text';
import { BodyText } from '@/components/blocks/body-text';
import { QuoteStandard } from '@/components/blocks/quote-standard';
import { QuoteFeatured } from '@/components/blocks/quote-featured';
import { StatsCards } from '@/components/blocks/stats-cards';
import { CTASection } from '@/components/blocks/cta';
import { getMediaUrl } from '@/lib/payload';
import type { SpacingSize } from '@/lib/spacing-utils';
import { getNavigationData, getFooterData } from '@/lib/navigation';
import { getSpacingClasses } from '@/lib/spacing-utils';
import { CaseStudyErrorBoundary } from '@/components/error-boundaries';
import { CaseStudyStructuredData } from '@/components/seo/structured-data';

// Helper to safely convert string to SpacingSize
const toSpacingSize = (value: unknown): SpacingSize | undefined => {
  if (typeof value === 'string' && ['none', 'tight', 'compact', 'element', 'component', 'section'].includes(value)) {
    return value as SpacingSize;
  }
  return undefined;
};

// Helper to safely convert string to allowed backgroundColor values
const toBackgroundColor = (value: unknown) => {
  const allowedColors = ['white', 'tertiary', 'primary', 'light-gray', 'White', 'Light Gray', 'primary-dark'];
  if (typeof value === 'string' && allowedColors.includes(value)) {
    return value as 'white' | 'tertiary' | 'primary' | 'light-gray' | 'White' | 'Light Gray' | 'primary-dark';
  }
  return undefined;
};

// Helper to safely convert string to text alignment values
const toTextAlign = (value: unknown) => {
  if (typeof value === 'string' && ['left', 'center', 'right'].includes(value)) {
    return value as 'left' | 'center' | 'right';
  }
  return undefined;
};

// Helper to safely get string values
const toString = (value: unknown): string | undefined => {
  return typeof value === 'string' ? value : undefined;
};

// Helper to safely get string values with fallback
const toStringWithFallback = (value: unknown, fallback: string): string => {
  return typeof value === 'string' ? value : fallback;
};


// Helper to safely access nested image properties
const getImageProps = (imageObj: unknown) => {
  if (typeof imageObj === 'object' && imageObj !== null) {
    const obj = imageObj as Record<string, unknown>;
    return {
      desktop: obj.desktop as Media,
      mobile: obj.mobile as Media | undefined,
      alt: toString(obj.alt) || 'Image'
    };
  }
  return null;
};
import type { LexicalContent, LexicalNode, LexicalTextNode } from '@/types/lexical';
import type { CaseStudyBlock, Media } from '@/lib/payload';

// Dynamic imports for heavy components with proper named export handling
const SplitBackgroundImage = dynamic(() => import('@/components/blocks/split-background-image').then(mod => ({ default: mod.SplitBackgroundImage })), {
  loading: () => <div className="h-96 bg-surface-tertiary animate-pulse" />
});

const DualImageShowcase = dynamic(() => import('@/components/blocks/dual-image-showcase').then(mod => ({ default: mod.DualImageShowcase })), {
  loading: () => <div className="h-96 bg-surface-tertiary animate-pulse" />
});

const StatsCharts = dynamic(() => import('@/components/blocks/stats-charts').then(mod => ({ default: mod.StatsCharts })), {
  loading: () => <div className="h-64 bg-surface-tertiary animate-pulse" />
});

const FullWidthVideo = dynamic(() => import('@/components/blocks/full-width-video').then(mod => ({ default: mod.FullWidthVideo })), {
  loading: () => <div className="aspect-video bg-surface-tertiary animate-pulse" />
});

const StickyNavigation = dynamic(() => import('@/components/blocks/sticky-navigation').then(mod => ({ default: mod.StickyNavigation })));


const SmartVideo = dynamic(() => import('@/components/blocks/smart-video').then(mod => ({ default: mod.SmartVideo })), {
  loading: () => <div className="aspect-video bg-surface-tertiary animate-pulse" />
});

const ProjectsGallery = dynamic(() => import('@/components/blocks/projects-gallery').then(mod => ({ default: mod.ProjectsGallery })), {
  loading: () => <div className="h-96 bg-surface-tertiary animate-pulse" />
});

const CMSFooter = dynamic(() => import('@/components/blocks/cms-footer').then(mod => ({ default: mod.CMSFooter })));

// Enable ISR with on-demand revalidation via webhooks
// Set to 0 for instant updates (use environment variable for production caching)
export const revalidate = 0; // No caching - instant updates from CMS

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    // Generate static paths for all published case studies
    const caseStudies = await getCaseStudies({ 
      limit: 100,
      where: { status: { equals: 'published' } }
    });
    
    return caseStudies.docs.map((study) => ({
      slug: study.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for case studies:', error);
    // Return empty array on error to prevent build failure
    return [];
  }
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.',
    };
  }

  return generateCaseStudyMetadata({
    title: `${caseStudy.title || 'Case Study'} | ${caseStudy.client?.name || 'Client'} Case Study | R3 Digital`,
    description: caseStudy.introduction?.text || caseStudy.introduction?.highlightedText || 'Case study description',
    keywords: [
      caseStudy.client?.name,
      caseStudy.client?.industry || '',
      'digital marketing',
      'case study',
      'R3 Digital'
    ].filter(Boolean),
    ogImage: caseStudy.hero?.backgroundImage ? getMediaUrl(caseStudy.hero.backgroundImage) : undefined,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  
  return (
    <CaseStudyErrorBoundary>
      <CaseStudyContent slug={slug} />
    </CaseStudyErrorBoundary>
  );
}

async function CaseStudyContent({ slug }: { slug: string }) {
  // Parallel data fetching for independent API calls
  const [caseStudy, navigationData, footerData] = await Promise.all([
    getCaseStudyBySlug(slug),
    getNavigationData(),
    getFooterData(),
  ]);
  
  if (!caseStudy) {
    notFound();
  }

  // Fetch other case studies for projects gallery (depends on caseStudy.id)
  const otherCaseStudies = await getCaseStudiesForGallery(caseStudy?.id);



  if (!caseStudy || caseStudy.status !== 'published') {
    notFound();
  }

  // Helper function to extract title and content from Lexical rich text
  const extractLexicalContent = (richText: LexicalContent | string | null | undefined): { title: string; content: string } => {
    if (!richText || typeof richText === 'string') {
      return { title: '', content: typeof richText === 'string' ? richText : '' };
    }

    if (!richText.root || !richText.root.children) {
      return { title: '', content: '' };
    }

    let title = '';
    let content = '';

    richText.root.children.forEach((node: LexicalNode) => {
      if (node.type === 'heading' && 'children' in node && node.children && Array.isArray(node.children)) {
        title = (node.children as LexicalNode[])
          .filter((child): child is LexicalTextNode => child.type === 'text')
          .map((child) => child.text || '')
          .join('');
      } else if (node.type === 'paragraph' && 'children' in node && node.children && Array.isArray(node.children)) {
        const paragraphText = (node.children as LexicalNode[])
          .filter((child): child is LexicalTextNode => child.type === 'text')
          .map((child) => child.text || '')
          .join('');
        content += (content ? '\n\n' : '') + paragraphText;
      }
    });
    
    return { title, content };
  };

  // Helper function to render rich text content (fallback for simple cases)
  const renderRichText = (richText: LexicalContent | string | null | undefined): string => {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;

    // For Lexical, extract just the content part
    const { content } = extractLexicalContent(richText);
    return content || '';
  };

  // Find hero block from layout array - should be first block
  const heroBlock = caseStudy.layout?.[0]; // First block is the hero section
  
  // Use hero block title if it exists and is not empty, otherwise fall back to case study title
  const heroTitle = (heroBlock?.title && typeof heroBlock.title === 'string' && heroBlock.title.trim() !== '') ? heroBlock.title : caseStudy.title || 'Case Study';
  const heroBackgroundImage = (heroBlock?.backgroundImage && typeof heroBlock.backgroundImage === 'object') ? getMediaUrl(heroBlock.backgroundImage as Media) : '/hero_home_castle_green.jpg';
  const heroBackgroundVideo = (heroBlock?.backgroundVideo && typeof heroBlock.backgroundVideo === 'object') ? getMediaUrl(heroBlock.backgroundVideo as Media) : undefined;
  const heroVariant = (heroBlock?.variant === 'homepage' || heroBlock?.variant === 'default') ? heroBlock.variant as 'default' | 'homepage' : 'default';

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Structured Data for SEO */}
      <CaseStudyStructuredData caseStudy={caseStudy} />
      
      {/* Sticky Navigation */}
      <StickyNavigation navigationData={navigationData} />
      
      <main id="main-content" className="relative z-10 w-full">
        {/* Hero Section with Navigation */}
        <div data-nav-theme="dark">
          <HeroSection
            title={heroTitle}
            backgroundImage={heroBackgroundImage}
            backgroundVideo={heroBackgroundVideo}
            variant={heroVariant}
            clientLogo={caseStudy.client?.logo ? {
              src: getMediaUrl(caseStudy.client.logo),
              alt: `${caseStudy.client.name} Logo`,
              width: 225,
              height: 75
            } : undefined}
          />
        </div>

        {/* Legacy content - only show if no layout blocks at all */}
        {(!caseStudy.layout || caseStudy.layout.length === 0) && (
          <>
            {/* Introduction Section */}
            <div data-nav-theme="dark">
              {(caseStudy.introduction?.text || caseStudy.introduction?.highlightedText) ? (
                <IntroductionSection
                  text={caseStudy.introduction?.text || caseStudy.introduction?.highlightedText}
                  backgroundColor="primary"
                />
              ) : (
                <IntroductionSection backgroundColor="primary" />
              )}
            </div>

            {/* Company Introduction */}
            {caseStudy.companyIntro && (
              <CaseStudyBodyIntro
                intro={renderRichText(caseStudy.companyIntro)}
              />
            )}

            {/* Pain Points */}
            {caseStudy.painPoints?.points && caseStudy.painPoints.points.length > 0 ? (
              <PainPoints
                title={caseStudy.painPoints.title}
                painPoints={caseStudy.painPoints.points.map(p => p.point)}
              />
            ) : (
              <PainPoints />
            )}
          </>
        )}

      {/* Dynamic Layout Blocks */}
      {caseStudy.layout?.slice(1).map((block: CaseStudyBlock, index: number) => {
        const key = block.id || index;
        
        
        switch (block.blockType) {
          case 'introduction':
            return (
              <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
                <IntroductionSection
                  text={typeof block.text === 'string' ? block.text : undefined}
                  backgroundColor={typeof block.backgroundColor === 'string' ? block.backgroundColor : undefined}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'painPoints':
            return (
              <div key={key} data-nav-theme="dark">
                <PainPoints
                  title={typeof block.title === 'string' ? block.title : undefined}
                  painPoints={Array.isArray(block.points) ? block.points.map((p) => p.point) : []}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'statsCards':
            return (
              <div key={key} data-nav-theme={(block.backgroundColor === 'primary' || block.backgroundColor === 'primary-dark') ? 'dark' : 'light'}>
                <StatsCards
                  title={typeof block.title === 'string' ? block.title : undefined}
                  stats={Array.isArray(block.stats) ? block.stats.map((stat, index) => ({
                    // Try multiple field names for the numeric value, fallback to placeholder
                    value: stat.percentage || stat.value || stat.number || `[${index + 1}]`,
                    description: stat.description,
                    color: stat.cardColor || 'secondary'
                  })) : []}
                  backgroundColor={toBackgroundColor(block.backgroundColor)}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'statsCharts':
            return (
              <div key={key} data-nav-theme="dark">
                <StatsCharts
                  stats={Array.isArray(block.stats) ? block.stats.map((stat) => ({
                    stat: parseInt(stat.percentage.replace(/[^\d]/g, '')) || 0, // Parse "7%" to 7
                    title: stat.description,
                    description: ""
                  })) : []}
                />
              </div>
            );
            
          case 'bodyIntro':
            return (
              <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
                <CaseStudyBodyIntro
                  intro={typeof block.content === 'string' ? block.content : undefined}
                  backgroundColor={toBackgroundColor(block.backgroundColor)}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'caseStudyBodyText':
            const { title: extractedTitle, content: extractedContent } = extractLexicalContent(block.content as LexicalContent | string | null | undefined);
            return (
              <div key={key} data-nav-theme="light">
                <CaseStudyBodyText
                  title={extractedTitle}
                  content={extractedContent}
                  backgroundColor={block.backgroundColor === 'tertiary' ? 'tertiary' : 'white'}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'contentSection':
            return (
              <div key={key} data-nav-theme="light">
                <CaseStudyBodyText
                  title={typeof block.title === 'string' ? block.title : ''}
                  content={renderRichText(block.content as LexicalContent | string | null | undefined)}
                  backgroundColor={block.backgroundColor === 'tertiary' ? 'tertiary' : 'white'}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'bodyText':
            return (
              <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'light' : 'dark'}>
                <BodyText
                  content={block.content as LexicalContent}
                  backgroundColor={toBackgroundColor(block.backgroundColor)}
                  textAlign={toTextAlign(block.textAlign)}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'imageShowcase':
            // Handle CMS images array structure
            const imageData = Array.isArray(block.images) && block.images.length > 0 ? block.images[0] : null;
            if (!imageData || !imageData.desktop) {
              console.warn('ImageShowcase block missing image data:', block);
              return (
                <div key={key} style={{ padding: '20px', background: 'orange', color: 'black', margin: '10px 0' }}>
                  <strong>IMAGE SHOWCASE - MISSING IMAGE DATA</strong>
                  <pre>{JSON.stringify(block, null, 2)}</pre>
                </div>
              );
            }
            
            // Convert CMS image structure to ResponsiveImage format
            const primaryImage = {
              desktop: getMediaUrl(imageData.desktop),
              mobile: imageData.mobile ? getMediaUrl(imageData.mobile) : getMediaUrl(imageData.desktop),
              alt: imageData.alt || imageData.desktop.alt || 'Image'
            };
            if (block.type === 'dual') {
              const leftImage = primaryImage;
              // For dual images, try to get a second image from the array or use the same image
              const secondImageData = (Array.isArray(block.images) && block.images.length > 1) ? block.images[1] :
                                        (Array.isArray(block.images) && block.images.length > 0) ? block.images[0] : null;
              const rightImage = secondImageData ? {
                desktop: getMediaUrl(secondImageData.desktop),
                mobile: secondImageData.mobile ? getMediaUrl(secondImageData.mobile) : getMediaUrl(secondImageData.desktop),
                alt: secondImageData.alt || secondImageData.desktop.alt || 'Image'
              } : primaryImage;
              
              // Map color names to CSS classes for dual image
              const topColorMap = {
                'white': 'bg-surface-light',
                'White': 'bg-surface-light', 
                'light-gray': 'bg-surface-tertiary',
                'Light Gray': 'bg-surface-tertiary',
                'primary': 'bg-surface-primary'
              };
              
              const bottomColorMap = {
                'white': 'bg-surface-light',
                'White': 'bg-surface-light',
                'light-gray': 'bg-surface-tertiary', 
                'Light Gray': 'bg-surface-tertiary',
                'primary': 'bg-surface-primary'
              };
              
              // Handle various field name variations from CMS
              const topColor = (typeof block.splitBackgroundTop === 'string' ? block.splitBackgroundTop :
                               typeof block.topBg === 'string' ? block.topBg : 'light-gray');
              const bottomColor = (typeof block.splitBackgroundBottom === 'string' ? block.splitBackgroundBottom :
                                  typeof block.bottomBg === 'string' ? block.bottomBg : 'white');
              const splitRatio = (typeof block.splitPercentage === 'string' ? block.splitPercentage :
                                  typeof block.splitRatio === 'string' ? block.splitRatio : '60');
              
              console.log('DUAL IMAGE DEBUG:', {
                backgroundType: block.backgroundType,
                topBg: topColor,
                bottomBg: bottomColor,
                splitRatio: splitRatio
              });
              
              // Calculate split percentages
              const bottomHeight = parseInt(typeof splitRatio === 'string' ? splitRatio : '60');
              
              console.log('DUAL IMAGE COLORS:', {
                topBackgroundColor: topColorMap[topColor as keyof typeof topColorMap] || 'bg-surface-tertiary',
                bottomBackgroundColor: bottomColorMap[bottomColor as keyof typeof bottomColorMap] || 'bg-surface-light',
                bottomHeight: bottomHeight
              });
              
              return (
                <div key={key} data-nav-theme="light">
                  <DualImageShowcase
                    leftImage={leftImage}
                    rightImage={rightImage}
                    spacingTop={toSpacingSize(block.spacingTop)}
                    spacingBottom={toSpacingSize(block.spacingBottom)}
                    backgroundType={typeof block.backgroundType === 'string' && (block.backgroundType === 'split' || block.backgroundType === 'solid') ? block.backgroundType : 'solid'}
                    topBackgroundColor={topColorMap[topColor as keyof typeof topColorMap] || 'bg-surface-tertiary'}
                    bottomBackgroundColor={bottomColorMap[bottomColor as keyof typeof bottomColorMap] || 'bg-surface-light'}
                    splitRatio={bottomHeight}
                  />
                </div>
              );
            } else {
              // Map color names to CSS classes for single image
              const topColorMap = {
                'white': 'bg-surface-light',
                'White': 'bg-surface-light', 
                'light-gray': 'bg-surface-tertiary',
                'Light Gray': 'bg-surface-tertiary',
                'primary': 'bg-surface-primary'
              };
              
              const bottomColorMap = {
                'white': 'bg-surface-light',
                'White': 'bg-surface-light',
                'light-gray': 'bg-surface-tertiary', 
                'Light Gray': 'bg-surface-tertiary',
                'primary': 'bg-surface-primary'
              };
              
              // Handle various field name variations from CMS
              const topColor = toStringWithFallback(block.splitBackgroundTop, '') || toStringWithFallback(block.topBg, '') || 'white';
              const bottomColor = toStringWithFallback(block.splitBackgroundBottom, '') || toStringWithFallback(block.bottomBg, '') || 'light-gray';

              console.log('SINGLE IMAGE DEBUG:', {
                backgroundType: toString(block.backgroundType),
                topBg: topColor,
                bottomBg: bottomColor,
                splitRatio: toString(block.splitPercentage) || toString(block.splitRatio)
              });
              
              return (
                <div key={key} data-nav-theme="light">
                  <SplitBackgroundImage
                    image={primaryImage}
                    topBackgroundColor={topColorMap[topColor as keyof typeof topColorMap] || 'bg-surface-light'}
                    bottomBackgroundColor={bottomColorMap[bottomColor as keyof typeof bottomColorMap] || 'bg-surface-tertiary'}
                    bottomBackgroundHeight={toString(block.splitPercentage) || 'h-[30%]'}
                    spacingTop={toSpacingSize(block.spacingTop)}
                    spacingBottom={toSpacingSize(block.spacingBottom)}
                  />
                </div>
              );
            }
            
          case 'quoteStandard':
            const standardBgClass = {
              'white': 'bg-surface-light',
              'light-gray': 'bg-surface-tertiary',
              'primary': 'bg-surface-primary',
              'tertiary': 'bg-surface-tertiary'
            }[toString(block.backgroundColor) || 'white'] || 'bg-surface-light';
            
            return (
              <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
                <QuoteStandard
                  content={toString(block.text) || ''}
                  className={standardBgClass}
                  backgroundColor={toString(block.backgroundColor)}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'quoteFeatured':
            const featuredBgClass = {
              'white': 'bg-surface-light',
              'light-gray': 'bg-surface-tertiary',
              'primary': 'bg-surface-primary',
              'tertiary': 'bg-surface-tertiary'
            }[toString(block.backgroundColor) || 'white'] || 'bg-surface-light';
            
            return (
              <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
                <QuoteFeatured
                  quote={toString(block.text) || ''}
                  author={toString(block.author) || ''}
                  company={toString(block.company)}
                  className={featuredBgClass}
                  backgroundColor={toString(block.backgroundColor)}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'quote':
            // Legacy quote block - determine type based on whether author exists
            const legacyBgClass = {
              'white': 'bg-surface-light',
              'light-gray': 'bg-surface-tertiary',
              'primary': 'bg-surface-primary',
              'tertiary': 'bg-surface-tertiary'
            }[toString(block.backgroundColor) || 'white'] || 'bg-surface-light';

            if (toString(block.author)) {
              return (
                <div key={key} data-nav-theme="light">
                  <QuoteFeatured
                    quote={toString(block.text) || ''}
                    author={toString(block.author) || ''}
                    company={toString(block.company) || toString(block.position)} // Handle both field names
                    className={legacyBgClass}
                  />
                </div>
              );
            } else {
              return (
                <div key={key} data-nav-theme="light">
                  <QuoteStandard
                    content={toString(block.text) || ''}
                    className={legacyBgClass}
                  />
                </div>
              );
            }
            
          case 'singleImage':
            const bgColorMap = {
              'white': 'bg-surface-light',      /* White (#ffffff) */
              'White': 'bg-surface-light',      /* CMS format */
              'light-gray': 'bg-surface-tertiary', /* Neutral-200 (#e5e5e5) */
              'Light Gray': 'bg-surface-tertiary', /* CMS format */
              'primary': 'bg-surface-primary'   /* Neutral-900 (#171717) */
            };
            
            const singleImage = {
              desktop: getMediaUrl(block.desktop as Media),
              mobile: block.mobile ? getMediaUrl(block.mobile as Media) : getMediaUrl(block.desktop as Media),
              alt: toString(block.alt) || 'Image'
            };

            if (toString(block.backgroundType) === 'split') {
              // DEBUG: Log the values from CMS
              console.log('SINGLE IMAGE DEBUG:', {
                backgroundType: toString(block.backgroundType),
                topBg: toString(block.topBg),
                bottomBg: toString(block.bottomBg),
                splitRatio: toString(block.splitRatio)
              });
              
              const bgColorMapHex = {
                'white': '#ffffff',        /* --primary-light */
                'White': '#ffffff',        /* CMS format */
                'light-gray': '#e5e5e5',   /* --neutral-200 (surface-tertiary) */
                'Light Gray': '#e5e5e5',   /* CMS format */
                'primary': '#171717'       /* --primary-dark (neutral-900) */
              };
              
              const topColor = bgColorMapHex[toString(block.topBg) as keyof typeof bgColorMapHex] || '#ffffff';
              const bottomColor = bgColorMapHex[toString(block.bottomBg) as keyof typeof bgColorMapHex] || '#e5e5e5';
              const bottomHeight = parseInt(toString(block.splitRatio) || '30');
              
              console.log('SINGLE IMAGE COLORS:', {
                topColor,
                bottomColor,
                bottomHeight
              });
              
              return (
                <div key={key} data-nav-theme="light">
                  <SplitBackgroundImage
                    image={singleImage}
                    topBackgroundColor={bgColorMap[toString(block.topBg) as keyof typeof bgColorMap] || 'bg-surface-light'}
                    bottomBackgroundColor={bgColorMap[toString(block.bottomBg) as keyof typeof bgColorMap] || 'bg-surface-tertiary'}
                    bottomBackgroundHeight={`h-[${bottomHeight}%]`}
                    spacingTop={toSpacingSize(block.spacingTop)}
                    spacingBottom={toSpacingSize(block.spacingBottom)}
                  />
                </div>
              );
            } else {
              // Solid background - use design system component
              const solidBgClass = bgColorMap[toString(block.solidBackground) as keyof typeof bgColorMap] || 'bg-surface-light';
              return (
                <div key={key} data-nav-theme="light">
                  <SplitBackgroundImage
                    image={singleImage}
                    topBackgroundColor={solidBgClass}
                    bottomBackgroundColor={solidBgClass}
                    bottomBackgroundHeight="h-[0%]" // No split for solid background
                    spacingTop={toSpacingSize(block.spacingTop)}
                    spacingBottom={toSpacingSize(block.spacingBottom)}
                  />
                </div>
              );
            }
            
          case 'dualImage':
            const leftImageProps = getImageProps(block.leftImage);
            const rightImageProps = getImageProps(block.rightImage);

            if (!leftImageProps || !rightImageProps) {
              console.warn('DualImage block missing image data:', block);
              return <div key={key}>Missing image data</div>;
            }

            const leftImage = {
              desktop: getMediaUrl(leftImageProps.desktop),
              mobile: leftImageProps.mobile ? getMediaUrl(leftImageProps.mobile) : getMediaUrl(leftImageProps.desktop),
              alt: leftImageProps.alt
            };
            const rightImage = {
              desktop: getMediaUrl(rightImageProps.desktop),
              mobile: rightImageProps.mobile ? getMediaUrl(rightImageProps.mobile) : getMediaUrl(rightImageProps.desktop),
              alt: rightImageProps.alt
            };
            
            if (toString(block.backgroundType) === 'split') {
              // DEBUG: Log the values from CMS
              console.log('DUAL IMAGE DEBUG:', {
                backgroundType: toString(block.backgroundType),
                topBg: toString(block.topBg),
                bottomBg: toString(block.bottomBg),
                splitRatio: toString(block.splitRatio)
              });
              
              // Use same background structure as SplitBackgroundImage component
              const bgColorMap = {
                'white': 'bg-surface-light',
                'White': 'bg-surface-light',
                'light-gray': 'bg-surface-tertiary',
                'Light Gray': 'bg-surface-tertiary',
                'primary': 'bg-surface-primary'
              };
              
              const bottomHeight = parseInt(toString(block.splitRatio) || '30');
              const topBackgroundColor = bgColorMap[toString(block.topBg) as keyof typeof bgColorMap] || 'bg-surface-light';
              const bottomBackgroundColor = bgColorMap[toString(block.bottomBg) as keyof typeof bgColorMap] || 'bg-surface-tertiary';

              console.log('DUAL IMAGE COLORS:', {
                topBackgroundColor,
                bottomBackgroundColor,
                bottomHeight
              });

              // Get spacing classes for the split background container
              const { topClass, bottomClass } = getSpacingClasses(toString(block.spacingTop), toString(block.spacingBottom));
              
              return (
                <div key={key} data-nav-theme="light">
                  <div className={`w-full relative ${topClass} ${bottomClass}`}>
                    {/* Split background that extends full width */}
                    <div className="absolute inset-0">
                      {/* Top background */}
                      <div 
                        className={`absolute top-0 left-0 right-0 ${topBackgroundColor}`}
                        style={{ height: `${100-bottomHeight}%` }}
                      ></div>
                      {/* Bottom background */}
                      <div 
                        className={`absolute bottom-0 left-0 right-0 ${bottomBackgroundColor}`}
                        style={{ height: `${bottomHeight}%` }}
                      ></div>
                    </div>
                    
                    {/* Content container */}
                    <div className="relative z-10">
                      <DualImageShowcase 
                        leftImage={leftImage} 
                        rightImage={rightImage} 
                        backgroundColor="" 
                        spacingTop="none" 
                        spacingBottom="none" 
                      />
                    </div>
                  </div>
                </div>
              );
            } else {
              // Solid background - use design system class
              const bgColorMap = {
                'white': 'bg-surface-light',
                'White': 'bg-surface-light',
                'light-gray': 'bg-surface-tertiary',
                'Light Gray': 'bg-surface-tertiary',
                'primary': 'bg-surface-primary'
              };
              const solidBgClass = bgColorMap[toString(block.solidBackground) as keyof typeof bgColorMap] || 'bg-surface-light';
              return (
                <div key={key} data-nav-theme="light">
                  <DualImageShowcase
                    leftImage={leftImage}
                    rightImage={rightImage}
                    backgroundColor={solidBgClass}
                    spacingTop={toSpacingSize(block.spacingTop)}
                    spacingBottom={toSpacingSize(block.spacingBottom)}
                  />
                </div>
              );
            }
            
          case 'splitBackgroundImage':
            const bgMap = {
              'white': 'bg-surface-light',
              'White': 'bg-surface-light',
              'light-gray': 'bg-surface-tertiary',
              'Light Gray': 'bg-surface-tertiary',
              'primary': 'bg-surface-primary'
            };
            
            const splitImage = {
              desktop: getMediaUrl(block.desktop as Media),
              mobile: block.mobile ? getMediaUrl(block.mobile as Media) : getMediaUrl(block.desktop as Media),
              alt: toString(block.alt) || 'Image'
            };
            
            return (
              <div key={key} data-nav-theme="light">
                <SplitBackgroundImage
                  image={splitImage}
                  topBackgroundColor={bgMap[toString(block.topBg) as keyof typeof bgMap] || 'bg-surface-light'}
                  bottomBackgroundColor={bgMap[toString(block.bottomBg) as keyof typeof bgMap] || 'bg-surface-tertiary'}
                  bottomBackgroundHeight={`h-[${toString(block.splitRatio) || '30'}%]`}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          case 'video':
            const videoSrc = toString(block.videoSource) === 'upload'
              ? getMediaUrl(block.videoFile as Media)
              : block.videoUrl;
            
            return (
              <div key={key} data-nav-theme="light">
                <SmartVideo
                  videoSrc={toString(videoSrc) || ''}
                  title={toString(block.title)}
                  thumbnail={block.thumbnail ? getMediaUrl(block.thumbnail as Media) : undefined}
                  description={toString(block.description)}
                  aspectRatio={toString(block.aspectRatio) || '16/9'}
                  autoplay={typeof block.autoplaySettings === 'object' && block.autoplaySettings && 'autoplay' in block.autoplaySettings ? Boolean(block.autoplaySettings.autoplay) : true}
                  muted={typeof block.autoplaySettings === 'object' && block.autoplaySettings && 'muted' in block.autoplaySettings ? Boolean(block.autoplaySettings.muted) : true}
                  loop={typeof block.autoplaySettings === 'object' && block.autoplaySettings && 'loop' in block.autoplaySettings ? Boolean(block.autoplaySettings.loop) : true}
                  pauseOnExit={typeof block.autoplaySettings === 'object' && block.autoplaySettings && 'pauseOnExit' in block.autoplaySettings ? Boolean(block.autoplaySettings.pauseOnExit) : true}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                  backgroundType={toString(block.backgroundType) === 'split' || toString(block.backgroundType) === 'solid' ? toString(block.backgroundType) as 'split' | 'solid' : 'solid'}
                  backgroundColor={(() => {
                    const bgMap = {
                      'white': 'bg-surface-light',
                      'White': 'bg-surface-light',
                      'light-gray': 'bg-surface-tertiary',
                      'Light Gray': 'bg-surface-tertiary',
                      'primary': 'bg-surface-primary'
                    };
                    return bgMap[toString(block.backgroundColor) as keyof typeof bgMap] || 'bg-surface-light';
                  })()}
                  topBackgroundColor={(() => {
                    const bgMap = {
                      'white': 'bg-surface-light',
                      'White': 'bg-surface-light',
                      'light-gray': 'bg-surface-tertiary',
                      'Light Gray': 'bg-surface-tertiary',
                      'primary': 'bg-surface-primary'
                    };
                    // Handle both field name variations from CMS
                    const topColor = toString(block.topBackgroundColor) || toString(block.topBg);
                    return bgMap[topColor as keyof typeof bgMap] || 'bg-surface-light';
                  })()}
                  bottomBackgroundColor={(() => {
                    const bgMap = {
                      'white': 'bg-surface-light',
                      'White': 'bg-surface-light',
                      'light-gray': 'bg-surface-tertiary',
                      'Light Gray': 'bg-surface-tertiary',
                      'primary': 'bg-surface-primary'
                    };
                    // Handle both field name variations from CMS
                    const bottomColor = toString(block.bottomBackgroundColor) || toString(block.bottomBg);
                    return bgMap[bottomColor as keyof typeof bgMap] || 'bg-surface-tertiary';
                  })()}
                  splitRatio={parseInt(toString(block.splitRatio) || '30')}
                />
              </div>
            );
            
          case 'bentoGrid':
            // Note: Bento grid in case studies would need a different implementation
            // For now, skip rendering
            console.warn('Bento grid block not implemented for case study pages');
            return null;
            
          case 'cta':
            // Fix CTA data structure - ensure href exists for links
            const primaryCTA = block.primaryCTA && typeof block.primaryCTA === 'object' ? {
              text: toString((block.primaryCTA as Record<string, unknown>).text) || '',
              href: toString((block.primaryCTA as Record<string, unknown>).href) || (
                (block.primaryCTA as Record<string, unknown>).type === 'email'
                  ? `mailto:${toString((block.primaryCTA as Record<string, unknown>).text) || ''}`
                  : toString((block.primaryCTA as Record<string, unknown>).text) || ''
              ),
              type: toString((block.primaryCTA as Record<string, unknown>).type) as 'link' | 'email' | 'phone' | undefined
            } : undefined;

            const secondaryCTA = block.secondaryCTA && typeof block.secondaryCTA === 'object' ? {
              text: toString((block.secondaryCTA as Record<string, unknown>).text) || '',
              href: toString((block.secondaryCTA as Record<string, unknown>).href) || (
                (block.secondaryCTA as Record<string, unknown>).type === 'phone'
                  ? `tel:${(toString((block.secondaryCTA as Record<string, unknown>).text) || '').replace(/\s+/g, '')}`
                  : toString((block.secondaryCTA as Record<string, unknown>).text) || ''
              ),
              type: toString((block.secondaryCTA as Record<string, unknown>).type) as 'link' | 'email' | 'phone' | undefined
            } : undefined;
            
            return (
              <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
                <CTASection
                  eyebrow={toString(block.eyebrow)}
                  title={toString(block.title)}
                  primaryCTA={primaryCTA}
                  secondaryCTA={secondaryCTA}
                  backgroundColor={toString(block.backgroundColor)}
                  spacingTop={toSpacingSize(block.spacingTop)}
                  spacingBottom={toSpacingSize(block.spacingBottom)}
                />
              </div>
            );
            
          default:
            console.warn(`Unknown block type: ${block.blockType}`, block);
            // Show a visible placeholder for unknown blocks
            return (
              <div key={key} style={{ padding: '20px', background: 'red', color: 'white', margin: '10px 0' }}>
                <strong>UNKNOWN BLOCK TYPE: {block.blockType}</strong>
                <pre>{JSON.stringify(block, null, 2)}</pre>
              </div>
            );
        }
      })}

      {/* No fallback content - if CMS layout is missing, show nothing */}
      {(!caseStudy.layout || caseStudy.layout.length === 0) && (
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold text-red-600">⚠️ No Layout Blocks Found</h2>
          <p className="text-gray-600 mt-4">This case study has no layout blocks configured in the CMS.</p>
          <p className="text-sm text-gray-500 mt-2">Case Study ID: {caseStudy.id}</p>
        </div>
      )}

        {/* Featured Video */}
        {caseStudy.featuredVideo && (
          <FullWidthVideo
            src={getMediaUrl(caseStudy.featuredVideo)}
          />
        )}

        {/* Projects Gallery - Always appears at bottom */}
        <ProjectsGallery
          currentCaseStudyId={caseStudy.id}
          projects={otherCaseStudies.map(project => ({
            id: project.id,
            title: project.title,
            slug: project.slug,
            client: {
              name: project.client?.name || 'Client',
              logo: project.client?.logo ? {
                url: getMediaUrl(project.client.logo),
                alt: project.client.logo.alt || `${project.client.name} logo`
              } : undefined
            },
            galleryImage: project.galleryImage ? {
              url: getMediaUrl(project.galleryImage),
              alt: project.galleryImage.alt || project.title
            } : project.hero?.backgroundImage ? {
              url: getMediaUrl(project.hero.backgroundImage),
              alt: project.hero.backgroundImage.alt || project.title
            } : undefined
          }))}
          title="Other Projects"
        />

        {/* CMS Footer */}
        <CMSFooter footerData={footerData} />
      </main>
    </div>
  );
}