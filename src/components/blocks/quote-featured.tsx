import React from 'react';
import { cn } from '@/lib/utils';
import { SectionContainer } from './section-container';
import { getBackgroundTheme } from '@/lib/theme-utils';
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils';

interface QuoteFeaturedProps extends SpacingProps {
  quote: string;
  author: string;
  company?: string;
  className?: string;
  backgroundColor?: string;
}

export function QuoteFeatured({
  quote,
  author,
  company,
  className,
  backgroundColor = 'light',
  spacingTop,
  spacingBottom,
}: QuoteFeaturedProps) {
  // Use theme utilities for consistent color handling
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  return (
    <div 
      className={cn("w-full", bgClass, topClass, bottomClass, className)}
      data-background={bgContext}
    >
      <SectionContainer>
        <div className="flex flex-col gap-6 w-text mx-auto">
          {/* Quotation mark */}
          <div className="h-8 w-12">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 50 30"
            >
              <path
                d="M25.1269 0L17.2589 30H0L12.4365 0H25.1269ZM50 0L42.132 30H24.8731L37.1827 0H50Z"
                className="fill-content-secondary"
              />
            </svg>
          </div>
          
          {/* Quote text */}
          <p className="text-quote-featured-adaptive">
            {quote}
          </p>
          
          {/* Author and company */}
          <p className="text-body-xl text-content-muted font-semibold">
            {author}{company ? `, ${company}` : ''}
          </p>
        </div>
      </SectionContainer>
    </div>
  );
}
