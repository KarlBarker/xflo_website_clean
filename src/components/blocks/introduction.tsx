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
  variant?: 'default' | 'large' | 'xxl';
}

export function IntroductionSection({
  className,
  eyebrow,
  text = "",
  backgroundColor = 'primary',
  variant = 'default',
  spacingTop,
  spacingBottom,
}: IntroductionSectionProps) {
  // Debug: Log the eyebrow prop to see if it's being passed
  if (process.env.NODE_ENV === 'development') {
    console.log('IntroductionSection props:', { eyebrow, text: text?.substring(0, 50) + '...', variant, backgroundColor });
  }

  // Use full text without word limit
  const limitedText = text;
  
  // Get background theme for adaptive text colors
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);
  
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
            <p className="text-2xl font-light opacity-80 mb-6">
              {eyebrow}
            </p>
          )}
          <p className={cn(
            "text-left break-words",
            variant === 'xxl' 
              ? "title-8xl font-black" 
              : variant === 'large' 
                ? "title-5xl font-semibold" 
                : "text-intro-adaptive"
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
