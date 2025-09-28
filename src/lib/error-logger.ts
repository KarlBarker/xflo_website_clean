/**
 * Centralized error logging utility
 * Provides structured error logging with context
 */

import { DEV_CONFIG } from '@/config/constants';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  url?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface LoggedError {
  message: string;
  stack?: string;
  digest?: string;
  context: ErrorContext;
  level: 'error' | 'warn' | 'info';
}

/**
 * Log an error with structured context
 */
export function logError(
  error: Error | string,
  context: ErrorContext = {},
  level: 'error' | 'warn' | 'info' = 'error'
): LoggedError {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  
  const loggedError: LoggedError = {
    message: errorMessage,
    stack: errorStack,
    digest: typeof error === 'object' && error && 'digest' in error ? (error as { digest?: string }).digest : undefined,
    context: {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context
    },
    level
  };

  // Console logging for development
  if (DEV_CONFIG.IS_DEVELOPMENT) {
    console.group(`🚨 ${level.toUpperCase()}: ${errorMessage}`);
    console.error('Error:', error);
    console.log('Context:', loggedError.context);
    console.groupEnd();
  } else {
    // Production logging (could integrate with external service)
    console.error('Error logged:', {
      message: errorMessage,
      context: loggedError.context,
      level
    });
  }

  // In production, you could send to error tracking service here
  // Example: Sentry.captureException(error, { contexts: { custom: loggedError.context } });

  return loggedError;
}

/**
 * Log CMS-related errors
 */
export function logCMSError(error: Error | string, action: string, metadata?: Record<string, unknown>) {
  return logError(error, {
    component: 'CMS',
    action,
    metadata
  });
}

/**
 * Log API-related errors
 */
export function logAPIError(error: Error | string, endpoint: string, metadata?: Record<string, unknown>) {
  return logError(error, {
    component: 'API',
    action: `Request to ${endpoint}`,
    metadata
  });
}

/**
 * Log navigation-related errors
 */
export function logNavigationError(error: Error | string, action: string, metadata?: Record<string, unknown>) {
  return logError(error, {
    component: 'Navigation',
    action,
    metadata
  });
}