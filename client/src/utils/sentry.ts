import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialize Sentry error tracking
 * Should be called early in the application lifecycle
 */
export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: import.meta.env.VITE_NODE_ENV === 'production' ? 0.2 : 1.0,
      
      // Only enable in production to avoid noise during development
      enabled: import.meta.env.VITE_NODE_ENV === 'production',
      
      // Only send errors when not in development
      beforeSend(event) {
        if (import.meta.env.VITE_NODE_ENV !== 'production') {
          return null;
        }
        return event;
      },
      
      // Set environment
      environment: import.meta.env.VITE_NODE_ENV,
    });
    
    console.log('Sentry initialized');
  } else {
    console.warn('Sentry DSN not found, error tracking disabled');
  }
};

/**
 * Capture an exception and send it to Sentry
 * @param error - The error to capture
 * @param context - Additional context information
 */
export const captureException = (error: unknown, context?: Record<string, any>) => {
  console.error('Error:', error);
  
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

/**
 * Set user information for Sentry
 * @param userId - User ID
 * @param userData - Additional user data
 */
export const setUserInfo = (userId: string, userData?: Record<string, any>) => {
  Sentry.setUser({
    id: userId,
    ...userData,
  });
};

/**
 * Clear user information from Sentry
 */
export const clearUserInfo = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb to track user actions
 * @param category - Category of the breadcrumb
 * @param message - Message describing the action
 * @param data - Additional data
 */
export const addBreadcrumb = (
  category: string,
  message: string,
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
  });
};
