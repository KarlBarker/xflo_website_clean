// Optimized imports to reduce bundle size
import { lazy } from 'react';

// Lazy load heavy components that aren't critical for initial render
export const LazyBentoGrid = lazy(() => 
  import('@/components/blocks/bento-grid').then(mod => ({ 
    default: mod.BentoGrid 
  }))
);

export const LazySmartVideo = lazy(() => 
  import('@/components/blocks/smart-video').then(mod => ({ 
    default: mod.SmartVideo 
  }))
);

export const LazyProjectsGallery = lazy(() => 
  import('@/components/blocks/projects-gallery').then(mod => ({ 
    default: mod.ProjectsGallery 
  }))
);

export const LazyStatsCharts = lazy(() => 
  import('@/components/blocks/stats-charts').then(mod => ({ 
    default: mod.StatsCharts 
  }))
);

export const LazyDualImageShowcase = lazy(() => 
  import('@/components/blocks/dual-image-showcase').then(mod => ({ 
    default: mod.DualImageShowcase 
  }))
);

export const LazySplitBackgroundImage = lazy(() => 
  import('@/components/blocks/split-background-image').then(mod => ({ 
    default: mod.SplitBackgroundImage 
  }))
);

// Optimized icon imports to reduce bundle size
export const ArrowRightIcon = lazy(() => 
  import('lucide-react').then(mod => ({ default: mod.ArrowRight }))
);

export const PlayIcon = lazy(() => 
  import('lucide-react').then(mod => ({ default: mod.Play }))
);

export const PauseIcon = lazy(() => 
  import('lucide-react').then(mod => ({ default: mod.Pause }))
);

// Create a loading component for consistent UX
export const ComponentLoader = ({ height = 'h-96' }: { height?: string }) => (
  <div className={`${height} bg-surface-tertiary animate-pulse rounded-lg flex items-center justify-center`}>
    <div className="text-content-secondary text-sm">Loading...</div>
  </div>
);