import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  name: string;
  url?: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  color?: 'brand' | 'primary';
  services: Service[];
}

interface ServicesSectionProps {
  eyebrow?: string;
  headline: string;
  categories: ServiceCategory[];
  badgeStyle?: 'extra-light-gray' | 'light-gray' | 'dark' | 'brand';
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  className?: string;
}

export function ServicesSection({
  eyebrow,
  headline,
  categories,
  badgeStyle = 'light-gray',
  backgroundColor = 'white',
  className
}: ServicesSectionProps) {

  const navTheme = backgroundColor === 'primary' ? 'dark' : 'light';

  // Get adaptive text colors based on background
  const getTextColor = () => backgroundColor === 'primary' ? 'text-content-inverse' : 'text-content-primary';

  // Badge style configuration
  const getBadgeClasses = (style: string) => {
    switch (style) {
      case 'extra-light-gray':
        return 'bg-surface-extra-light text-content-primary border-0 hover:bg-surface-light hover:text-content-brand transition-colors';
      case 'light-gray':
        return 'bg-surface-extra-light text-content-primary border-0 hover:bg-surface-light hover:text-content-brand transition-colors';
      case 'dark':
        return 'bg-surface-primary text-content-inverse border-0 hover:bg-surface-light hover:text-content-brand transition-colors';
      case 'brand':
        return 'bg-content-brand text-content-inverse border-0 hover:bg-surface-light hover:text-content-brand transition-colors';
      default:
        return 'bg-surface-tertiary text-content-primary border-0 hover:bg-surface-light hover:text-content-brand transition-colors';
    }
  };

  return (
    <section 
      className={cn('w-full', className)} 
      data-nav-theme={navTheme}
    >
      <div className="container-outer">
        <div className="container-inner-no-pad">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left Column - Headline */}
            <div className="flex flex-col justify-start lg:col-span-2">
              {eyebrow && (
                <p className={cn("text-2xl font-light mb-6", getTextColor())}>
                  {eyebrow}
                </p>
              )}
              <h2
                className={cn("title-3xl", getTextColor())}
                style={{ lineHeight: '1.3' }}
              >
                {headline}
              </h2>
            </div>

            {/* Right Column - Service Categories */}
            <div className="flex flex-col gap-12 lg:col-span-3">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col gap-6">
                  {/* Category Title */}
                  <div className="flex flex-col gap-4">
                    <h3 className={cn(
                      "title-4xl leading-tight",
                      getTextColor()
                    )}>
                      {category.title}
                    </h3>

                    {/* Decorative Line */}
                    <div className={cn("w-full h-px", backgroundColor === 'primary' ? 'bg-content-inverse' : 'bg-content-primary')} />
                  </div>

                  {/* Service Tags */}
                  <div className="flex flex-wrap gap-4">
                    {category.services.map((service) => {
                      // Helper function to ensure URL starts with /
                      const normalizeUrl = (url: string) => {
                        if (url.startsWith('http://') || url.startsWith('https://')) {
                          return url; // External URL - keep as is
                        }
                        return url.startsWith('/') ? url : `/${url}`;
                      };

                      // Determine if this is an external link
                      const isExternal = service.url && (
                        service.url.startsWith('http://') ||
                        service.url.startsWith('https://')
                      );

                      const BadgeComponent = (
                        <Badge
                          variant="secondary"
                          className={cn(
                            getBadgeClasses(badgeStyle),
                            "px-4 py-1 text-base font-standard rounded-md"
                          )}
                        >
                          {service.name}
                        </Badge>
                      );

                      if (!service.url) {
                        return (
                          <div key={service.id}>
                            {BadgeComponent}
                          </div>
                        );
                      }

                      if (isExternal) {
                        return (
                          <a
                            key={service.id}
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                          >
                            {BadgeComponent}
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={service.id}
                          href={normalizeUrl(service.url)}
                          className="cursor-pointer"
                        >
                          {BadgeComponent}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}