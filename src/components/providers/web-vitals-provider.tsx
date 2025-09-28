'use client';

import { useEffect } from 'react';
import { initWebVitals, monitorLongTasks, monitorResourceTiming } from '@/lib/web-vitals';

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals();
    monitorLongTasks();
    monitorResourceTiming();
  }, []);

  return <>{children}</>;
}