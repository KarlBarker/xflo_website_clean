import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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
import { BentoGrid } from '@/components/blocks/bento-grid';
import { PageHeader } from '@/components/blocks/page-header';
import { LogoGrid } from '@/components/blocks/logo-grid';
import { ServicesSection } from '@/components/blocks/services';
import { ServicesGrid } from '@/components/blocks/services-grid';
import { AwardsGrid } from '@/components/blocks/awards-grid';
import { BlogCarousel } from '@/components/blocks/blog-carousel';
import { ImageShowcase } from '@/components/blocks/image-showcase';
import { ScrollHijackCarousel } from '@/components/blocks/scroll-hijack-carousel';
import { CarouselSlider } from '@/components/blocks/carousel-slider';
import { TwoColumnText } from '@/components/blocks/two-column-text';
import { AccordionBlock } from '@/components/blocks/accordion-block';
import { getMediaUrl, getCaseStudiesForBento } from '@/lib/payload';
import { getSpacingClasses } from '@/lib/spacing-utils';
import { getBackgroundTheme } from '@/lib/theme-utils';
import type {
  Page,
  HeroBlock,
  IntroductionBlock,
  BodyIntroBlock,
  PainPointsBlock,
  QuoteStandardBlock,
  QuoteFeaturedBlock,
  ImageShowcaseBlock,
  VideoBlock,
  BentoGridBlock,
  CTABlock,
  StatsCardsBlock,
  StatsChartsBlock,
  CaseStudyBodyTextBlock,
  BodyTextBlock,
  LogoGridBlock,
  ServicesSectionBlock,
  ServicesGridBlock,
  AwardsGridBlock,
  BlogCarouselBlock,
  SingleImageBlock,
  ScrollHijackCarouselBlock,
  PageHeaderBlock,
  CarouselBlock,
  TwoColumnTextBlock,
  AccordionBlockData
} from '@/lib/payload';

// Union type for all possible page blocks
type PageBlock =
  | HeroBlock
  | IntroductionBlock
  | BodyIntroBlock
  | PainPointsBlock
  | QuoteStandardBlock
  | QuoteFeaturedBlock
  | ImageShowcaseBlock
  | VideoBlock
  | BentoGridBlock
  | CTABlock
  | StatsCardsBlock
  | StatsChartsBlock
  | CaseStudyBodyTextBlock
  | BodyTextBlock
  | LogoGridBlock
  | ServicesSectionBlock
  | ServicesGridBlock
  | AwardsGridBlock
  | BlogCarouselBlock
  | SingleImageBlock
  | ScrollHijackCarouselBlock
  | PageHeaderBlock
  | CarouselBlock
  | TwoColumnTextBlock
  | AccordionBlockData;

// Dynamic imports for heavy components

const StatsCharts = dynamic(() => import('@/components/blocks/stats-charts').then(mod => ({ default: mod.StatsCharts })), {
  loading: () => <div className="h-96 bg-surface-tertiary animate-pulse" />
});

const SmartVideo = dynamic(() => import('@/components/blocks/smart-video').then(mod => ({ default: mod.SmartVideo })), {
  loading: () => <div className="aspect-video bg-surface-tertiary animate-pulse" />
});

interface DynamicPageProps {
  page: Page;
}

