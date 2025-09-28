"use client";

import React, { useState } from 'react';
import { MainNavigationWithMega } from './main-navigation-with-mega';
import { cn } from '@/lib/utils';
import { NavigationData } from '@/types/navigation';

interface StickyNavigationProps {
  className?: string;
  navigationData?: NavigationData;
}

export function StickyNavigation({ className, navigationData }: StickyNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] bg-surface-primary text-content-inverse px-4 py-2 rounded focus-visible-ring"
      >
        Skip to main content
      </a>
      
      <div 
        className={cn(
          "fixed top-2 left-0 right-0 z-50",
          !isMobileMenuOpen && "bg-surface-light mix-blend-difference",
          isMobileMenuOpen && "bg-transparent",
          className
        )}
      >
        <MainNavigationWithMega 
          floating={true}
          darkMode={true}
          onMobileMenuToggle={setIsMobileMenuOpen}
          navigationData={navigationData}
          useMegaMenu={true}
        />
      </div>
    </>
  );
}