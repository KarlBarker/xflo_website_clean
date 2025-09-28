import React from 'react';
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { getBackgroundTheme } from "@/lib/theme-utils";
import { getSpacingClasses, type SpacingProps } from "@/lib/spacing-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RichTextRenderer } from '@/components/ui/rich-text-renderer';
import type { LexicalContent } from '@/types/lexical';

interface AccordionItemType {
  id?: string;
  title: string;
  content: LexicalContent; // Rich text content
}

interface AccordionBlockProps extends SpacingProps {
  className?: string;
  title?: string;
  items: AccordionItemType[];
  backgroundColor?: string;
  defaultOpenIndex?: number; // Which item to open by default (0-based index)
}

export function AccordionBlock({
  className,
  title,
  items = [],
  backgroundColor = 'white',
  defaultOpenIndex,
  spacingTop,
  spacingBottom,
}: AccordionBlockProps) {
  // Use theme utilities for consistent color handling
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  // Determine text color based on background
  const textColorClass = bgContext === 'dark' ? 'text-content-inverse' : 'text-content-primary';

  // Default value for accordion (which items are open by default)
  const defaultValue = defaultOpenIndex !== undefined ? [`item-${defaultOpenIndex}`] : undefined;

  return (
    <div 
      className={cn("w-full", bgClass, topClass, bottomClass, className)}
      data-background={bgContext}
    >
      <SectionContainer>
        <div className="w-text mx-auto">
          {/* Optional Title */}
          {title && (
            <h2 className={cn("title-4xl font-semibold mb-8", textColorClass)}>
              {title}
            </h2>
          )}

          {/* Accordion */}
          <Accordion 
            type="multiple" 
            defaultValue={defaultValue}
            className={cn("space-y-4", textColorClass)}
          >
            {items.map((item, index) => (
              <AccordionItem 
                key={item.id || index} 
                value={`item-${index}`}
                className={cn(
                  "border rounded-lg px-6",
                  bgContext === 'dark' 
                    ? 'border-stroke-inverse' 
                    : 'border-stroke-primary'
                )}
              >
                <AccordionTrigger className={cn(
                  "text-lg font-semibold hover:no-underline py-4",
                  textColorClass
                )}>
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className={cn(
                  "pb-4 text-base",
                  textColorClass
                )}>
                  <div className="pt-2">
                    <RichTextRenderer content={item.content} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionContainer>
    </div>
  );
}

export default AccordionBlock;