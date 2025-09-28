"use client"

import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from '@/components/insights/BlogPostCard';
import { SectionContainer } from './section-container';

interface FormattedBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    date: string;
  };
  readTime: string;
  excerpt: string;
  href: string;
}

interface BlogCarouselClientProps {
  title: string;
  description: string;
  blogPosts: FormattedBlogPost[];
  backgroundColor: 'white' | 'light-gray' | 'primary';
  className?: string;
}

export function BlogCarouselClient({
  title,
  description,
  blogPosts,
  backgroundColor,
  className,
}: BlogCarouselClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollDistance = window.innerWidth < 768 ? container.clientWidth : 550;
      container.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollDistance = window.innerWidth < 768 ? container.clientWidth : 550;
      container.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const bgClass = {
    'white': 'bg-surface-light',
    'light-gray': 'bg-surface-tertiary',
    'primary': 'bg-surface-primary'
  }[backgroundColor];

  const textColorClass = backgroundColor === 'primary' ? 'text-content-inverse' : 'text-content-primary';
  const textSecondaryClass = backgroundColor === 'primary' ? 'text-content-inverse' : 'text-content-primary';

  return (
    <div className={cn("w-full py-12", bgClass, className)}>
      {/* Header - Use same container as other blocks */}
      <SectionContainer leftAligned={false}>
        <div className="mb-12">
          <h2 className={cn("title-3xl font-featured mb-6", textColorClass)}>
            {title}
          </h2>
          <p className={cn("text-lg w-text leading-relaxed whitespace-pre-line", textSecondaryClass)}>
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
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{
                scrollSnapType: 'x mandatory',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                marginRight: 'calc(-50vw + 50%)',
                paddingRight: 'calc(50vw - 50%)',
              }}
            >
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex-shrink-0 w-[calc(100vw-72px)] md:w-[550px]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <BlogPostCard post={post} />
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
            className={cn(
              "h-10 w-10 rounded-full shadow-sm border transition-colors",
              backgroundColor === 'primary' 
                ? "bg-surface-primary border-stroke-inverse hover:bg-neutral-800" 
                : "bg-surface-light border-stroke-muted hover:bg-surface-tertiary"
            )}
          >
            <ArrowLeft className={cn(
              "h-5 w-5 transition-colors",
              backgroundColor === 'primary' ? "text-content-inverse" : "text-content-primary"
            )} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className={cn(
              "h-10 w-10 rounded-full shadow-sm border transition-colors",
              backgroundColor === 'primary' 
                ? "bg-surface-primary border-stroke-inverse hover:bg-neutral-800" 
                : "bg-surface-light border-stroke-muted hover:bg-surface-tertiary"
            )}
          >
            <ArrowRight className={cn(
              "h-5 w-5 transition-colors",
              backgroundColor === 'primary' ? "text-content-inverse" : "text-content-primary"
            )} />
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
}