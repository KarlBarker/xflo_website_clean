import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedHeroProps {
  title: string;
  backgroundImage: string;
  clientLogo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  className?: string;
}

export function OptimizedHero({
  title,
  backgroundImage,
  clientLogo,
  className,
}: OptimizedHeroProps) {
  return (
    <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Optimized background image with priority loading */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority // Critical for LCP
          sizes="100vw"
          className="object-cover"
          quality={85} // Slightly reduce quality for faster loading
          fetchPriority="high"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content with optimized layout */}
      <div className="relative z-10 container-outer">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Client logo with optimized loading */}
          {clientLogo && (
            <div className="mb-4">
              <Image
                src={clientLogo.src}
                alt={clientLogo.alt}
                width={clientLogo.width || 200}
                height={clientLogo.height || 60}
                priority // Load client logo early
                fetchPriority="high"
                className="max-h-16 w-auto"
              />
            </div>
          )}

          {/* Optimized title with critical CSS class */}
          <h1 className="hero-title max-w-4xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}