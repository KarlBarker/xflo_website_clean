'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ComponentProps<typeof Image> {
  containerClassName?: string;
}

export function OptimizedImage({ 
  src, 
  alt,
  className,
  containerClassName,
  priority = false,
  loading = "lazy",
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Handle error state with placeholder
  if (hasError) {
    return (
      <div className={cn("relative bg-surface-tertiary", containerClassName)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-content-secondary text-sm">Image unavailable</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && (
        <div className="absolute inset-0 bg-surface-tertiary animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority={priority}
        loading={priority ? "eager" : loading}
        {...props}
      />
    </div>
  );
}