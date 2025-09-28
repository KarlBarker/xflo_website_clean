'use client';

import { useEffect } from 'react';

export function usePerformanceObserver() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' && 
      'PerformanceObserver' in window &&
      process.env.NODE_ENV === 'development'
    ) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: PerformanceEntry) => {
          // Log slow operations (> 100ms)
          if (entry.duration > 100) {
            console.warn(`⚠️ Slow ${entry.entryType}: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
          
          // Log navigation timing
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('🚀 Navigation Performance:', {
              DOMContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              LoadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              FirstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
            });
          }
          
          // Log resource timing for large resources
          if (entry.entryType === 'resource' && entry.duration > 50) {
            console.log(`📦 Resource loaded: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
          }
        });
      });
      
      try {
        observer.observe({ 
          entryTypes: ['navigation', 'resource', 'measure', 'paint'] 
        });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
      
      return () => observer.disconnect();
    }
  }, []);
}

// Hook for measuring custom performance metrics
export function usePerformanceMeasure(name: string, startMark?: string, endMark?: string) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Create a measure
      try {
        if (startMark && endMark) {
          performance.measure(name, startMark, endMark);
        }
        
        // Log the measure
        const measures = performance.getEntriesByName(name, 'measure');
        if (measures.length > 0) {
          const measure = measures[measures.length - 1];
          console.log(`📊 ${name}: ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn(`Performance measure failed for ${name}:`, error);
      }
    }
  }, [name, startMark, endMark]);
}

// Utility to mark performance timing points
export function performanceMark(name: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      performance.mark(name);
    } catch (error) {
      console.warn(`Performance mark failed for ${name}:`, error);
    }
  }
}

// Utility to measure time between two marks
export function performanceMeasure(name: string, startMark: string, endMark?: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      performance.measure(name, startMark, endMark);
      
      const measures = performance.getEntriesByName(name, 'measure');
      if (measures.length > 0) {
        const measure = measures[measures.length - 1];
        return measure.duration;
      }
    } catch (error) {
      console.warn(`Performance measure failed for ${name}:`, error);
    }
  }
  return 0;
}