"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
  navigationItems: NavigationItem[];
}

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  navigationItems 
}: Omit<MobileMenuProps, 'darkMode'>) {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Focus management
  useEffect(() => {
    if (isOpen && menuRef.current) {
      setTimeout(() => {
        const firstLink = menuRef.current?.querySelector('a');
        if (firstLink) {
          (firstLink as HTMLElement).focus();
        }
      }, 100);
    }
  }, [isOpen]);
  
  // Don't return null - we need the element in DOM for transitions

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed top-0 right-0 h-full w-full max-w-md z-40 bg-surface-primary transition-all duration-700 ease-out",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        !isOpen && "pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onClick={onClose}
    >
      {/* Menu Content */}
      <nav className="h-full pt-24" onClick={(e) => e.stopPropagation()}>
        <div className="w-full pl-18 pr-8">
          <ul className="space-y-4">
            {navigationItems.map((item, index) => (
              <li
                key={item.title}
                className={cn(
                  "transform transition-all duration-600 ease-out",
                  isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                )}
                style={{
                  transitionDelay: isOpen ? `${700 + (index * 150)}ms` : '0ms'
                }}
              >
                <Link
                  href={item.href}
                  className="block text-body-xl font-semibold text-content-inverse hover:text-content-secondary no-underline hover:no-underline transition-colors duration-200"
                  style={{ letterSpacing: '-0.01em' }}
                  onClick={onClose}
                >
                  {item.title}
                </Link>
                
                {item.children && (
                  <ul className="mt-3 space-y-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.title}>
                        <Link
                          href={child.href}
                          className="block text-base text-content-secondary hover:text-content-inverse transition-colors duration-200"
                          onClick={onClose}
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          
          {/* Contact Info and Footer Links */}
          <div className="mt-16 space-y-2">
            {/* Phone */}
            <div
              className={cn(
                "transform transition-all duration-600 ease-out",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              )}
              style={{
                transitionDelay: isOpen ? `${700 + (navigationItems.length * 150)}ms` : '0ms'
              }}
            >
              <a 
                href="tel:01244567560" 
                className="block text-base font-light text-content-inverse hover:text-content-secondary transition-colors duration-200 underline"
                style={{ textUnderlineOffset: '4px' }}
              >
                01244 567560
              </a>
            </div>
            
            {/* Email */}
            <div
              className={cn(
                "transform transition-all duration-600 ease-out",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              )}
              style={{
                transitionDelay: isOpen ? `${700 + ((navigationItems.length + 1) * 150)}ms` : '0ms'
              }}
            >
              <a 
                href="mailto:studio@r3.agency" 
                className="block text-base font-light text-content-inverse hover:text-content-secondary transition-colors duration-200 break-all underline"
                style={{ textUnderlineOffset: '4px' }}
              >
                studio@r3.agency
              </a>
            </div>
            
            {/* Social Icons */}
            <div 
              className={cn(
                "flex gap-4 mt-6 transform transition-all duration-600 ease-out",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              )}
              style={{
                transitionDelay: isOpen ? `${700 + ((navigationItems.length + 2) * 150)}ms` : '0ms'
              }}
            >
              <a href="https://twitter.com" className="text-content-inverse hover:text-content-secondary transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-content-inverse hover:text-content-secondary transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://facebook.com" className="text-content-inverse hover:text-content-secondary transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://instagram.com" className="text-content-inverse hover:text-content-secondary transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
            
            {/* Footer Links */}
            <div 
              className={cn(
                "flex flex-col gap-2 mt-8 pt-8 transform transition-all duration-600 ease-out",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              )}
              style={{
                transitionDelay: isOpen ? `${700 + ((navigationItems.length + 3) * 150)}ms` : '0ms'
              }}
            >
              <Link 
                href="/privacy-policy" 
                className="text-xs font-light text-content-inverse hover:text-content-secondary transition-colors duration-200 uppercase underline"
                style={{ letterSpacing: '0.16em', textUnderlineOffset: '4px' }}
                onClick={onClose}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-xs font-light text-content-inverse hover:text-content-secondary transition-colors duration-200 uppercase underline"
                style={{ letterSpacing: '0.16em', textUnderlineOffset: '4px' }}
                onClick={onClose}
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}