import React from 'react'
import { cn } from '@/lib/utils'
import { SectionContainer } from './section-container'
import { getBackgroundTheme } from '@/lib/theme-utils'
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils'

interface QuoteStandardProps extends SpacingProps {
  content?: string;
  className?: string;
  backgroundColor?: string;
}

export function QuoteStandard({
  content = "Working with R3 Digital transformed how we engage with our customers. The Willow platform delivered exactly what we needed to modernize our sales process and boost revenue significantly.",
  className,
  backgroundColor = 'tertiary',
  spacingTop,
  spacingBottom,
}: QuoteStandardProps) {
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
        <div className="flex flex-row items-center justify-center">
          <div className="w-text mx-auto border-l border-secondary pl-8 md:pl-10 relative">
            <p className="text-quote-adaptive text-left">
              {content}
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
