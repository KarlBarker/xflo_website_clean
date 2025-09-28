"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/logo-icon';
import { AnimatedBurger } from '@/components/ui/animated-burger';
import { MegaMenuData } from '@/types/navigation';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  megaMenuData: MegaMenuData;
}

export function MegaMenu({ isOpen, onClose, className, megaMenuData }: MegaMenuProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Organize sections into 3-column layout
  const organizeColumns = () => {
    const sections = megaMenuData.sections;
    const columns = [[], [], []] as Array<typeof sections>;
    
    // Distribute sections across columns
    sections.forEach((section, index) => {
      const columnIndex = index % 3;
      columns[columnIndex].push(section);
    });
    
    return columns;
  };

  const columns = organizeColumns();

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsAnimating(false);
    }, 2600);
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes slideOutToTop {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromRightBehind {
          from { transform: translateX(200%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromRightFarBehind {
          from { transform: translateX(300%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutToRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideOutToRightBehind {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(200%); opacity: 0; }
        }
        
        @keyframes slideOutToRightFarBehind {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(300%); opacity: 0; }
        }
        
        @keyframes cardSlideInFromRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes cardSlideOutToRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(50px); opacity: 0; }
        }
      `}</style>
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      style={{
        animation: isClosing 
          ? 'fadeOut 1.8s ease-out 0.8s both' 
          : isAnimating 
          ? 'fadeIn 0.5s ease-out' 
          : undefined
      }}
    >
      <div 
        className="absolute inset-x-0 top-0 bottom-0 bg-white border-b border-stroke-primary overflow-y-auto"
        style={{
          animation: isClosing 
            ? 'fadeOut 1.8s ease-out 0.8s both' 
            : isAnimating 
            ? 'slideInFromTop 0.5s ease-out' 
            : undefined
        }}
      >
        {/* Header Bar - exact same structure as main navigation */}
        <div className="w-full -mt-4">
          <div className="container-nav flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center" aria-label="Home page">
                <LogoIcon 
                  darkMode="False"
                  className="h-8 w-auto" 
                  aria-hidden="true"
                />
              </Link>
            </div>
            
            {/* Spacer to push burger to right */}
            <div className="flex-1"></div>
            
            <div className="flex">
              <div className="pt-5 pb-2 -mr-4 mt-2">
                <AnimatedBurger 
                  isOpen={true}
                  onClick={handleClose}
                  darkMode={false}
                  aria-label="Close menu"
                  aria-expanded={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu Content */}
        <div className="container-outer">
          <div className="container-outer-no-pad">
            <div className="pb-8 px-8 -mt-2">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full">
                {columns.map((column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="flex flex-col gap-2 h-full"
                    style={{
                      animation: isClosing 
                        ? `slideOutToRight${columnIndex === 0 ? 'FarBehind' : columnIndex === 1 ? 'Behind' : ''} 0.8s ease-in ${0.2 + columnIndex * 0.2}s both`
                        : isAnimating 
                        ? `slideInFromRight${columnIndex === 0 ? '' : columnIndex === 1 ? 'Behind' : 'FarBehind'} 1.0s ease-out ${0.6 - columnIndex * 0.2}s both` 
                        : undefined,
                      zIndex: 30 - columnIndex * 10
                    }}
                  >
                    {column.map((section, sectionIndex) => (
                      <div
                        key={section.title}
                        className={cn(
                          "bg-neutral-50 p-6 rounded-lg",
                          sectionIndex === 0 ? "min-h-[280px]" : "flex-1"
                        )}
                        style={{
                          animation: isClosing 
                            ? `cardSlideOutToRight 0.7s ease-in ${0.15 + (columnIndex * column.length + sectionIndex) * 0.05}s both`
                            : isAnimating 
                            ? `cardSlideInFromRight 0.8s ease-out ${0.2 + (columnIndex * 2 + sectionIndex) * 0.05}s both` 
                            : undefined
                        }}
                      >
                        <Link
                          href={section.href}
                          className={cn(
                            "group flex items-center justify-between text-2xl font-semibold transition-all mb-2 no-underline",
                            hoveredLink === section.href
                              ? "text-content-brand"
                              : "text-content-primary hover:text-content-brand"
                          )}
                          onMouseEnter={() => setHoveredLink(section.href)}
                          onMouseLeave={() => setHoveredLink(null)}
                        >
                          <span>{section.title}</span>
                          <Image
                            src="/icon_arrow.svg"
                            alt=""
                            width={24}
                            height={24}
                            className={cn(
                              "transition-all duration-200",
                              hoveredLink === section.href
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            )}
                          />
                        </Link>
                        <div className="w-full h-px bg-neutral-400 mb-4"></div>
                        <nav className="space-y-0.5">
                          {section.links.map((link, linkIndex) => (
                            <Link
                              key={linkIndex}
                              href={link.href}
                              className={cn(
                                "group flex items-center justify-between text-lg font-medium transition-all py-1 no-underline",
                                hoveredLink === link.href
                                  ? "text-content-brand font-semibold"
                                  : "text-neutral-500 hover:text-content-brand hover:font-semibold"
                              )}
                              onMouseEnter={() => setHoveredLink(link.href)}
                              onMouseLeave={() => setHoveredLink(null)}
                            >
                              <span>{link.title}</span>
                              <Image
                                src="/icon_arrow.svg"
                                alt=""
                                width={20}
                                height={20}
                                className={cn(
                                  "transition-all duration-200",
                                  hoveredLink === link.href
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                                )}
                              />
                            </Link>
                          ))}
                        </nav>
                      </div>
                    ))}
                    
                    {/* CTA Card - only in the last column */}
                    {columnIndex === 2 && (
                      <div 
                        className="bg-content-brand p-6 rounded-lg"
                        style={{
                          animation: isClosing 
                            ? 'cardSlideOutToRight 0.7s ease-in 0.45s both'
                            : isAnimating 
                            ? 'cardSlideInFromRight 0.8s ease-out 0.3s both' 
                            : undefined
                        }}
                      >
                        <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-4 2xl:gap-6">
                          <Link
                            href={megaMenuData.ctaSection.primaryButton.href}
                            className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-content-inverse border border-content-inverse rounded-lg font-medium hover:bg-content-inverse hover:text-content-brand transition-colors w-fit"
                          >
                            {megaMenuData.ctaSection.primaryButton.text}
                          </Link>
                          <Link
                            href={megaMenuData.ctaSection.phoneNumber.href}
                            className="text-lg font-semibold text-content-inverse hover:opacity-80 transition-opacity whitespace-nowrap"
                          >
                            {megaMenuData.ctaSection.phoneNumber.display}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default MegaMenu;