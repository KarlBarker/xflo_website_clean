"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { getBackgroundTheme } from '@/lib/theme-utils';
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils';

interface CaseStudyBodyIntroProps extends SpacingProps {
  className?: string;
  intro?: string;
  backgroundColor?: string;
}

export function CaseStudyBodyIntro({
  className,
  intro = "",
  backgroundColor = 'white',
  spacingTop,
  spacingBottom,
}: CaseStudyBodyIntroProps) {
  // Use theme utilities for consistent color handling
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  return (
    <div className={cn("w-full", bgClass, topClass, bottomClass, className)} data-background={bgContext}>
      <SectionContainer>
        <div className="flex flex-col w-text mx-auto">
          <p className="text-body-xl-adaptive">
            {intro}
          </p>
        </div>
      </SectionContainer>
    </div>
  );
}