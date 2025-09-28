import React from 'react';
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { getBackgroundTheme } from "@/lib/theme-utils";
import { getSpacingClasses, type SpacingProps } from "@/lib/spacing-utils";
import { RichTextRenderer } from '@/components/ui/rich-text-renderer';
import type { LexicalContent } from '@/types/lexical';

interface TwoColumnTextProps extends SpacingProps {
  className?: string;
  leftText?: LexicalContent; // Rich text content from CMS
  rightText?: LexicalContent; // Rich text content from CMS
  backgroundColor?: string;
}

export function TwoColumnText({
  className,
  leftText,
  rightText,
  backgroundColor = 'white',
  spacingTop,
  spacingBottom,
}: TwoColumnTextProps) {
  // Use theme utilities for consistent color handling
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  // Determine text color based on background
  const textColorClass = bgContext === 'dark' ? 'text-content-inverse' : 'text-content-primary';

  return (
    <div 
      className={cn("w-full", bgClass, topClass, bottomClass, className)}
      data-background={bgContext}
    >
      <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-24">
          {/* Left Column - Larger text, semi-bold (narrower) */}
          <div className={cn(
            "w-full md:col-span-5 title-4xl font-semibold leading-tight",
            textColorClass
          )}>
            {leftText && <RichTextRenderer content={leftText} />}
          </div>

          {/* Right Column - Normal text (wider) */}
          <div className={cn(
            "w-full md:col-span-7 text-base leading-relaxed",
            textColorClass
          )}>
            {rightText && <RichTextRenderer content={rightText} />}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}

export default TwoColumnText;