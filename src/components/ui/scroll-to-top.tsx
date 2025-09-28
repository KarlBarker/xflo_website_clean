"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the first render (initial page load/refresh)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only scroll to top when route changes (navigation between pages)
    // This won't trigger on initial load or refresh
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}