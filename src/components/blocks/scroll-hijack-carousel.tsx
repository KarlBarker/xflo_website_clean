'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getBackgroundTheme } from '@/lib/theme-utils';

// Simple cn utility function for combining classNames
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

interface ScrollHijackSlide {
  id: string;
  category: string;
  title: string;
  backgroundColor: 'light' | 'extra-light' | 'tertiary' | 'secondary' | 'primary';
  buttonText?: string;
  buttonUrl?: string;
}

interface ScrollHijackCarouselProps {
  slides: ScrollHijackSlide[];
  className?: string;
}

export function ScrollHijackCarousel({ slides, className }: ScrollHijackCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Debug: Basic slide count logging only (no object logging to avoid hydration issues)

  useEffect(() => {
    // Safety check inside useEffect - don't proceed if no slides
    if (!slides || slides.length === 0) {
      return;
    }

    const container = containerRef.current;
    const slidesContainer = slidesRef.current;
    if (!container || !slidesContainer) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;
      
      if (containerRect.top <= 0 && containerRect.bottom >= windowHeight) {
        // Calculate how far we've scrolled into the container
        const scrolledIntoView = Math.max(0, -containerRect.top);
        const maxScroll = Math.max(1, containerHeight - windowHeight);
        
        // Calculate progress (0 to 1)
        const rawProgress = scrolledIntoView / maxScroll;
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));
        
        // Ensure we don't go beyond the last slide
        const maxTranslate = (slides.length - 1) * 100;
        const translateAmount = clampedProgress * maxTranslate;
        
        // Clamp translateAmount to prevent wrapping
        const finalTranslateAmount = Math.max(0, Math.min(maxTranslate, translateAmount));
        
        slidesContainer.style.transform = `translate3d(-${finalTranslateAmount}vw, 0, 0)`;
        
        // Update current slide for indicators - ensure it never exceeds slides.length - 1
        const newSlide = Math.max(0, Math.min(slides.length - 1, Math.round(clampedProgress * (slides.length - 1))));
        if (newSlide !== currentSlide) {
          setCurrentSlide(newSlide);
        }
      } else if (containerRect.bottom < windowHeight) {
        // When scrolled past the container, ensure we stay on the last slide
        const maxTranslate = (slides.length - 1) * 100;
        slidesContainer.style.transform = `translate3d(-${maxTranslate}vw, 0, 0)`;
        if (currentSlide !== slides.length - 1) {
          setCurrentSlide(slides.length - 1);
        }
      } else {
        // Reset to first slide when not in view from above
        slidesContainer.style.transform = `translate3d(0, 0, 0)`;
        if (currentSlide !== 0) {
          setCurrentSlide(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [slides, currentSlide]);

  // Safety check - return early if no slides
  if (!slides || slides.length === 0) {
    console.error('ScrollHijackCarousel: No slides provided!', { slides });
    return (
      <div className="p-8 bg-yellow-100 border-2 border-yellow-400 text-yellow-800">
        <h3 className="font-bold">ScrollHijackCarousel Error</h3>
        <p>No slides data found. Check CMS configuration.</p>
        <pre className="mt-2 text-xs">{JSON.stringify({ slides }, null, 2)}</pre>
      </div>
    );
  }

  const getBackgroundClass = (bg: string, slideIndex?: number) => {
    // Map the actual CMS values to text classes
    switch (bg) {
      case 'extra-light':
        return 'text-content-primary';
      case 'secondary':
        return 'text-content-inverse';
      case 'primary':
        return 'text-content-inverse';
      default:
        return 'text-content-primary';
    }
  };

  const getBackgroundStyle = (bg: string): React.CSSProperties => {
    // Debug: Log the background value from CMS
    console.log('Carousel slide background value from CMS:', bg);

    // Use inline styles to override any Tailwind classes
    switch (bg) {
      case 'extra-light':
        return { backgroundColor: 'var(--color-surface-extra-light)' }; // Extra light grey (#fafafa)
      case 'light':
        return { backgroundColor: 'var(--color-surface-tertiary)' }; // Light grey
      case 'tertiary':
        return { backgroundColor: 'var(--color-surface-tertiary)' }; // Light grey (CMS sends 'tertiary')
      case 'secondary':
        return { backgroundColor: 'var(--color-secondary)' }; // Red color
      case 'primary':
        return { backgroundColor: 'var(--color-surface-primary)' }; // Black
      default:
        console.log('Using default white background for value:', bg);
        return { backgroundColor: 'var(--color-surface-light)' }; // White fallback
    }
  };

  const getCategoryStyle = (bg: string) => {
    // Check if background is dark based on actual CMS values
    const isDarkBackground = bg === 'secondary' || bg === 'primary';
    return isDarkBackground ? 'text-content-inverse' : 'text-content-primary';
  };

  const getButtonStyle = (bg: string) => {
    // Check if background is dark based on actual CMS values
    const isDarkBackground = bg === 'secondary' || bg === 'primary';

    if (isDarkBackground) {
      // Dark backgrounds: white border and text
      return 'border-content-inverse text-content-inverse hover:bg-content-inverse hover:text-primary-dark';
    } else {
      // Light backgrounds: dark border and text
      return 'border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-primary-light';
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ 
        // Height based on number of slides - this is key!
        height: `${slides.length * 100}vh`
      }}
    >
      {/* Sticky wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Horizontal slides container */}
        <div
          ref={slidesRef}
          className="flex h-full"
          style={{ 
            width: `${slides.length * 100}vw`,
            willChange: 'transform'
          }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={cn(
                "flex h-full items-center flex-shrink-0 w-screen",
                getBackgroundClass(slide.backgroundColor, slideIndex)
              )}
              style={getBackgroundStyle(slide.backgroundColor)}
              data-slide-bg={slide.backgroundColor}
              data-slide-index={slideIndex}
            >
              <div className="container-inner py-6">
                {/* Category */}
                <p
                  className={cn(
                    "text-2xl md:text-4xl font-light mb-4 md:mb-6",
                    getCategoryStyle(slide.backgroundColor)
                  )}
                  dangerouslySetInnerHTML={{ __html: slide.category.replace(/\n/g, '<br>') }}
                />
                
                {/* Title */}
                <h2
                  className="title-8xl font-black"
                  style={{ lineHeight: '1.1' }}
                  dangerouslySetInnerHTML={{ __html: slide.title.replace(/(\r\n|\r|\n)/g, '<br>') }}
                />
                
                {/* Button */}
                {slide.buttonText && (
                  <div className="mt-16 md:mt-24">
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className={getButtonStyle(slide.backgroundColor)}
                    >
                      <a href={slide.buttonUrl || '#'}>
                        {slide.buttonText}
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "scale-125 bg-content-inverse"
                  : "bg-content-inverse opacity-30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}