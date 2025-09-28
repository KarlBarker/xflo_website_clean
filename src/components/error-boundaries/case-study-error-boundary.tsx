'use client';

import React from 'react';
import Link from 'next/link';
import { CMSErrorBoundary } from './cms-error-boundary';

interface CaseStudyErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

function CaseStudyErrorFallback({ error, retry }: CaseStudyErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light">
      <div className="max-w-md w-full mx-auto text-center p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-content-primary mb-4">
            Case Study Unavailable
          </h1>
          <p className="text-content-secondary mb-6">
            We&apos;re having trouble loading this case study. This might be due to a temporary issue with our content management system.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={retry}
            className="w-full px-6 py-3 bg-surface-primary text-content-inverse rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
          
          <Link
            href="/case-studies"
            className="block w-full px-6 py-3 border border-border-primary text-content-primary rounded-lg hover:bg-surface-tertiary transition-colors"
          >
            View All Case Studies
          </Link>
          
          <Link
            href="/"
            className="block text-content-secondary hover:text-content-primary transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-content-secondary">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 text-xs bg-surface-tertiary p-4 rounded overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export function CaseStudyErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <CMSErrorBoundary fallback={CaseStudyErrorFallback}>
      {children}
    </CMSErrorBoundary>
  );
}