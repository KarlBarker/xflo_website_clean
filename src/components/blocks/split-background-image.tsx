import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionContainer } from './section-container';
import { ResponsiveImage } from '@/types/image';
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils';
import { AutoPauseVideo } from '@/components/ui/auto-pause-video';
import { Media } from '@/lib/payload';

interface SplitBackgroundImageProps extends SpacingProps {
  // New ResponsiveImage interface (for CMS)
  image?: ResponsiveImage;
  // NEW: Video support
  video?: string | Media;
  // Legacy props (for existing static content)
  src?: string;
  alt?: string;
  srcMobile?: string;
  altMobile?: string;
  // Common props
  width?: number;
  height?: number;
  topBackgroundColor?: string;
  bottomBackgroundColor?: string;
  bottomBackgroundHeight?: string;
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
}

export function SplitBackgroundImage({
  image,
  video,
  src,
  alt,
  srcMobile,
  altMobile,
  width = 1920,
  height = 1080,
  topBackgroundColor = 'bg-surface-light',
  bottomBackgroundColor = 'bg-surface-tertiary',
  bottomBackgroundHeight = 'h-[30%]',
  className,
  imageClassName,
  containerClassName,
  spacingTop,
  spacingBottom,
}: SplitBackgroundImageProps) {
  // Extract percentage from bottomBackgroundHeight (e.g., "h-[30%]" -> 30)
  const heightMatch = bottomBackgroundHeight.match(/\[(\d+)%\]/);
  const bottomHeightPercent = heightMatch ? parseInt(heightMatch[1]) : 30;
  const topHeightPercent = 100 - bottomHeightPercent;
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  // Check if we have video or image
  const hasVideo = !!video;
  
  // Handle video URL extraction
  let videoUrl = '';
  if (video) {
    if (typeof video === 'string') {
      videoUrl = video;
    } else if (video && typeof video === 'object' && 'url' in video) {
      videoUrl = video.url;
    }
  }
  
  // Handle both new ResponsiveImage and legacy props for images
  let desktopSrc, mobileSrc, imageAlt;
  
  if (!hasVideo) {
    if (image) {
      // New ResponsiveImage interface (CMS)
      desktopSrc = image.desktop;
      mobileSrc = image.mobile || image.desktop;
      imageAlt = image.alt || 'Image';
    } else if (src) {
      // Legacy props (existing static content)
      desktopSrc = src;
      mobileSrc = srcMobile || src;
      imageAlt = alt || 'Image';
    } else {
      // No media provided
      return null;
    }
  }

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
      <SectionContainer className={cn("relative z-10", containerClassName)}>
        <div className="relative w-full rounded-card overflow-hidden">
          {hasVideo ? (
            // Render video if provided
            <AutoPauseVideo
              src={videoUrl}
              className={cn("w-full h-auto object-cover", imageClassName)}
              autoPlay={true}
              muted={true}
              loop={true}
              playsInline={true}
              threshold={0.3}
            />
          ) : (
            // Render images (existing functionality)
            <>
              {/* Desktop Image */}
              <Image 
                src={desktopSrc || '/images/placeholder.jpg'} 
                alt={imageAlt || 'Image'} 
                width={width} 
                height={height} 
                className={cn("w-full h-auto object-cover hidden md:block", imageClassName)}
              />
              
              {/* Mobile Image - fallback to desktop if no mobile version */}
              <Image 
                src={mobileSrc || '/images/placeholder.jpg'}
                alt={altMobile || imageAlt || 'Image'} 
                width={width} 
                height={height} 
                className={cn("w-full h-auto object-cover block md:hidden", imageClassName)}
              />
            </>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}
