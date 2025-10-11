import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getMediaUrl } from '@/lib/payload';
import type { Media } from '@/lib/payload';

interface Logo {
  id: string;
  name: string;
  image: Media;
  url?: string;
  alt?: string;
}

interface LogoGridProps {
  logos: Logo[];
  columns?: 3 | 4 | 5 | 6;
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: string;
  spacingBottom?: string;
  className?: string;
}

export function LogoGrid({
  logos,
  columns = 5,
  backgroundColor = 'white',
  className
}: LogoGridProps) {
  const bgClass = {
    'white': 'bg-surface-light',
    'light-gray': 'bg-surface-tertiary',
    'primary': 'bg-surface-primary'
  }[backgroundColor];

  const navTheme = backgroundColor === 'primary' ? 'dark' : 'light';

  // Determine if background is dark to apply logo inversion
  const isDarkBackground = backgroundColor === 'primary';

  // Grid columns configuration for different screen sizes
  const gridColsClass = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-6'
  }[columns];

  return (
    <section
      className={cn('w-full', bgClass, className)}
      data-nav-theme={navTheme}
    >
      <div className="container-outer">
        <div className="container-inner-no-pad">
          <div className={cn(
            'grid gap-1 md:gap-4',
            gridColsClass
          )}>
            {logos.map((logo) => {
              const logoSrc = getMediaUrl(logo.image);
              const LogoWrapper = logo.url ? 'a' : 'div';

              return (
                <LogoWrapper
                  key={logo.id}
                  href={logo.url}
                  target={logo.url ? '_blank' : undefined}
                  rel={logo.url ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'relative flex items-center justify-center rounded-lg p-1 md:p-2 h-24 md:h-[156px]',
                    logo.url && 'cursor-pointer',
                    'transition-opacity hover:opacity-80'
                  )}
                >
                  <Image
                    src={logoSrc}
                    alt={logo.alt || logo.name || 'Client logo'}
                    fill
                    className={cn(
                      'object-contain',
                      isDarkBackground && 'invert brightness-0'
                    )}
                  />
                </LogoWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}