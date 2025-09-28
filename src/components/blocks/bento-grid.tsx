import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getMediaUrl } from '@/lib/payload';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AutoPauseVideo } from '@/components/ui/auto-pause-video';
import type { CaseStudy } from '@/lib/payload';

interface BentoGridProps {
  caseStudies: CaseStudy[];
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  className?: string;
}

// Define the repeating bento grid pattern: 1 large, 2 small, repeat
const BENTO_PATTERN = [
  'full',     // Large card
  'half',     // Small card 1
  'half',     // Small card 2
] as const;

// Get grid area for cards - balanced approach for visual weight
const getCardClasses = (index: number): { gridArea: string; cardStyle: string } => {
  const patternIndex = index % BENTO_PATTERN.length;
  const patternType = BENTO_PATTERN[patternIndex];
  
  switch (patternType) {
    case 'full':
      return {
        gridArea: 'col-span-1 md:col-span-2',
        cardStyle: '' // No height constraints - let large cards flow naturally
      };
    case 'half':
      return {
        gridArea: 'col-span-1',
        cardStyle: 'aspect-[4/3]' // More reasonable aspect ratio for small cards
      };
    default:
      return {
        gridArea: 'col-span-1',
        cardStyle: 'aspect-[4/3]' // More reasonable aspect ratio for small cards
      };
  }
};

const BentoCard: React.FC<{ caseStudy: CaseStudy; index: number; backgroundColor?: 'white' | 'light-gray' | 'primary' }> = ({ caseStudy, index, backgroundColor = 'white' }) => {
  const { gridArea, cardStyle } = getCardClasses(index);
  const clientLogo = caseStudy.client?.logo ? getMediaUrl(caseStudy.client.logo) : '/castle_green_logo.svg';
  
  // Look for hero title in layout blocks first, then legacy hero field, then fallback to case study title
  const getHeroTitle = (): string => {
    // Check layout blocks for hero block
    const heroBlock = caseStudy.layout?.find(block => block.blockType === 'hero');
    if (heroBlock && 'title' in heroBlock && heroBlock.title) {
      return heroBlock.title as string;
    }
    
    // Check legacy hero field
    if (caseStudy.hero?.title) {
      return caseStudy.hero.title;
    }
    
    // Fallback to case study title
    return caseStudy.title;
  };
  
  const displayTitle = getHeroTitle();
  
  // Debug: Log the case study data to see what's available
  if (process.env.NODE_ENV === 'development') {
    const heroBlock = caseStudy.layout?.find(block => block.blockType === 'hero');
    console.log(`Case Study: ${caseStudy.title}`, {
      heroBlockTitle: heroBlock && 'title' in heroBlock ? heroBlock.title : undefined,
      legacyHeroTitle: caseStudy.hero?.title,
      fallbackTitle: caseStudy.title,
      displayTitle,
      layoutBlocks: caseStudy.layout?.map(b => b.blockType)
    });
  }

  // Simplified logic: Show video if exists, otherwise show image
  const hasVideo = !!caseStudy.resultsVideo;
  const hasImage = !!(caseStudy.resultsImage || caseStudy.hero?.backgroundImage);
  const displayImage = caseStudy.resultsImage || caseStudy.hero?.backgroundImage;

  // If neither video nor image exists, show placeholder
  if (!hasVideo && !hasImage) {
    // Show placeholder for case studies without images
    return (
      <div className={cn(gridArea)}>
        <div className={cn("w-full bg-surface-tertiary rounded-lg overflow-hidden relative flex items-center justify-center", cardStyle)}>
          <div className="text-content-muted text-center">
            <p className="text-base">No image available</p>
            <p className="text-sm mt-2">{caseStudy.title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(gridArea)}>
      <div className="w-full">
        <Link 
          href={`/case-studies/${caseStudy.slug}`}
          className={cn("w-full bg-surface-tertiary rounded-lg overflow-hidden relative group cursor-pointer block", cardStyle)}
        >
          {hasVideo ? (
            <AutoPauseVideo
              src={getMediaUrl(caseStudy.resultsVideo)}
              poster={undefined}
              className="w-full h-full object-cover"
              autoPlay={true}
              muted={true}
              loop={true}
              playsInline={true}
              threshold={0.3}
            />
          ) : displayImage ? (
            <OptimizedImage
              src={getMediaUrl(displayImage)}
              alt={`${caseStudy.title} case study`}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
              priority={index < 4}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
              width={1200}
              height={900}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-content-muted">
              <div className="text-center">
                <p className="text-sm">No media available</p>
                <p className="text-xs mt-1">{caseStudy.title}</p>
              </div>
            </div>
          )}
          
          {/* Desktop: Hover overlay with client logo and title */}
          <div className="hidden md:flex absolute inset-0 bg-surface-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center text-center w-full max-w-md">
              <div className="mb-6">
                <OptimizedImage 
                  src={clientLogo} 
                  alt={`${caseStudy.client?.name || 'Client'} logo`} 
                  className="filter brightness-0 invert"
                  width={120}
                  height={60}
                />
              </div>
              <h3 className="text-content-inverse text-3xl font-bold leading-tight text-center">
                {displayTitle}
              </h3>
            </div>
          </div>
        </Link>
        
        {/* Mobile: Title positioned under the card */}
        <div className="md:hidden mt-4 mb-6">
          <h3 className={cn(
            "text-lg font-bold leading-tight",
            backgroundColor === 'primary' ? 'text-content-inverse' : 'text-content-primary'
          )}>
            {displayTitle}
          </h3>
        </div>
      </div>
    </div>
  );
};

export function BentoGrid({ caseStudies, backgroundColor = 'white', className }: BentoGridProps) {
  const bgClass = {
    'white': 'bg-surface-light',
    'light-gray': 'bg-surface-tertiary',
    'primary': 'bg-surface-primary'
  }[backgroundColor];

  const navTheme = backgroundColor === 'primary' ? 'dark' : 'light';

  return (
    <section className={cn('w-full', bgClass, className)} data-nav-theme={navTheme}>
      <div className="container-outer">
        <div className="container-inner-no-pad">
          {/* CSS Grid container for masonry layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-min">
          {caseStudies.map((caseStudy, index) => (
            <BentoCard 
              key={caseStudy.id} 
              caseStudy={caseStudy} 
              index={index}
              backgroundColor={backgroundColor}
            />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}