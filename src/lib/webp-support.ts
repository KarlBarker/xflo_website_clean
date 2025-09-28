/**
 * WebP Support Detection
 * Adds 'no-webp' class to html element if WebP is not supported
 * This should be called as early as possible in the app lifecycle
 */
export function detectWebPSupport(): void {
  if (typeof window === 'undefined') return;

  // Check if we've already detected support
  if (document.documentElement.classList.contains('webp') ||
      document.documentElement.classList.contains('no-webp')) {
    return;
  }

  // Create a WebP test image
  const webp = new Image();

  webp.onload = webp.onerror = function() {
    // Check if the image loaded successfully and has the expected dimensions
    if (webp.height === 2) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  };

  // Test WebP with a minimal 1x1 transparent image
  webp.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
}

/**
 * Hook for React components to detect WebP support
 */
export function useWebPSupport(): boolean | null {
  if (typeof window === 'undefined') return null;

  if (document.documentElement.classList.contains('webp')) {
    return true;
  }

  if (document.documentElement.classList.contains('no-webp')) {
    return false;
  }

  // Still detecting
  return null;
}