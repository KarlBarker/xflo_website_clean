'use client';

import React from 'react';
import { logCMSError } from '@/lib/error-logger';

interface CMSErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface CMSErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class CMSErrorBoundary extends React.Component<
  CMSErrorBoundaryProps,
  CMSErrorBoundaryState
> {
  constructor(props: CMSErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CMSErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logCMSError(error, 'Component error in CMS boundary', {
      componentStack: errorInfo.componentStack
    });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultCMSErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultCMSErrorFallback({ 
  error, 
  retry 
}: { 
  error?: Error; 
  retry: () => void 
}) {
  return (
    <div className="bg-surface-light border border-border-primary rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-content-primary mb-2">
        Content Unavailable
      </h3>
      <p className="text-content-secondary mb-4">
        We&apos;re having trouble loading this content. Please try again.
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-surface-primary text-content-inverse rounded hover:bg-opacity-90 transition-colors"
      >
        Try Again
      </button>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-content-secondary">
            Error Details (Dev Only)
          </summary>
          <pre className="mt-2 text-xs bg-surface-tertiary p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}