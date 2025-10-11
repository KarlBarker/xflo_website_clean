import React from 'react';
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { getSpacingClasses, type SpacingProps } from "@/lib/spacing-utils";
import { getBackgroundTheme } from "@/lib/theme-utils";

interface IntroductionSectionProps extends SpacingProps {
  className?: string;
  eyebrow?: string;
  text?: string;
  backgroundColor?: string;
  textColor?: string; // CMS text color: 'auto', 'light', 'dark', 'brand'
  variant?: 'default' | 'large' | 'xxl';
}

// Helper function to get text color class based on CMS textColor value
const getTextColorClass = (textColor?: string, bgContext?: string): string => {
  // Normalize the text color value (CMS might send with capitals or spaces)
  const normalized = textColor?.toLowerCase().replace(/\s+/g, '-') || 'auto';

  // If auto (or not specified), use the background context to determine
  if (normalized === 'auto' || normalized === 'auto-(recommended)') {
    return bgContext === 'dark' ? 'text-content-inverse' : 'text-content-primary';
  }

  // Map CMS text color values to Tailwind classes
  const colorMap: Record<string, string> = {
    'light': 'text-content-inverse',      // Light text (white)
    'light-text': 'text-content-inverse',
    'dark': 'text-content-primary',       // Dark text
    'dark-text': 'text-content-primary',
    'brand': 'text-content-brand',        // Brand red
    'brand-red': 'text-content-brand',
  };

  return colorMap[normalized] || 'text-content-primary';
};

export function IntroductionSection({
  className,
  eyebrow,
  text = "",
  backgroundColor = 'primary',
  textColor,
  variant = 'default',
  spacingTop,
  spacingBottom,
}: IntroductionSectionProps) {
  // Debug: Log the props to see what's being passed
  if (process.env.NODE_ENV === 'development') {
    console.log('IntroductionSection props:', {
      eyebrow,
      text: text?.substring(0, 50) + '...',
      variant,
      backgroundColor,
      textColor
    });
  }

  // Use full text without word limit
  const limitedText = text;

  // Get background theme for adaptive text colors
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);

  // Get text color class based on CMS textColor field or auto-detect from background
  const textColorClass = getTextColorClass(textColor, bgContext);

  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  return (
    <div
      className={cn("w-full", bgClass, topClass, bottomClass, className)}
      data-background={bgContext}
    >
      <SectionContainer>
        <div className={(variant === 'large' || variant === 'xxl') ? "w-full max-w-5xl" : "w-text"}>
          {eyebrow && (
            <p className={cn("text-2xl font-light opacity-80 mb-6", textColorClass)}>
              {eyebrow}
            </p>
          )}
          <p className={cn(
            "text-left break-words",
            textColorClass,
            variant === 'xxl'
              ? "title-8xl font-black"
              : variant === 'large'
                ? "title-5xl font-semibold"
                : "text-intro"
          )}>
            {limitedText?.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        </div>
      </SectionContainer>
    </div>
  );
}
