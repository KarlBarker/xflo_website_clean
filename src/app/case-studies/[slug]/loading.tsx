import { StickyNavigation } from '@/components/blocks/sticky-navigation';

export default function CaseStudyLoading() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Sticky Navigation */}
      <StickyNavigation />
      
      <div className="relative z-10 w-full">
        {/* Hero Section Skeleton */}
        <div className="relative h-screen bg-surface-primary" data-nav-theme="dark">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="container-inner text-center">
              {/* Client Logo Skeleton */}
              <div className="w-48 h-12 bg-surface-tertiary/20 rounded animate-pulse mx-auto mb-8" />
              
              {/* Title Skeleton */}
              <div className="space-y-4">
                <div className="h-16 bg-surface-tertiary/20 rounded animate-pulse max-w-4xl mx-auto" />
                <div className="h-16 bg-surface-tertiary/20 rounded animate-pulse max-w-2xl mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Blocks Skeleton */}
        <div className="space-y-24">
          {/* Introduction Block */}
          <div className="bg-surface-primary py-24" data-nav-theme="dark">
            <div className="container-inner">
              <div className="w-text mx-auto space-y-4">
                <div className="h-8 bg-surface-tertiary/20 rounded animate-pulse" />
                <div className="h-8 bg-surface-tertiary/20 rounded animate-pulse max-w-3xl" />
                <div className="h-8 bg-surface-tertiary/20 rounded animate-pulse max-w-2xl" />
              </div>
            </div>
          </div>

          {/* Body Content Block */}
          <div className="py-24">
            <div className="container-inner">
              <div className="w-text mx-auto space-y-6">
                <div className="h-6 bg-surface-tertiary rounded animate-pulse max-w-xl" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-surface-tertiary rounded animate-pulse" />
                  ))}
                  <div className="h-4 bg-surface-tertiary rounded animate-pulse max-w-3xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Image Block */}
          <div className="py-24">
            <div className="container-inner">
              <div className="aspect-[16/9] bg-surface-tertiary rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Stats Block */}
          <div className="bg-surface-tertiary py-24">
            <div className="container-inner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center space-y-4">
                    <div className="h-16 w-32 bg-surface-light rounded animate-pulse mx-auto" />
                    <div className="h-6 bg-surface-light rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Gallery Skeleton */}
        <div className="py-24 bg-surface-light">
          <div className="container-outer">
            <div className="mb-12">
              <div className="h-10 bg-surface-tertiary rounded animate-pulse max-w-xs" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-surface-tertiary rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-6 bg-surface-tertiary rounded animate-pulse" />
                    <div className="h-4 bg-surface-tertiary rounded animate-pulse max-w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}