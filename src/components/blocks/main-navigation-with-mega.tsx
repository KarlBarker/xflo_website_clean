"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AnimatedXfloLogo } from '@/components/ui/animated-xflo-logo';
import { AnimatedBurger } from '@/components/ui/animated-burger';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { MegaMenu } from '@/components/navigation/mega-menu';
import { cn } from '@/lib/utils';
import { NavigationData, defaultNavigationData, defaultMegaMenuData } from '@/types/navigation';

interface MainNavigationWithMegaProps {
  darkMode?: boolean;
  className?: string;
  floating?: boolean;
  sticky?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  navigationData?: NavigationData;
  useMegaMenu?: boolean; // Toggle between normal nav and mega menu
}

export function MainNavigationWithMega({ 
  darkMode = true, 
  className, 
  floating = false,
  sticky = false,
  onMobileMenuToggle,
  navigationData = defaultNavigationData,
  useMegaMenu = false // Default to false for backwards compatibility
}: MainNavigationWithMegaProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Extract navigation data with fallbacks
  const { mainMenuItems, mobileMenuItems, ctaButton, settings } = navigationData || defaultNavigationData;

  // Handle window resize to properly detect mobile/desktop
  // Using 1024px breakpoint for navigation (wider than standard 768px)
  React.useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth < 1024; // Custom navigation breakpoint
      setIsMobile(isMobileSize);
      
      // Close all menus on resize to prevent state issues
      if (isMobileSize && isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
        setIsMobileMenuOpen(false);
      } else if (!isMobileSize && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setIsMegaMenuOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMegaMenuOpen, isMobileMenuOpen]);
  
  // Handle menu toggle - determines whether to open mobile menu or mega menu
  const handleMenuToggle = (newIsOpen: boolean) => {
    if (useMegaMenu) {
      // Desktop: Open mega menu
      // Mobile: Open mobile menu 
      if (!isMobile) {
        setIsMegaMenuOpen(newIsOpen);
        setIsMobileMenuOpen(false);
      } else {
        setIsMobileMenuOpen(newIsOpen);
        setIsMegaMenuOpen(false);
      }
    } else {
      // Original behavior - only mobile menu
      setIsMobileMenuOpen(newIsOpen);
      setIsMegaMenuOpen(false);
    }
    
    onMobileMenuToggle?.(newIsOpen);
  };

  // Close both menus
  const handleCloseMenus = () => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    onMobileMenuToggle?.(false);
  };

  // Determine if any menu is open
  const isAnyMenuOpen = isMobileMenuOpen || isMegaMenuOpen;
  
  // For standard nav (not sticky), use design system colors
  // When mobile menu is open and sticky, show dark text instead of blend mode white
  const textColor = darkMode ? 'text-content-inverse' : 'text-content-primary';
  const stickyTextColor = (sticky && !isAnyMenuOpen) ? 'text-content-inverse' : textColor;
  
  // Wrapper classes based on sticky prop  
  const wrapperClasses = cn(
    'w-full',
    sticky && 'fixed top-1 left-0 right-0 z-50',
    floating && 'absolute top-0 left-0 z-50'
  );
  
  // Apply blend mode styling for sticky nav, but disable when any menu is open
  const blendStyles = (sticky && !isAnyMenuOpen) ? {
    backgroundColor: 'white',
    mixBlendMode: 'difference' as const
  } : undefined;

  return (
    <>
      <div className={cn(wrapperClasses, className)} style={blendStyles}>
        <div className="w-full -mt-4">
          <div className="container-nav flex items-center justify-between">
            {/* Logo */}
            {settings.showLogo && (
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center" aria-label="Home page">
                  <AnimatedXfloLogo
                    className={cn(
                      "h-6 w-auto",
                      stickyTextColor, // This will apply currentColor theming
                      sticky && !isAnyMenuOpen ? "nav-light" : darkMode ? "nav-light" : "nav-dark" // Invert for blend mode
                    )}
                  />
                </Link>
              </div>
            )}
            
            {/* Desktop Navigation - Show only if NOT using mega menu */}
            {!useMegaMenu && (
              <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
                {mainMenuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      'text-navigation font-navigation hover:text-content-brand transition-colors',
                      stickyTextColor
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            )}
            
            {/* Spacer for mobile or mega menu to push burger menu right */}
            <div className={cn(
              "flex-1",
              useMegaMenu ? "" : "md:hidden"
            )}></div>
            
            {/* Navigation Buttons - Login (desktop only) + Book Demo */}
            <div className="flex items-center gap-3 pt-6 pb-2 mt-2">
              {/* Login - Ghost Button - Desktop Only */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hidden md:inline-flex text-sm font-semibold focus:ring-0 focus:ring-offset-0 group",
                  stickyTextColor === 'text-content-inverse'
                    ? "text-content-inverse hover:bg-content-inverse/10"
                    : "text-content-primary hover:bg-content-primary/10"
                )}
                asChild
              >
                <Link href="https://app.xflo.ai">
                  Login
                  <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Book Demo - Outlined Button */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-sm font-semibold focus:ring-0 focus:ring-offset-0",
                  stickyTextColor === 'text-content-inverse'
                    ? "text-content-inverse border-content-inverse hover:bg-content-inverse hover:text-content-primary"
                    : "text-content-primary border-content-primary hover:bg-content-primary hover:text-content-inverse"
                )}
                onClick={() => {
                  window.open('https://calendar.app.google/HbpUtr9XuvuYuhxU7', '_blank');
                }}
              >
                Book a Demo
              </Button>
            </div>

            {/* BURGER MENU - TEMPORARILY HIDDEN - UNCOMMENT TO RESTORE */}
            {/* <div className={cn(
              useMegaMenu ? "flex" : "md:hidden"
            )}>
              <div className={cn("pt-5 pb-2 -mr-4", isAnyMenuOpen && "relative z-50")}>
                <AnimatedBurger
                  isOpen={isAnyMenuOpen}
                  onClick={() => handleMenuToggle(!isAnyMenuOpen)}
                  darkMode={darkMode || sticky}
                  aria-label="Toggle menu"
                  aria-expanded={isAnyMenuOpen}
                />
              </div>
            </div> */}
            
            {/* CTA Button - Hidden on mobile, adjust visibility based on mega menu */}
            {!useMegaMenu && (
              <div className="hidden md:flex flex-shrink-0">
                <Button 
                  variant={ctaButton.variant}
                  size="default"
                  className={cn(
                    "group",
                    stickyTextColor === 'text-content-inverse' 
                      ? "text-content-inverse border-content-inverse hover:bg-content-inverse hover:text-content-primary" 
                      : ""
                  )}
                  asChild
                >
                  <Link href={ctaButton.href}>
                    {ctaButton.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Traditional mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMenus}
        navigationItems={mobileMenuItems || mainMenuItems}
      />

      {/* Mega Menu - Desktop mega menu */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={handleCloseMenus}
        megaMenuData={navigationData.megaMenuData || defaultMegaMenuData}
      />
    </>
  );
}

export default MainNavigationWithMega;