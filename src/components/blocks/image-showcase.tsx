import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionContainer } from './section-container';
import { ResponsiveImage } from '@/types/image';
import { AutoPauseVideo } from '@/components/ui/auto-pause-video';
import { getSpacingClasses } from '@/lib/spacing-utils';

type ImageShowcaseVariant = 'single' | 'dual' | 'split';
type MediaType = 'image' | 'video';

interface MediaContent {
  type: MediaType;
  // Image properties
  image?: ResponsiveImage;
  // Video properties
  videoUrl?: string;
  videoThumbnail?: string;
  videoAlt?: string;
}

interface ImageShowcaseProps {
  variant: ImageShowcaseVariant;
  primaryMedia: MediaContent;
  secondaryMedia?: MediaContent; // Required for dual variant
  backgroundColor?: string;
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
  // Split variant specific props
  width?: number;
  height?: number;
  topBackgroundColor?: string;
  bottomBackgroundColor?: string;
  bottomBackgroundHeight?: string;
  // Spacing props
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  // Legacy support
  primaryImage?: ResponsiveImage;
  secondaryImage?: ResponsiveImage;
}

export function ImageShowcase({
  variant,
  primaryMedia,
  secondaryMedia,
  backgroundColor = 'bg-surface-light',
  className,
  imageClassName,
  containerClassName,
  width = 1920,
  height = 1080,
  topBackgroundColor = 'bg-surface-light',
  bottomBackgroundColor = 'bg-surface-tertiary',
  bottomBackgroundHeight = 'h-[30%]',
  spacingTop,
  spacingBottom,
  // Legacy support
  primaryImage,
  secondaryImage,
}: ImageShowcaseProps) {
  // Handle legacy support - convert old image props to new media format
  const actualPrimaryMedia = primaryMedia || (primaryImage ? { type: 'image' as MediaType, image: primaryImage } : undefined);
  const actualSecondaryMedia = secondaryMedia || (secondaryImage ? { type: 'image' as MediaType, image: secondaryImage } : undefined);

  if (variant === 'dual' && !actualSecondaryMedia) {
    throw new Error('Secondary media is required for dual variant');
  }

  if (!actualPrimaryMedia) {
    throw new Error('Primary media is required');
  }

  // Helper function to render media (image or video)
  const renderMedia = (media: MediaContent, className?: string) => {
    if (media.type === 'video' && media.videoUrl) {
      return (
        <AutoPauseVideo
          src={media.videoUrl}
          poster={media.videoThumbnail}
          className={cn("w-full h-full object-cover", className)}
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          threshold={0.3}
        />
      );
    } else if (media.type === 'image' && media.image) {
      return (
        <>
          {/* Desktop Image */}
          <Image 
            src={media.image.desktop} 
            alt={media.image.alt} 
            width={width} 
            height={height} 
            className={cn("w-full h-auto object-cover hidden md:block", className)}
          />
          {/* Mobile Image - fallback to desktop */}
          <Image 
            src={media.image.mobile || media.image.desktop} 
            alt={media.image.alt} 
            width={width} 
            height={height} 
            className={cn("w-full h-auto object-cover block md:hidden", className)}
          />
        </>
      );
    }
    return null;
  };

  // Single media variant
  if (variant === 'single') {
    return (
      <div className={cn("w-full py-24", backgroundColor, className)}>
        <SectionContainer className={containerClassName}>
          <div className="relative w-full rounded-card overflow-hidden">
            {renderMedia(actualPrimaryMedia, imageClassName)}
          </div>
        </SectionContainer>
      </div>
    );
  }

  // Dual image variant
  if (variant === 'dual') {
    return (
      <div className={cn("w-full py-24", backgroundColor, className)}>
        <SectionContainer className={containerClassName}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Primary Image */}
            {primaryImage && (
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                {/* Desktop Image */}
                <Image
                  src={primaryImage.desktop}
                  alt={primaryImage.alt}
                  fill
                  className="object-cover hidden md:block"
                />
                {/* Mobile Image - fallback to desktop */}
                <Image
                  src={primaryImage.mobile || primaryImage.desktop}
                  alt={primaryImage.alt}
                  fill
                  className="object-cover block md:hidden"
                />
              </div>
            )}
            
            {/* Secondary Image */}
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
              {/* Desktop Image */}
              <Image 
                src={secondaryImage!.desktop}
                alt={secondaryImage!.alt}
                fill
                className="object-cover hidden md:block"
              />
              {/* Mobile Image - fallback to desktop */}
              <Image 
                src={secondaryImage!.mobile || secondaryImage!.desktop}
                alt={secondaryImage!.alt}
                fill
                className="object-cover block md:hidden"
              />
            </div>
          </div>
        </SectionContainer>
      </div>
    );
  }

  // Split background variant
  if (variant === 'split') {
    // Get spacing classes for proper spacing
    const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
    
    return (
      <div className={cn("w-full relative", topClass, bottomClass, className)}>
        {/* Split background that extends full width including spacing */}
        <div className="absolute inset-0">
          {/* Top background */}
          <div className={cn("absolute top-0 left-0 right-0 h-[70%]", topBackgroundColor)}></div>
          {/* Bottom background */}
          <div className={cn("absolute bottom-0 left-0 right-0", bottomBackgroundHeight, bottomBackgroundColor)}></div>
        </div>
        
        {/* Content container */}
        <SectionContainer className={cn("relative z-10 py-12", containerClassName)}>
          <div className="relative w-full rounded-card overflow-hidden">
            {renderMedia(actualPrimaryMedia, imageClassName)}
          </div>
        </SectionContainer>
      </div>
    );
  }

  return null;
}