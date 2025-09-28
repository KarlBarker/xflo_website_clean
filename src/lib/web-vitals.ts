'use client';

import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

// Extend window type to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      name: string,
      options: {
        event_category: string;
        value: number;
        event_label: string;
        non_interaction: boolean;
      }
    ) => void;
  }
}

// Report Web Vitals to analytics (replace with your analytics service)
function sendToAnalytics(metric: Metric) {
  // In development, just log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
    return;
  }

  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Example: Send to custom analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  //   headers: { 'Content-Type': 'application/json' }
  // });
}

export function initWebVitals() {
  // Measure all Web Vitals
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

// Utility to measure custom metrics
export function measureCustomMetric(name: string, value: number) {
  sendToAnalytics({
    name: `custom_${name}`,
    value,
    id: `custom-${Date.now()}`,
    rating: 'good',
    delta: value,
    entries: [],
    navigationType: 'navigate',
  } as unknown as Metric);
}

// Monitor long tasks that block the main thread
export function monitorLongTasks() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            sendToAnalytics({
              name: 'long_task',
              value: entry.duration,
              id: `longtask-${Date.now()}`,
              rating: 'poor',
              delta: entry.duration,
              entries: [entry],
              navigationType: 'navigate',
            } as unknown as Metric);
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  }
}

// Monitor resource loading performance
export function monitorResourceTiming() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Log slow resources (>1s)
            if (resourceEntry.duration > 1000) {
              sendToAnalytics({
                name: 'slow_resource',
                value: resourceEntry.duration,
                id: `resource-${Date.now()}`,
                rating: 'poor',
                delta: resourceEntry.duration,
                entries: [resourceEntry],
                navigationType: 'navigate',
              } as unknown as Metric);
            }
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Resource timing monitoring not supported:', error);
    }
  }
}