"use client";

import React, { useState } from 'react';
import { MainNavigation } from './main-navigation';
import { MainNavigationWithMega } from './main-navigation-with-mega';
import { cn } from '@/lib/utils';
import { NavigationData } from '@/types/navigation';

interface StickyNavigationMegaProps {
  className?: string;
  navigationData?: NavigationData;
  useMegaMenu?: boolean; // Toggle between navigation types
}

export function StickyNavigationMega({ 
  className, 
  navigationData, 
  useMegaMenu = false 
}: StickyNavigationMegaProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Choose which navigation component to use based on CMS setting or prop
  const shouldUseMegaMenu = useMegaMenu || navigationData?.settings?.useMegaMenu;
  const NavigationComponent = shouldUseMegaMenu ? MainNavigationWithMega : MainNavigation;

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
          !isMenuOpen && "bg-surface-light mix-blend-difference",
          isMenuOpen && "bg-transparent",
          className
        )}
      >
        <NavigationComponent 
          floating={true}
          darkMode={true}
          sticky={true}
          onMobileMenuToggle={setIsMenuOpen}
          navigationData={navigationData}
          {...(shouldUseMegaMenu && { useMegaMenu: true })}
        />
      </div>
    </>
  );
}

export default StickyNavigationMega;