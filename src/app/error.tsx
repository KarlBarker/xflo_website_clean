'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/error-logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error with structured context
    logError(error, {
      component: 'GlobalErrorBoundary',
      action: 'Error caught in global boundary'
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light">
      <div className="max-w-md w-full mx-auto text-center p-6">
        <div className="mb-8">
          <h1 className="title-5xl font-featured text-content-primary mb-4">
            Something went wrong
          </h1>
          <p className="text-content-secondary mb-6">
            We encountered an unexpected error. This has been logged and we&apos;ll look into it.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={reset}
            className="w-full"
          >
            Try again
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="w-full"
          >
            <Link href="/">
              Return to homepage
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-content-secondary mb-2">
              Error Details (Dev Only)
            </summary>
            <pre className="text-xs bg-surface-tertiary p-4 rounded overflow-auto max-h-40">
              {error.stack || error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-content-secondary mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </details>
        )}
      </div>
    </div>
  );
}