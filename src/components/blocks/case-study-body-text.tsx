import React from 'react';
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils';

interface CaseStudyBodyTextProps extends SpacingProps {
  className?: string;
  title: string;
  content: string | string[];
  backgroundColor?: 'white' | 'tertiary';
}

export function CaseStudyBodyText({
  className,
  title,
  content,
  backgroundColor = 'white',
  spacingTop,
  spacingBottom,
}: CaseStudyBodyTextProps) {
  const bgClass = backgroundColor === 'tertiary' ? 'bg-surface-tertiary' : 'bg-surface-light';
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  // Convert content to array if it's a string
  const contentArray = Array.isArray(content) ? content : [content];
  
  return (
    <div className={cn(`w-full ${bgClass}`, topClass, bottomClass, className)}>
      <SectionContainer>
        <div className="w-text mx-auto">
          <div className="flex flex-col gap-8">
            <h3 className="text-content-primary title-4xl font-semibold">
              {title}
            </h3>
            
            <div className="text-content-primary text-body-xl flex flex-col gap-6">
              {contentArray.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}