"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { RichTextRenderer } from '@/components/ui/rich-text-renderer';
import { getBackgroundTheme } from '@/lib/theme-utils';
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils';
import type { LexicalContent } from '@/types/lexical';

interface BodyTextProps extends SpacingProps {
  content: LexicalContent; // Lexical rich text content
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: 'text' | 'container' | 'full';
  className?: string;
}

export function BodyText({
  content,
  backgroundColor = 'white',
  textAlign = 'left',
  maxWidth = 'text',
  className,
  spacingTop,
  spacingBottom,
}: BodyTextProps) {
  // Use theme utilities for consistent color handling
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  // Determine text color based on background
  const textColorClass = bgContext === 'dark' ? 'text-content-inverse' : 'text-content-primary';

  // Map textAlign to actual classes
  const alignClasses = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
  };

  // Map maxWidth to actual classes
  const maxWidthClasses = {
    'text': 'w-text mx-auto', // Design system text width (784px)
    'container': 'w-full max-w-none', // Full container width
    'full': 'w-full max-w-none', // Full width
  };

  return (
    <div 
      className={cn("w-full", bgClass, topClass, bottomClass, className)}
      data-background={bgContext}
    >
      <SectionContainer>
        <div className={cn(
          maxWidthClasses[maxWidth],
          alignClasses[textAlign],
          textColorClass, // Apply text color based on background
        )}>
          {/* Use RichTextRenderer if available, otherwise render as paragraphs */}
          {typeof RichTextRenderer !== 'undefined' ? (
            <RichTextRenderer content={content} />
          ) : (
            <div className="prose prose-lg max-w-none">
              {/* Fallback: render as simple text if RichTextRenderer doesn't exist */}
              {typeof content === 'string' ? (
                <p className="text-body-xl-adaptive">{content}</p>
              ) : (
                <p className="text-body-xl-adaptive">Rich text content</p>
              )}
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}

export default BodyText;