'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getMediaUrl } from '@/lib/payload';
import type { Media } from '@/lib/payload';

interface Award {
  id: string;
  organizationName: string;
  awardTitle: string;
  logo?: Media;
  url?: string;
}

interface AwardsGridProps {
  awards: Award[];
  columns?: 3 | 4 | 5 | 6;
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  className?: string;
}

export function AwardsGrid({
  awards,
  columns = 4,
  className
}: AwardsGridProps) {
  const [showAllOnMobile, setShowAllOnMobile] = useState(false);

  // Responsive grid columns based on selected column count
  const gridColsClass = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-6'
  }[columns];

  // On mobile (2 columns), show 10 awards (5 rows) initially
  const mobileLimit = 10;
  const shouldShowViewMore = awards.length > mobileLimit;

  return (
    <section 
      className={cn('w-full', className)}
    >
      <div className="container-outer">
        <div className="container-inner-no-pad">
          {/* Awards Grid - Desktop: Show all awards */}
          <div className={cn('hidden md:grid gap-6', gridColsClass)}>
            {awards.map((award) => {
              const AwardWrapper = award.url ? 'a' : 'div';
              
              return (
                <AwardWrapper
                  key={award.id}
                  href={award.url}
                  target={award.url ? '_blank' : undefined}
                  rel={award.url ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'group relative',
                    award.url && 'cursor-pointer'
                  )}
                >
                  <div className="bg-white rounded-lg p-2.5 h-52 flex flex-col transition-transform group-hover:scale-105">
                    {/* Award Logo Area */}
                    <div className="bg-surface-extra-light rounded h-32 flex items-center justify-center mb-3 p-4">
                      <div className="relative w-full h-full">
                        {award.logo ? (
                          <Image
                            src={getMediaUrl(award.logo)}
                            alt={award.logo.alt || `${award.organizationName} logo`}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-surface-tertiary rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-content-muted text-xs font-bold">
                              {award.organizationName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Award Text */}
                    <div className="flex flex-col justify-between flex-1">
                      <div className="space-y-1">
                        <p className="text-xs text-content-muted font-bold leading-tight">
                          {award.organizationName}
                        </p>
                        <p className="text-sm text-content-primary font-bold leading-tight">
                          {award.awardTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </AwardWrapper>
              );
            })}
          </div>

          {/* Awards Grid - Mobile: Show limited awards with view more */}
          <div className={cn('md:hidden grid gap-6', gridColsClass)}>
            {(showAllOnMobile ? awards : awards.slice(0, mobileLimit)).map((award) => {
              const AwardWrapper = award.url ? 'a' : 'div';
              
              return (
                <AwardWrapper
                  key={award.id}
                  href={award.url}
                  target={award.url ? '_blank' : undefined}
                  rel={award.url ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'group relative',
                    award.url && 'cursor-pointer'
                  )}
                >
                  <div className="bg-white rounded-lg p-2.5 h-52 flex flex-col transition-transform group-hover:scale-105">
                    {/* Award Logo Area */}
                    <div className="bg-surface-extra-light rounded h-32 flex items-center justify-center mb-3 p-4">
                      <div className="relative w-full h-full">
                        {award.logo ? (
                          <Image
                            src={getMediaUrl(award.logo)}
                            alt={award.logo.alt || `${award.organizationName} logo`}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-surface-tertiary rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-content-muted text-xs font-bold">
                              {award.organizationName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Award Text */}
                    <div className="flex flex-col justify-between flex-1">
                      <div className="space-y-1">
                        <p className="text-xs text-content-muted font-bold leading-tight">
                          {award.organizationName}
                        </p>
                        <p className="text-sm text-content-primary font-bold leading-tight">
                          {award.awardTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </AwardWrapper>
              );
            })}
          </div>

          {/* View More Button - Only show on mobile and if there are more awards */}
          {shouldShowViewMore && (
            <div className="md:hidden mt-8 text-center">
              <button
                onClick={() => setShowAllOnMobile(!showAllOnMobile)}
                className="text-content-brand font-medium text-base hover:underline"
                aria-label={showAllOnMobile ? 'Show fewer awards' : 'Show more awards'}
              >
                {showAllOnMobile ? 'View Less Awards' : 'View More Awards'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}