"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/ui/logo-icon';
import { AnimatedBurger } from '@/components/ui/animated-burger';
import { MobileMenu } from '@/components/ui/mobile-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { NavigationData, defaultNavigationData } from '@/types/navigation';

interface MainNavigationProps {
  darkMode?: boolean;
  className?: string;
  floating?: boolean;
  sticky?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  navigationData?: NavigationData;
}

export function MainNavigation({ 
  darkMode = true, 
  className, 
  floating = false,
  sticky = false,
  onMobileMenuToggle,
  navigationData = defaultNavigationData
}: MainNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract navigation data with fallbacks
  const { mainMenuItems, mobileMenuItems, ctaButton, settings } = navigationData || defaultNavigationData;
  
  // Notify parent when mobile menu toggles
  const handleMobileMenuToggle = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
    onMobileMenuToggle?.(newIsOpen);
  };
  
  // For standard nav (not sticky), use design system colors
  // When mobile menu is open and sticky, show dark text instead of blend mode white
  const textColor = darkMode ? 'text-content-inverse' : 'text-content-primary';
  const stickyTextColor = (sticky && !isOpen) ? 'text-content-inverse' : textColor;
  
  // Wrapper classes based on sticky prop  
  const wrapperClasses = cn(
    'w-full',
    sticky && 'fixed top-1 left-0 right-0 z-50',
    floating && 'absolute top-0 left-0 z-50'
    // No background for floating/absolute navigation - uses blend modes
  );
  
  // Apply blend mode styling for sticky nav, but disable when mobile menu is open
  const blendStyles = (sticky && !isOpen) ? {
    backgroundColor: 'white',
    mixBlendMode: 'difference' as const
  } : undefined;
  
  return (
    <div className={cn(wrapperClasses, className)} style={blendStyles}>
      <div className="w-full py-0 md:py-4">
        <div className="container-nav flex items-center justify-between">
          {/* Logo */}
          {settings.showLogo && (
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center" aria-label="Home page">
                <LogoIcon 
                  darkMode={darkMode ? "True" : "False"}
                  className="h-8 w-auto" 
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
          
          {/* Desktop Navigation - hidden on mobile */}
          <NavigationMenu className="hidden md:flex py-0" aria-label="Main navigation">
            <NavigationMenuList className="gap-12">
              {mainMenuItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger 
                        className={cn(
                          'text-navigation font-navigation bg-transparent hover:bg-transparent',
                          stickyTextColor
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <ListItem
                              key={child.title}
                              title={child.title}
                              href={child.href}
                              className={darkMode ? 'text-content-inverse hover:bg-surface-tertiary' : ''}
                            >
                              {child.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink 
                      asChild
                      className={cn(
                        'text-navigation font-navigation p-0',
                        stickyTextColor
                      )}
                    >
                      <Link href={item.href}>
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Spacer for mobile to push burger menu right */}
          <div className="flex-1 md:hidden"></div>
          
          {/* Mobile Navigation with custom menu */}
          <div className="md:hidden">
            <div className={cn("pt-3 pb-2 pr-2 -mr-2", isOpen && "relative z-50")}>
              <AnimatedBurger 
                isOpen={isOpen} 
                onClick={() => handleMobileMenuToggle(!isOpen)}
                darkMode={darkMode || sticky} // Always show white burger when sticky
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              />
            </div>
            
            <MobileMenu
              isOpen={isOpen}
              onClose={() => handleMobileMenuToggle(false)}
              navigationItems={mobileMenuItems || mainMenuItems}
            />
          </div>
          
          {/* CTA Button - Hidden on mobile */}
          <div className="flex-shrink-0">
            <Button 
              variant={ctaButton.variant}
              size="default"
              asChild
              className={cn(
                'text-button font-button rounded-button hidden md:flex',
                (sticky && !isOpen) ? 'border-stroke-inverse text-content-inverse hover:bg-surface-light hover:text-content-primary' : (
                  darkMode ? 'border-stroke-inverse text-content-inverse hover:bg-surface-light hover:text-content-primary' : 
                  'border-stroke-primary text-content-primary hover:bg-surface-primary hover:text-content-inverse'
                ),
                'bg-transparent'
              )}
            >
              <Link href={ctaButton.href}>
                {ctaButton.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  href: string;
  children?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            href={href}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>}
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
)
ListItem.displayName = "ListItem";