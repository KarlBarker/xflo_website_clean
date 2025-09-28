"use client"

import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GalleryCard } from '@/components/ui/gallery-card';
import { SectionContainer } from './section-container';

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  client?: string;
  logo?: string;
}

interface CarouselSliderProps {
  title?: string;
  description?: string;
  items: ProjectItem[];
  className?: string;
}

export function CarouselSlider({
  title = "More of our work...",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences. These case studies showcase real-world applications and success stories.",
  items,
  className,
}: CarouselSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollDistance = window.innerWidth < 768 ? container.clientWidth : 320;
      container.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollDistance = window.innerWidth < 768 ? container.clientWidth : 320;
      container.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={cn("w-full bg-surface-light py-12", className)}>
      {/* Header - Use same container as other blocks */}
      <SectionContainer leftAligned={false}>
        <div className="mb-12">
          <h2 className="title-3xl font-featured text-content-primary mb-6">
            {title}
          </h2>
          <p className="text-lg text-content-primary w-text leading-relaxed">
            {description}
          </p>
        </div>
      </SectionContainer>

      {/* Cards - Align with content above, extend to viewport edge */}
      <div className="relative mb-8">
        <div className="container-outer">
          <div className="container-inner-no-pad">
            <div 
              ref={scrollContainerRef}
              className="flex gap-0 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{
                scrollSnapType: 'x mandatory',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                marginRight: 'calc(-50vw + 50%)',
                paddingRight: 'calc(50vw - 50%)',
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full md:w-auto"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <GalleryCard
                    title={item.title}
                    href={item.href}
                    image={item.image}
                    logo={item.logo}
                    client={item.client}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Use same container as other blocks */}
      <SectionContainer leftAligned={false}>
        <div className="flex justify-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="h-10 w-10 rounded-full bg-surface-light shadow-sm border border-stroke-muted hover:bg-surface-tertiary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-content-primary hover:text-content-secondary transition-colors" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="h-10 w-10 rounded-full bg-surface-light shadow-sm border border-stroke-muted hover:bg-surface-tertiary transition-colors"
          >
            <ArrowRight className="h-5 w-5 text-content-primary hover:text-content-secondary transition-colors" />
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
}

export default CarouselSlider;