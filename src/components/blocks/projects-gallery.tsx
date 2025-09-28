"use client"

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GalleryCard } from '@/components/ui/gallery-card';
import { getMediaUrl, type Media } from '@/lib/payload';

interface ProjectCard {
  id: string
  title: string
  slug: string
  client: {
    name: string
    logo?: {
      url: string
      alt?: string
    }
  }
  galleryImage?: {
    url: string
    alt?: string
  }
}

interface ProjectsGalleryProps {
  currentCaseStudyId: string
  projects: ProjectCard[]
  title?: string
  description?: string
  className?: string
}

export function ProjectsGallery({
  currentCaseStudyId,
  projects,
  title = "More of our work...",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences. These case studies showcase real-world applications and success stories.",
  className,
}: ProjectsGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter out current case study and limit to 6 projects
  const filteredProjects = projects
    .filter(project => String(project.id) !== String(currentCaseStudyId))
    .slice(0, 6)

  // Create placeholder projects to fill up to 3 total cards
  const placeholderProjects: ProjectCard[] = [
    {
      id: 'placeholder-1',
      title: 'Exciting Project Coming Soon',
      slug: '#',
      client: {
        name: 'Innovation Partner',
        logo: { url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTI4IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMzIiIGZpbGw9IiNlNWU1ZTUiIHJ4PSI0Ii8+PHRleHQgeD0iNjQiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+Q29taW5nIFNvb248L3RleHQ+PC9zdmc+', alt: 'Coming Soon' }
      },
      galleryImage: { url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDQ1MCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjNmNGY2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U1ZTVlNTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiLz48Y2lyY2xlIGN4PSIyMjUiIGN5PSIxODAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48dGV4dCB4PSIyMjUiIHk9IjE4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCI+8J+agDwvdGV4dD48dGV4dCB4PSIyMjUiIHk9IjI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==', alt: 'Coming Soon' }
    },
    {
      id: 'placeholder-2', 
      title: 'Digital Transformation Project',
      slug: '#',
      client: {
        name: 'Strategic Client',
        logo: { url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTI4IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMzIiIGZpbGw9IiNlNWU1ZTUiIHJ4PSI0Ii8+PHRleHQgeD0iNjQiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+Q29taW5nIFNvb248L3RleHQ+PC9zdmc+', alt: 'Coming Soon' }
      },
      galleryImage: { url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDQ1MCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjNmNGY2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U1ZTVlNTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiLz48Y2lyY2xlIGN4PSIyMjUiIGN5PSIxODAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48dGV4dCB4PSIyMjUiIHk9IjE4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCI+8J+agDwvdGV4dD48dGV4dCB4PSIyMjUiIHk9IjI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==', alt: 'Coming Soon' }
    },
    {
      id: 'placeholder-3',
      title: 'New Case Study',
      slug: '#',
      client: {
        name: 'Enterprise Partner',
        logo: { url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTI4IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMzIiIGZpbGw9IiNlNWU1ZTUiIHJ4PSI0Ii8+PHRleHQgeD0iNjQiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+Q29taW5nIFNvb248L3RleHQ+PC9zdmc+', alt: 'Coming Soon' }
      },
      galleryImage: { url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDQ1MCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjNmNGY2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U1ZTVlNTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiLz48Y2lyY2xlIGN4PSIyMjUiIGN5PSIxODAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz48dGV4dCB4PSIyMjUiIHk9IjE4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCI+8J+agDwvdGV4dD48dGV4dCB4PSIyMjUiIHk9IjI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==', alt: 'Coming Soon' }
    }
  ]

  // Combine real projects with placeholders to reach 3 total
  const targetCount = 3
  const projectsToShow = [...filteredProjects]
  
  // Add placeholders if needed
  const placeholdersNeeded = Math.max(0, targetCount - filteredProjects.length)
  if (placeholdersNeeded > 0) {
    projectsToShow.push(...placeholderProjects.slice(0, placeholdersNeeded))
  }

  // Helper function to safely get image URL
  const getImageUrl = (media: Media | { url: string; alt?: string } | string | undefined): string => {
    if (!media) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDQ1MCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ1MCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSIyMjUiIHk9IjIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='

    // If it's already a data URI (placeholder), return as-is
    if (typeof media === 'object' && media.url?.startsWith('data:')) {
      return media.url
    }

    // If it has id property, it's a full Media object
    if (typeof media === 'object' && 'id' in media) {
      return getMediaUrl(media as Media)
    }

    // If it's an object with url property (but not full Media), return the URL directly
    if (typeof media === 'object' && 'url' in media && typeof media.url === 'string') {
      return media.url
    }

    // If it's a string, pass to getMediaUrl
    if (typeof media === 'string') {
      return getMediaUrl(media)
    }

    // Fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDQ1MCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ1MCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSIyMjUiIHk9IjIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
  }

  const getLogoUrl = (logo: Media | { url: string; alt?: string } | string | undefined): string => {
    if (!logo) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTI4IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMzIiIGZpbGw9IiNlNWU1ZTUiIHJ4PSI0Ii8+PHRleHQgeD0iNjQiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+Tm8gTG9nbzwvdGV4dD48L3N2Zz4='

    // If it's already a data URI (placeholder), return as-is
    if (typeof logo === 'object' && logo.url?.startsWith('data:')) {
      return logo.url
    }

    // If it has id property, it's a full Media object
    if (typeof logo === 'object' && 'id' in logo) {
      return getMediaUrl(logo as Media)
    }

    // If it's an object with url property (but not full Media), return the URL directly
    if (typeof logo === 'object' && 'url' in logo && typeof logo.url === 'string') {
      return logo.url
    }

    // If it's a string, pass to getMediaUrl
    if (typeof logo === 'string') {
      return getMediaUrl(logo)
    }

    // Fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTI4IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMzIiIGZpbGw9IiNlNWU1ZTUiIHJ4PSI0Ii8+PHRleHQgeD0iNjQiIHk9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+Tm8gTG9nbzwvdGV4dD48L3N2Zz4='
  }

  // Convert to GalleryCard format
  const galleryItems = projectsToShow.map(project => ({
    id: project.id,
    title: project.title,
    href: String(project.id).startsWith('placeholder-') ? '#' : `/case-studies/${project.slug}`,
    image: getImageUrl(project.galleryImage),
    logo: getLogoUrl(project.client.logo),
    client: project.client.name,
  }))

  // Track scroll position to update active dot
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = window.innerWidth < 768 ? container.clientWidth : 474; // 450px card + 24px gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, galleryItems.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [galleryItems.length]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollDistance = window.innerWidth < 768 ? container.clientWidth : 474; // 450px + 24px gap
      container.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollDistance = window.innerWidth < 768 ? container.clientWidth : 474; // 450px + 24px gap
      container.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={cn("w-full bg-surface-light py-10", className)}>
      {/* Use SectionContainer structure for proper alignment to GREEN line */}
      <div className="container-outer">
        <div className="container-inner-no-pad">
          {/* Header - aligns to GREEN line */}
          <div className="mb-12">
            <h2 className="title-3xl font-featured text-content-primary mb-10">
              {title}
            </h2>
            <p className="text-body-xl font-standard text-content-muted w-text leading-relaxed">
              {description}
            </p>
          </div>

          {/* Navigation Arrows - aligns to GREEN line */}
          <div className="flex justify-start gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollLeft}
              className="h-10 w-10 rounded-full bg-surface-light shadow-sm border border-stroke-primary hover:bg-surface-tertiary"
            >
              <ArrowLeft className="h-5 w-5 text-content-muted" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollRight}
              className="h-10 w-10 rounded-full bg-surface-light shadow-sm border border-stroke-primary hover:bg-surface-tertiary"
            >
              <ArrowRight className="h-5 w-5 text-content-muted" />
            </Button>
          </div>
        </div>

        {/* Scrollable Cards Container - simple approach */}
        <div className="container-inner-no-pad">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollSnapType: 'x mandatory',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              marginRight: 'calc(-50vw + 50%)',
              paddingRight: 'calc(50vw - 50%)',
            }}
          >
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[calc(100vw-48px)] md:w-auto"
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

        {/* Pagination Dots - aligns to GREEN line */}
        <div className="container-inner-no-pad">
          <div className="flex justify-center gap-2 mt-8">
            {galleryItems.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  index === activeIndex ? "bg-interactive-primary" : "bg-surface-tertiary"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsGallery;