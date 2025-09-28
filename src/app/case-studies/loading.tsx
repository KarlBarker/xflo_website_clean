import { StickyNavigation } from '@/components/blocks/sticky-navigation';

export default function CaseStudiesLoading() {
  return (
    <div className="min-h-screen bg-surface-light">
      <StickyNavigation />
      
      <main className="pt-32 pb-24">
        <div className="container-inner">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-16 bg-surface-tertiary rounded animate-pulse max-w-2xl mx-auto mb-6" />
            <div className="h-6 bg-surface-tertiary rounded animate-pulse max-w-xl mx-auto" />
          </div>

          {/* Case Studies Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-card">
                {/* Image Skeleton */}
                <div className="aspect-[4/3] bg-surface-tertiary animate-pulse" />
                
                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                  {/* Logo Skeleton */}
                  <div className="h-8 w-24 bg-surface-tertiary rounded animate-pulse" />
                  
                  {/* Title Skeleton */}
                  <div className="space-y-2">
                    <div className="h-6 bg-surface-tertiary rounded animate-pulse" />
                    <div className="h-6 bg-surface-tertiary rounded animate-pulse max-w-3xl" />
                  </div>
                  
                  {/* Category Skeleton */}
                  <div className="h-4 w-20 bg-surface-tertiary rounded animate-pulse" />
                  
                  {/* CTA Skeleton */}
                  <div className="pt-4">
                    <div className="h-10 w-32 bg-surface-tertiary rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center mt-16">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-10 bg-surface-tertiary rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}