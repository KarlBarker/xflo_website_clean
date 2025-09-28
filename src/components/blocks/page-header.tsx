import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large' | 'xxl';
  fontWeight?: 'light' | 'semibold' | 'extrabold';
  backgroundColor?: 'light' | 'primary' | 'tertiary';
  textAlign?: 'left' | 'center';
  navClearance?: boolean; // Add 100px clearance for sticky navigation
  heroSpacing?: boolean; // Legacy field - maps to navClearance for backward compatibility
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  size = 'medium',
  fontWeight = 'semibold', 
  backgroundColor = 'light',
  textAlign = 'left',
  navClearance = false,
  heroSpacing = false, // Legacy support
  className 
}: PageHeaderProps) {
  // Background color mapping
  const bgClass = {
    'light': 'bg-surface-light',
    'primary': 'bg-surface-primary', 
    'tertiary': 'bg-surface-tertiary'
  }[backgroundColor];

  // Navigation theme based on background
  const navTheme = backgroundColor === 'primary' ? 'dark' : 'light';

  // Title size mapping to semantic classes
  const titleSizeClass = {
    'small': 'title-4xl',      // 32px/36px
    'medium': 'title-5xl',     // 40px/48px  
    'large': 'title-6xl',      // 44px/60px
    'extra-large': 'title-7xl', // 44px/72px (800 weight)
    'xxl': 'title-8xl'         // 96px (NEW - massive size)
  }[size];

  // Subtitle size mapping
  const subtitleSizeClass = {
    'small': 'title-2xl',      // 22px/24px
    'medium': 'title-3xl',     // 28px/30px
    'large': 'title-4xl',      // 32px/36px
    'extra-large': 'title-5xl', // 40px/48px
    'xxl': 'title-6xl'         // 60px (proportional to XXL title)
  }[size];

  // Font weight mapping to design system weights
  const titleFontClass = {
    'light': 'font-light',        // 300 weight
    'semibold': 'font-semibold',  // 600 weight  
    'extrabold': 'font-extrabold' // 800 weight
  }[fontWeight];

  // Text alignment classes
  const alignmentClass = textAlign === 'center' ? 'text-center' : 'text-left';

  // Content color based on background
  const textColorClass = backgroundColor === 'primary' ? 'text-content-inverse' : 'text-content-primary';

  // Nav clearance adds 100px margin to whatever spacing is selected
  // Support both navClearance (new) and heroSpacing (legacy) for backward compatibility
  const shouldAddClearance = navClearance || heroSpacing;
  const navClearanceClass = shouldAddClearance ? 'mt-25' : ''; // 100px additional top margin

  return (
    <section className={cn('w-full', bgClass, className)} data-nav-theme={navTheme}>
      <div className={navClearanceClass}>
        <div className="container-outer">
          <div className="container-inner-no-pad">
            <div className={cn('w-full', alignmentClass)}>
              <h1 
                className={cn(titleSizeClass, titleFontClass, textColorClass, 'mb-spacing-compact')}
                dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br>') }}
              />
              {subtitle && (
                <p className={cn(subtitleSizeClass, 'font-standard', textColorClass, 'opacity-80')}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}