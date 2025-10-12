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

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id?: string;
  category: string;
  items: FAQItem[];
}

interface FAQSectionProps extends SpacingProps {
  className?: string;
  title?: string;
  subtitle?: string;
  categories: FAQCategory[];
  backgroundColor?: string;
  layout?: 'single-column' | 'categories';
}

export function FAQSection({
  className,
  title = "Frequently Asked Questions",
  subtitle,
  categories = [],
  backgroundColor = 'white',
  layout = 'categories',
  spacingTop,
  spacingBottom,
}: FAQSectionProps) {
  // Use theme utilities for consistent color handling
  const { bgClass, bgContext } = getBackgroundTheme(backgroundColor);

  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);

  // Determine text color based on background
  const textColorClass = bgContext === 'dark' ? 'text-content-inverse' : 'text-content-primary';
  const subtleTextColor = bgContext === 'dark' ? 'text-content-inverse/70' : 'text-content-primary/70';

  return (
    <div
      className={cn("w-full", bgClass, topClass, bottomClass, className)}
      data-background={bgContext}
    >
      <SectionContainer>
        <div className="w-full max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            {title && (
              <h2 className={cn("title-5xl font-semibold mb-4", textColorClass)}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn("text-xl", subtleTextColor)}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Categories Layout - Categories as accordions with nested questions */}
          {layout === 'categories' ? (
            <Accordion
              type="single"
              collapsible
              defaultValue="category-0"
              className={cn("space-y-6", textColorClass)}
            >
              {categories.map((category, categoryIndex) => (
                <AccordionItem
                  key={category.id || categoryIndex}
                  value={`category-${categoryIndex}`}
                  className={cn(
                    "border rounded-lg transition-colors !border-b",
                    bgContext === 'dark'
                      ? 'border-neutral-700'
                      : 'border-stroke-primary'
                  )}
                >
                  {/* Category as Accordion Trigger */}
                  <AccordionTrigger className={cn(
                    "text-2xl font-semibold hover:no-underline px-6 py-6 gap-4",
                    textColorClass
                  )}>
                    {category.category}
                  </AccordionTrigger>

                  {/* Nested Questions Accordion */}
                  <AccordionContent className="pb-6 px-6">
                    <Accordion
                      type="single"
                      collapsible
                      className={cn("space-y-4 mt-4", textColorClass)}
                    >
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem
                          key={item.id || `${categoryIndex}-${itemIndex}`}
                          value={`question-${categoryIndex}-${itemIndex}`}
                          className={cn(
                            "border rounded-lg px-6 transition-colors !border-b",
                            bgContext === 'dark'
                              ? 'border-neutral-700 hover:bg-surface-secondary/10'
                              : 'border-stroke-primary hover:bg-surface-tertiary/30'
                          )}
                        >
                          <AccordionTrigger className={cn(
                            "text-lg font-semibold hover:no-underline py-5 gap-4",
                            textColorClass
                          )}>
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className={cn(
                            "pb-5 text-base leading-relaxed",
                            subtleTextColor
                          )}>
                            <div className="pt-2">
                              {item.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            // Single Column Layout (all FAQs together)
            <Accordion
              type="single"
              collapsible
              className={cn("space-y-4", textColorClass)}
            >
              {categories.flatMap((category, categoryIndex) =>
                category.items.map((item, itemIndex) => (
                  <AccordionItem
                    key={item.id || `${categoryIndex}-${itemIndex}`}
                    value={`item-${categoryIndex}-${itemIndex}`}
                    className={cn(
                      "border rounded-lg px-6 transition-colors !border-b",
                      bgContext === 'dark'
                        ? 'border-neutral-700 hover:bg-surface-secondary/10'
                        : 'border-stroke-primary hover:bg-surface-tertiary/30'
                    )}
                  >
                    <AccordionTrigger className={cn(
                      "text-lg font-semibold hover:no-underline py-5 gap-4",
                      textColorClass
                    )}>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className={cn(
                      "pb-5 text-base leading-relaxed",
                      subtleTextColor
                    )}>
                      <div className="pt-2">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}

export default FAQSection;
