"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionContainer } from './section-container';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  className?: string;
  variant?: 'default' | 'homepage'; // homepage = larger text, video support
  clientLogo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundVideo,
  className,
  variant = 'default',
  clientLogo,
}: HeroSectionProps) {
  useEffect(() => {
    // DEBUG: Log video URL in browser console
    console.log('🎬 Hero Component - Browser Side:', {
      hasBackgroundVideo: !!backgroundVideo,
      backgroundVideoUrl: backgroundVideo,
      hasBackgroundImage: !!backgroundImage,
      backgroundImageUrl: backgroundImage
    });

    // Set CSS custom property for viewport height that accounts for mobile browser UI
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, [backgroundVideo, backgroundImage]);

  return (
    <div className={cn('relative w-full h-screen overflow-hidden', className)}>
      {/* Background Video or Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
            {/* Fallback to solid color if no background image */}
            {backgroundImage && (
              <Image
                src={backgroundImage}
                alt="Hero background"
                fill
                priority
                className="object-cover"
                sizes="100vw"
                fetchPriority="high"
              />
            )}
          </video>
        ) : backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full h-full bg-surface-primary" />
        )}
        {/* Enhanced gradient overlay for better text contrast */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(23, 23, 23, 0.85) 0%, rgba(23, 23, 23, 0.75) 25%, rgba(23, 23, 23, 0.6) 50%, rgba(23, 23, 23, 0.75) 75%, rgba(23, 23, 23, 0.85) 100%)'
        }}></div>
      </div>


      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end" role="region" aria-label="Hero section">
        <SectionContainer leftAligned={false} className="pb-16 md:pb-24">
          {clientLogo && (
            <div className="mb-4 md:mb-6">
              <div className="logo-container md:logo-container-large">
                <Image 
                  src={clientLogo.src} 
                  alt={clientLogo.alt} 
                  width={clientLogo.width || 225} 
                  height={clientLogo.height || 75} 
                  className="logo-standardized hero-client-logo"
                />
              </div>
            </div>
          )}
          {/* CMS-controlled title and subtitle */}
          <div className="space-y-4 md:space-y-6">
            <h1
              className={cn(
                "font-featured text-content-inverse w-full whitespace-pre-line",
                variant === 'homepage' ? 'title-8xl' : 'title-7xl'
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  "text-content-inverse font-light max-w-3xl whitespace-pre-line",
                  variant === 'homepage' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Bouncing scroll arrow indicator */}
          <div className="mt-8 md:mt-16">
            <div className="animate-bounce">
              <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}
