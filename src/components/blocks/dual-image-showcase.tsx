import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionContainer } from './section-container';
import { ResponsiveImage } from '@/types/image';
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils';

// Legacy image type for backward compatibility
interface LegacyImage {
  src: string;
  alt: string;
}

interface DualImageShowcaseProps extends SpacingProps {
  // New ResponsiveImage interface (for CMS)
  leftImage?: ResponsiveImage | LegacyImage;
  rightImage?: ResponsiveImage | LegacyImage;
  backgroundColor?: string;
  className?: string;
  // Split background options
  backgroundType?: 'solid' | 'split';
  topBackgroundColor?: string;
  bottomBackgroundColor?: string;
  splitRatio?: number;
}

export function DualImageShowcase({
  leftImage,
  rightImage,
  backgroundColor = 'bg-surface-light',
  className,
  spacingTop,
  spacingBottom,
  backgroundType = 'solid',
  topBackgroundColor = 'bg-surface-light',
  bottomBackgroundColor = 'bg-surface-tertiary',
  splitRatio = 50,
}: DualImageShowcaseProps) {
  // Return null if images are missing
  if (!leftImage || !rightImage) {
    return null;
  }
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);

  // Helper function to get image props from either ResponsiveImage or LegacyImage
  const getImageProps = (image: ResponsiveImage | LegacyImage) => {
    if ('desktop' in image) {
      // ResponsiveImage interface (CMS)
      return {
        desktop: image.desktop,
        mobile: image.mobile || image.desktop,
        alt: image.alt || 'Image'
      };
    } else {
      // LegacyImage interface (existing static)
      return {
        desktop: image.src,
        mobile: image.src,
        alt: image.alt
      };
    }
  };

  const leftProps = getImageProps(leftImage);
  const rightProps = getImageProps(rightImage);

  // Render image content
  const renderImageContent = () => (
    <SectionContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Image */}
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
          {/* Desktop Image */}
          <Image 
            src={leftProps.desktop}
            alt={leftProps.alt}
            fill
            className="object-cover hidden md:block"
          />
          {/* Mobile Image - fallback to desktop */}
          <Image 
            src={leftProps.mobile}
            alt={leftProps.alt}
            fill
            className="object-cover block md:hidden"
          />
        </div>
        
        {/* Right Image */}
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
          {/* Desktop Image */}
          <Image 
            src={rightProps.desktop}
            alt={rightProps.alt}
            fill
            className="object-cover hidden md:block"
          />
          {/* Mobile Image - fallback to desktop */}
          <Image 
            src={rightProps.mobile}
            alt={rightProps.alt}
            fill
            className="object-cover block md:hidden"
          />
        </div>
      </div>
    </SectionContainer>
  );

  // Render with background options
  if (backgroundType === 'split') {
    const topHeightPercent = 100 - splitRatio;
    const bottomHeightPercent = splitRatio;
    
    return (
      <div className={cn("w-full relative", topClass, bottomClass, className)}>
        {/* Split background that extends full width */}
        <div className="absolute inset-0">
          {/* Top background */}
          <div 
            className={cn("absolute top-0 left-0 right-0", topBackgroundColor)}
            style={{ height: `${topHeightPercent}%` }}
          ></div>
          {/* Bottom background */}
          <div 
            className={cn("absolute bottom-0 left-0 right-0", bottomBackgroundColor)}
            style={{ height: `${bottomHeightPercent}%` }}
          ></div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10">
          {renderImageContent()}
        </div>
      </div>
    );
  }

  // Default solid background
  return (
    <div className={cn("w-full", backgroundColor, topClass, bottomClass, className)}>
      {renderImageContent()}
    </div>
  );
}