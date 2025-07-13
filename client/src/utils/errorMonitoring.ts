/**
 * Error monitoring and tracking utilities using Sentry
 */
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { isProd } from './environment';

// Initialize Sentry only in production or when explicitly enabled
export const initializeSentry = (): void => {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string;
  
  if (!dsn) {
    console.warn('Sentry DSN not found in environment variables');
    return;
  }

  if (isProd() || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.init({
      dsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.2,
      environment: import.meta.env.MODE,
      // Only send errors in production unless explicitly enabled
      enabled: isProd() || import.meta.env.VITE_ENABLE_SENTRY === 'true',
      // Capture errors from failed API requests
      beforeSend(event) {
        // Don't send certain user-facing errors to avoid noise
        if (event.exception?.values?.[0]?.value?.includes('ResizeObserver loop')) {
          return null;
        }
        return event;
      }
    });
    
    // Set user information if available (should be called after user logs in)
    const userId = localStorage.getItem('userId');
    if (userId) {
      Sentry.setUser({ id: userId });
    }
    
    console.log(`Sentry initialized in ${import.meta.env.MODE} mode`);
  }
};

/**
 * Track a specific error
 * @param error Error object
 * @param context Additional context information
 */
export const trackError = (error: Error, context: Record<string, any> = {}): void => {
  console.error(error);
  
  // Only track in production or when Sentry is enabled
  if (isProd() || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.captureException(error, {
      extra: context
    });
  }
};

/**
 * Set user information for error tracking
 * @param userId User identifier
 * @param email Optional user email
 */
export const setErrorUser = (userId: string, email?: string): void => {
  Sentry.setUser({
    id: userId,
    email
  });
};

/**
 * Clear user information (e.g., on logout)
 */
export const clearErrorUser = (): void => {
  Sentry.setUser(null);
};

/**
 * Track specific section or feature performance
 * @param name Transaction name
 * @param operation Operation type (e.g., 'http.request', 'component.render')
 * @param callback Function to track
 */
export const trackPerformance = async <T>(
  name: string,
  operation: string,
  callback: () => Promise<T>
): Promise<T> => {
  const transaction = Sentry.startTransaction({
    name,
    op: operation
  });
  
  try {
    Sentry.configureScope(scope => {
      scope.setSpan(transaction);
    });
    
    return await callback();
  } finally {
    transaction.finish();
  }
};
