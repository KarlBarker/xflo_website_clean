import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { getSpacingClasses, type SpacingProps } from "@/lib/spacing-utils";
import { getMediaUrl, type Media } from "@/lib/payload";

interface Service {
  id?: string;
  title: string;
  description?: string;
  icon?: string; // Legacy text/emoji support
  iconImage?: Media; // Single SVG upload - color changes via CSS
  url?: string;
  linkText?: string;
}

interface ServicesGridProps extends SpacingProps {
  className?: string;
  headerText?: string;
  services: Service[];
  backgroundColor?: 'light' | 'tertiary' | 'primary';
  columns?: 2 | 3 | 4;
}

export function ServicesGrid({
  className,
  headerText = "Our Services",
  services = [],
  backgroundColor = 'light',
  columns = 3,
  spacingTop,
  spacingBottom,
}: ServicesGridProps) {
  // Debug: Log the backgroundColor value from CMS
  console.log('ServicesGrid backgroundColor:', backgroundColor);
  
  // Debug: Log the services data to see what fields we're getting
  console.log('ServicesGrid services:', services);
  // Background color mapping
  const bgClass = {
    'light': 'bg-surface-light',
    'tertiary': 'bg-surface-tertiary',
    'primary': 'bg-surface-primary'
  }[backgroundColor];

  // Text color based on background - handle all background types
  const textColorClass = backgroundColor === 'primary' ? 'text-content-inverse' : 'text-content-primary';

  // Debug: Log the text color class being applied
  console.log('ServicesGrid textColorClass for background', backgroundColor, ':', textColorClass);
  
  // Card background and text colors - cards match the section background
  const getCardColors = (sectionBg: string) => {
    if (sectionBg === 'primary') {
      // Dark section background - use dark cards with light text
      return {
        cardBg: 'bg-surface-primary', // Same as section background
        cardTextColor: 'text-content-inverse',
        cardTextMuted: 'text-content-inverse',
        cardLinkColor: 'text-content-inverse', // White text on dark background
        iconBg: 'bg-surface-light'
      };
    } else if (sectionBg === 'tertiary') {
      // Light gray section background - use light gray cards
      return {
        cardBg: 'bg-surface-tertiary', // Same as section background
        cardTextColor: 'text-content-primary',
        cardTextMuted: 'text-content-primary',
        cardLinkColor: 'text-content-primary', // Dark text on light background
        iconBg: 'bg-surface-primary'
      };
    } else {
      // Light section background - use light cards
      return {
        cardBg: 'bg-surface-light', // Same as section background
        cardTextColor: 'text-content-primary',
        cardTextMuted: 'text-content-primary',
        cardLinkColor: 'text-content-primary', // Dark text on light background
        iconBg: 'bg-surface-primary'
      };
    }
  };
  
  const cardColors = getCardColors(backgroundColor);
  
  // Debug: Log the computed card colors
  console.log('ServicesGrid cardColors:', cardColors);

  // Grid column classes
  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  // Debug spacing
  console.log('ServicesGrid spacing debug:', {
    spacingTop,
    spacingBottom,
    topClass,
    bottomClass
  });

  return (
    <div className={cn("w-full", bgClass, topClass, bottomClass, className)}>
      <SectionContainer>
        {/* Header Section */}
        <div className="mb-12">
          <h2 className={cn("title-3xl font-semibold", textColorClass)}>
            {headerText}
          </h2>
        </div>

        {/* Services Grid */}
        <div className={cn(
          "grid gap-12 md:gap-16",
          gridColsClass
        )}>
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className={cn("group py-6 pr-6 rounded-lg", cardColors.cardBg)}
            >
              <div className="w-full h-full flex flex-col">
                {/* Service Icon */}
                {(service.iconImage || service.icon) && (
                  <div className="mb-4">
                    <div className="h-16 flex items-center justify-start">

                      {/* Single SVG icon with CSS color adaptation */}
                      {service.iconImage ? (
                        (() => {
                          const iconData = service.iconImage;

                          return (
                            <Image
                              src={getMediaUrl(iconData)}
                              alt={`${service.title} icon`}
                              width={64}
                              height={64}
                              className={cn(
                                "w-16 h-16 object-contain",
                                // Apply CSS filter to invert colors on dark backgrounds
                                backgroundColor === 'primary' ? 'filter brightness-0 invert' : ''
                              )}
                            />
                          );
                        })()
                      ) : (
                        /* Legacy text/emoji icons */
                        <div className={cn("w-16 h-16 rounded-lg flex items-center justify-center", cardColors.iconBg)}>
                          <span className={cn("text-2xl", cardColors.cardTextColor)}>
                            {service.icon}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Service Title */}
                <h3 className={cn("title-2xl md:title-3xl font-semibold mb-3", cardColors.cardTextColor)}>
                  {service.title}
                </h3>

                {/* Service Description - flex-grow pushes link to bottom */}
                {service.description && (
                  <p className={cn("text-base opacity-80 leading-normal flex-grow", cardColors.cardTextMuted)}>
                    {service.description}
                  </p>
                )}

                {/* Optional Service Link - always at bottom */}
                {service.url && (
                  <div className="mt-4">
                    <a 
                      href={service.url}
                      className={cn("text-sm font-featured uppercase tracking-wider", cardColors.cardLinkColor)}
                    >
                      {service.linkText || 'More'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}