// Async component for BentoGrid that fetches case studies
async function BentoGridRenderer({ block }: { block: BentoGridBlock }) {
  const caseStudies = await getCaseStudiesForBento(block.limit);
  const { topClass, bottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
  
  // Use block background color instead of page background for padding area
  const blockBgClass = block.backgroundColor === 'primary' ? 'bg-surface-primary' : 'bg-surface-light';
  
  return (
    <div className={`${topClass} ${bottomClass} ${blockBgClass}`} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
      <BentoGrid
        caseStudies={caseStudies}
        backgroundColor={
          block.backgroundColor === 'tertiary' ? 'light-gray' :
          block.backgroundColor === 'light' ? 'white' :
          block.backgroundColor as 'white' | 'primary' | 'light-gray'
        }
      />
    </div>
  );
}

export function DynamicPage({ page }: DynamicPageProps) {
  // Get page background class to fill gaps between blocks
  const pageBackgroundClass = page.backgroundColor === 'dark' ? 'bg-surface-primary' : 'bg-surface-light';

  const renderBlock = (block: PageBlock, index: number) => {
    const key = `${block.blockType}-${index}`;

    // DEBUG: Log all block data to understand what we're receiving

    switch (block.blockType) {
      case 'hero':
        // Check if this is the homepage by looking at the page slug
        const isHomepage = page.slug === 'home' || page.slug === '/home';
        return (
          <div key={key} data-nav-theme="dark">
            <HeroSection
              title={block.title}
              subtitle={block.subtitle}
              backgroundImage={block.backgroundImage ? getMediaUrl(block.backgroundImage) : undefined}
              backgroundVideo={block.backgroundVideo ? getMediaUrl(block.backgroundVideo) : undefined}
              variant={isHomepage ? 'homepage' : (block.variant || 'default')}
              clientLogo={block.clientLogo ? {
                src: getMediaUrl(block.clientLogo),
                alt: block.clientLogo.alt || 'Client Logo',
                width: 225,
                height: 75
              } : undefined}
            />
          </div>
        );

      case 'introduction':
        // Get nav theme context
        const { bgContext } = getBackgroundTheme(block.backgroundColor);
        
        return (
          <div key={key} data-nav-theme={bgContext}>
            <IntroductionSection 
              eyebrow={block.eyebrow}
              text={block.text}
              variant={block.variant}
              backgroundColor={block.backgroundColor}
              spacingTop={block.spacingTop}
              spacingBottom={block.spacingBottom}
            />
          </div>
        );

      case 'bodyIntro':
        return (
          <div key={key} data-nav-theme="light">
            <CaseStudyBodyIntro intro={block.content} />
          </div>
        );

      case 'painPoints':
        const { topClass: painTopClass, bottomClass: painBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        return (
          <div key={key} data-nav-theme="dark">
            <PainPoints
              title={block.title || ''}
              painPoints={block.points?.map(p => p.point) || []}
              className={`${painTopClass} ${painBottomClass}`}
            />
          </div>
        );

      case 'caseStudyBodyText':
        const { topClass: caseBodyTopClass, bottomClass: caseBodyBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        const caseBodyBgClass = block.backgroundColor === 'tertiary' ? 'bg-surface-tertiary' : 'bg-surface-light';
        
        return (
          <div key={key} data-nav-theme="light">
            <CaseStudyBodyText
              title={typeof block.title === 'string' ? block.title : ''}
              content={typeof block.content === 'string' ? block.content : JSON.stringify(block.content)}
              className={`${caseBodyBgClass} ${caseBodyTopClass} ${caseBodyBottomClass}`}
            />
          </div>
        );

      case 'bodyText':
        // Note: Spacing and background classes could be applied here if needed
        
        return (
          <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <BodyText 
              content={block.content}
              backgroundColor={block.backgroundColor}
              textAlign={block.textAlign}
              maxWidth={block.maxWidth as "text" | "container" | "full" | undefined}
              spacingTop={block.spacingTop}
              spacingBottom={block.spacingBottom}
            />
          </div>
        );

      case 'twoColumnText':
        const twoColumnTextBlock = block as TwoColumnTextBlock;
        return (
          <div key={key} data-nav-theme={twoColumnTextBlock.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <TwoColumnText
              leftText={twoColumnTextBlock.leftText}
              rightText={twoColumnTextBlock.rightText}
              backgroundColor={twoColumnTextBlock.backgroundColor}
              spacingTop={twoColumnTextBlock.spacingTop}
              spacingBottom={twoColumnTextBlock.spacingBottom}
            />
          </div>
        );

      case 'accordion':
        const accordionBlock = block as AccordionBlockData;
        const { topClass: accordionTopClass, bottomClass: accordionBottomClass } = getSpacingClasses(
          accordionBlock.spacingTop as string | undefined,
          accordionBlock.spacingBottom as string | undefined
        );
        return (
          <div key={key} data-nav-theme={accordionBlock.backgroundColor === 'primary' ? 'dark' : 'light'} className={`${accordionTopClass} ${accordionBottomClass}`}>
            <AccordionBlock
              title={accordionBlock.title}
              items={accordionBlock.items || []}
              backgroundColor={accordionBlock.backgroundColor}
              defaultOpenIndex={accordionBlock.defaultOpenIndex}
              spacingTop={accordionBlock.spacingTop}
              spacingBottom={accordionBlock.spacingBottom}
            />
          </div>
        );

      case 'quoteStandard':
        const { topClass: quoteStdTopClass, bottomClass: quoteStdBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        const quoteStdBgClass = {
          'white': 'bg-surface-light',
          'light-gray': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[block.backgroundColor] || 'bg-surface-light';
        
        return (
          <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <QuoteStandard 
              content={block.text}
              className={`${quoteStdBgClass} ${quoteStdTopClass} ${quoteStdBottomClass}`}
            />
          </div>
        );

      case 'quoteFeatured':
        const { topClass: quoteFeatTopClass, bottomClass: quoteFeatBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        const quoteFeatBgClass = {
          'white': 'bg-surface-light',
          'light-gray': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[block.backgroundColor] || 'bg-surface-light';
        
        return (
          <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <QuoteFeatured
              quote={block.text}
              author={block.author}
              company={block.company}
              className={`${quoteFeatBgClass} ${quoteFeatTopClass} ${quoteFeatBottomClass}`}
              backgroundColor={block.backgroundColor}
            />
          </div>
        );

      case 'statsCards':
        // Note: Spacing classes handled by StatsCards component
        
        // DEBUG: Check what block.stats contains at this level
        
        return (
          <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <StatsCards
              title={block.title}
              stats={block.stats}
              backgroundColor={block.backgroundColor}
              spacingTop={block.spacingTop}
              spacingBottom={block.spacingBottom}
            />
          </div>
        );

      case 'statsCharts':
        return (
          <div key={key} data-nav-theme="dark">
            <StatsCharts
              stats={block.stats?.map(stat => ({
                stat: parseInt(stat.percentage) || 0,
                title: stat.percentage,
                description: stat.description
              })) || []}
            />
          </div>
        );

      case 'cta':
        // Note: Spacing classes handled by CTASection component

        // Transform CTA data to handle missing href fields
        const primaryCTA = block.primaryCTA ? {
          ...block.primaryCTA,
          href: block.primaryCTA.href || (
            block.primaryCTA.type === 'email' 
              ? `mailto:${block.primaryCTA.text}` 
              : block.primaryCTA.text
          )
        } : undefined;

        const secondaryCTA = block.secondaryCTA ? {
          ...block.secondaryCTA,
          href: block.secondaryCTA.href || (
            block.secondaryCTA.type === 'email' 
              ? `mailto:${block.secondaryCTA.text}` 
              : block.secondaryCTA.text
          )
        } : undefined;
        
        // Determine nav theme based on the active background (backgroundColor for 'full', container for 'container')
        const activeBackground = block.width === 'container' ? block.containerBackgroundColor : block.backgroundColor;
        const navTheme = activeBackground === 'primary' || activeBackground === 'primary-dark' ? 'dark' : 'light';
        
        return (
          <div key={key} data-nav-theme={navTheme}>
            <CTASection
              eyebrow={block.eyebrow}
              title={typeof block.title === 'string' ? block.title : undefined}
              primaryCTA={primaryCTA}
              secondaryCTA={secondaryCTA}
              backgroundColor={block.backgroundColor}
              containerBackgroundColor={typeof block.containerBackgroundColor === 'string' ? block.containerBackgroundColor : undefined}
              width={block.width as "container" | "full" | undefined}
              spacingTop={block.spacingTop}
              spacingBottom={block.spacingBottom}
            />
          </div>
        );

      case 'video':
        // Process video source - prioritize upload over URL
        const videoSrc = block.videoSource === 'upload' && block.videoFile
          ? getMediaUrl(block.videoFile)
          : block.videoUrl;
        
        if (!videoSrc) {
          console.warn('⚠️ Video block has no video source');
          return null;
        }
        
        return (
          <div key={key} data-nav-theme="light">
            <SmartVideo
              videoSrc={videoSrc}
              title={block.title}
              thumbnail={block.thumbnail ? getMediaUrl(block.thumbnail) : undefined}
              description={block.description}
              aspectRatio={block.aspectRatio || '16/9'}
              autoplay={block.autoplaySettings?.autoplay ?? true}
              muted={block.autoplaySettings?.muted ?? true}
              loop={block.autoplaySettings?.loop ?? true}
              pauseOnExit={block.autoplaySettings?.pauseOnExit ?? true}
              spacingTop={block.spacingTop}
              spacingBottom={block.spacingBottom}
              backgroundType={block.backgroundType || 'solid'}
              backgroundColor={(() => {
                const bgMap = {
                  'white': 'bg-surface-light',
                  'light-gray': 'bg-surface-tertiary',
                  'primary': 'bg-surface-primary'
                };
                return (block.backgroundColor && bgMap[block.backgroundColor as keyof typeof bgMap]) || 'bg-surface-light';
              })()}
              topBackgroundColor={(() => {
                const bgMap = {
                  'white': 'bg-surface-light',
                  'light-gray': 'bg-surface-tertiary',
                  'primary': 'bg-surface-primary'
                };
                return (block.topBackgroundColor && bgMap[block.topBackgroundColor as keyof typeof bgMap]) || 'bg-surface-light';
              })()}
              bottomBackgroundColor={(() => {
                const bgMap = {
                  'white': 'bg-surface-light',
                  'light-gray': 'bg-surface-tertiary',
                  'primary': 'bg-surface-primary'
                };
                return (block.bottomBackgroundColor && bgMap[block.bottomBackgroundColor as keyof typeof bgMap]) || 'bg-surface-tertiary';
              })()}
              splitRatio={parseInt(typeof block.splitRatio === 'string' ? block.splitRatio : '30') || 30}
            />
          </div>
        );

      case 'bentoGrid':
        return (
          <BentoGridRenderer key={key} block={block} />
        );

      case 'pageHeader':
        const pageHeaderBlock = block as PageHeaderBlock;
        const { topClass: headerTopClass, bottomClass: headerBottomClass } = getSpacingClasses(
          pageHeaderBlock.spacingTop as string | undefined,
          pageHeaderBlock.spacingBottom as string | undefined
        );
        const pageHeaderBgClass = {
          'white': 'bg-surface-light',
          'light': 'bg-surface-light',
          'light-gray': 'bg-surface-tertiary',
          'tertiary': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[pageHeaderBlock.backgroundColor as string] || 'bg-surface-light';

        return (
          <div key={key} data-nav-theme={pageHeaderBlock.backgroundColor === 'primary' ? 'dark' : 'light'} className={pageHeaderBgClass}>
            <PageHeader
              title={pageHeaderBlock.title}
              subtitle={pageHeaderBlock.subtitle}
              size={pageHeaderBlock.size}
              fontWeight={pageHeaderBlock.fontWeight}
              backgroundColor={pageHeaderBlock.backgroundColor}
              textAlign={pageHeaderBlock.textAlign}
              navClearance={pageHeaderBlock.navClearance}
              heroSpacing={pageHeaderBlock.heroSpacing}
              className={`${headerTopClass} ${headerBottomClass}`}
            />
          </div>
        );

      case 'logoGrid':
        const { topClass: logoGridTopClass, bottomClass: logoGridBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        // Use block background color instead of page background for padding area
        const logoGridBgClass = block.backgroundColor === 'primary' ? 'bg-surface-primary' : 'bg-surface-light';
        return (
          <div key={key} className={`${logoGridTopClass} ${logoGridBottomClass} ${logoGridBgClass}`} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <LogoGrid
              logos={block.logos}
              columns={block.columns}
              backgroundColor={block.backgroundColor}
            />
          </div>
        );

      case 'servicesSection':
        const { topClass: servicesTopClass, bottomClass: servicesBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        const servicesBgClass = {
          'white': 'bg-surface-light',
          'light-gray': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[block.backgroundColor as string] || 'bg-surface-light';
        
        return (
          <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <ServicesSection
              eyebrow={block.eyebrow}
              headline={block.headline}
              categories={block.categories}
              badgeStyle={block.badgeStyle}
              backgroundColor={block.backgroundColor}
              spacingTop={block.spacingTop}
              spacingBottom={block.spacingBottom}
              className={`${servicesBgClass} ${servicesTopClass} ${servicesBottomClass}`}
            />
          </div>
        );

      case 'servicesGrid':
        const servicesGridBgClass = {
          'light': 'bg-surface-light',
          'tertiary': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[block.backgroundColor as string] || 'bg-surface-light';
        
        return (
          <div key={key} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'} className={servicesGridBgClass}>
            <ServicesGrid
              headerText={block.headerText}
              services={block.services || []}
              backgroundColor={block.backgroundColor}
              columns={block.columns}
              spacingTop={block.spacingTop}
              spacingBottom={block.spacingBottom}
            />
          </div>
        );

      case 'awardsGrid':
        const { topClass: awardsTopClass, bottomClass: awardsBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        const awardsBgClass = {
          'white': 'bg-surface-light',
          'light-gray': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[block.backgroundColor as string] || 'bg-surface-light';
        
        return (
          <div key={key} className={`${awardsTopClass} ${awardsBottomClass} ${awardsBgClass}`} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <AwardsGrid
              awards={block.awards}
              columns={block.columns}
              backgroundColor={block.backgroundColor}
            />
          </div>
        );

      case 'blogCarousel':
        const { topClass: blogTopClass, bottomClass: blogBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        const blogBgClass = {
          'white': 'bg-surface-light',
          'light-gray': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[block.backgroundColor as string] || 'bg-surface-light';
        
        return (
          <div key={key} className={`${blogTopClass} ${blogBottomClass} ${blogBgClass}`} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <BlogCarousel
              title={block.title}
              description={block.description}
              limit={block.limit}
              category={block.category}
              backgroundColor={block.backgroundColor}
            />
          </div>
        );

      case 'singleImage':
        // Check if split background is enabled (backgroundType should be 'split')
        if (block.backgroundType === 'split' && block.topBg && block.bottomBg) {
          // Map color names to CSS classes for split background
          const splitBgColorMap = {
            'white': 'bg-surface-light',
            'White': 'bg-surface-light',
            'light-gray': 'bg-surface-tertiary',
            'Light Gray': 'bg-surface-tertiary',
            'primary': 'bg-surface-primary'
          };

          // Create image content for split background (images only)
          const splitMedia = block.desktop
            ? {
                type: 'image' as const,
                image: {
                  desktop: getMediaUrl(block.desktop),
                  mobile: block.mobile ? getMediaUrl(block.mobile) : getMediaUrl(block.desktop),
                  alt: block.alt || 'Image'
                }
              }
            : null;

          if (!splitMedia) {
            console.warn('⚠️ Split background block has no media content');
            return null;
          }
          
          return (
            <div key={key} data-nav-theme="light">
              <ImageShowcase
                variant="split"
                primaryMedia={splitMedia}
                topBackgroundColor={splitBgColorMap[block.topBg as keyof typeof splitBgColorMap] || 'bg-surface-light'}
                bottomBackgroundColor={splitBgColorMap[block.bottomBg as keyof typeof splitBgColorMap] || 'bg-surface-tertiary'}
                bottomBackgroundHeight={`h-[${block.splitRatio || 30}%]`}
                spacingTop={block.spacingTop}
                spacingBottom={block.spacingBottom}
              />
            </div>
          );
        }

        // Regular single background handling (backgroundType === 'solid')
        const { topClass: imageTopClass, bottomClass: imageBottomClass } = getSpacingClasses(block.spacingTop, block.spacingBottom);
        const imageBgClass = {
          'white': 'bg-surface-light',
          'light-gray': 'bg-surface-tertiary',
          'primary': 'bg-surface-primary'
        }[block.backgroundColor as string] || 'bg-surface-light';
        
        if (block.fullWidth) {
          // Full width image without container padding
          return (
            <div key={key} className={`${imageTopClass} ${imageBottomClass} ${imageBgClass}`} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
              <div className="w-full">
                <div className="relative w-full">
                  <Image 
                    src={getMediaUrl(block.desktop)}
                    alt={block.alt || 'Image'}
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover hidden md:block"
                  />
                  <Image 
                    src={block.mobile ? getMediaUrl(block.mobile) : getMediaUrl(block.desktop)}
                    alt={block.alt || 'Image'}
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover block md:hidden"
                  />
                </div>
              </div>
            </div>
          );
        }
        
        // Debug: Log the block data to see what we're receiving
        
        // Create image content only (no video support)
        const primaryMedia = block.desktop
          ? {
              type: 'image' as const,
              image: {
                desktop: getMediaUrl(block.desktop),
                mobile: block.mobile ? getMediaUrl(block.mobile) : getMediaUrl(block.desktop),
                alt: block.alt || 'Image'
              }
            }
          : null;

        // If no image content, show an error or skip rendering
        if (!primaryMedia) {
          console.warn('⚠️ SingleImage block has no image content');
          return null;
        }

        return (
          <div key={key} className={`${imageTopClass} ${imageBottomClass} ${imageBgClass}`} data-nav-theme={block.backgroundColor === 'primary' ? 'dark' : 'light'}>
            <ImageShowcase
              variant="single"
              primaryMedia={primaryMedia}
              backgroundColor={imageBgClass}
            />
          </div>
        );

      case 'scrollHijackCarousel':
      case 'carousel':  // CMS sends 'carousel' for ScrollHijackCarousel - restore original behavior
        // Debug: Log the slide data
        return (
          <ScrollHijackCarousel
            key={key}
            slides={block.slides || []}
          />
        );


      default:
        console.warn(`Unknown block type: ${block.blockType}`);
        return (
          <div key={key} className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800">
            Unknown block type: {block.blockType}
          </div>
        );
    }
  };

  // Use layout field if blocks is not available (CMS returns layout)
  const blocksToRender = page.blocks || page.layout || [];

  return (
    <main className={`relative z-10 w-full ${pageBackgroundClass}`}>
      {blocksToRender.map((block, index) => renderBlock(block as PageBlock, index))}
    </main>
  );
}