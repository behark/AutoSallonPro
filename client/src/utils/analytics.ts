/**
 * Google Analytics utility functions
 */

// Measurement ID from env variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string;

/**
 * Initialize Google Analytics
 */
export const initializeGA = (): void => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found');
    return;
  }

  // Add Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll send page views manually for SPA
  });

  console.log('Google Analytics initialized');
};

/**
 * Track page view in Google Analytics
 * @param path - Current page path
 * @param title - Page title
 */
export const trackPageView = (path: string, title: string): void => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

/**
 * Track event in Google Analytics
 * @param category - Event category
 * @param action - Event action
 * @param label - Event label (optional)
 * @param value - Event value (optional)
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Track user identification (when logged in)
 * @param userId - User ID
 */
export const setUserIdentity = (userId: string): void => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag('set', { user_id: userId });
};

// Add TypeScript definitions for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
