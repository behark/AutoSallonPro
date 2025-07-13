/**
 * Environment utility functions
 * Used to determine the current environment and load appropriate configuration
 */

/**
 * Check if the current environment is production
 * @returns boolean indicating if in production mode
 */
export const isProd = (): boolean => {
  return import.meta.env.MODE === 'production' || import.meta.env.PROD;
};

/**
 * Check if the current environment is development
 * @returns boolean indicating if in development mode
 */
export const isDev = (): boolean => {
  return import.meta.env.MODE === 'development' || import.meta.env.DEV;
};

/**
 * Get the current environment name
 * @returns string representing the current environment (production, development, test)
 */
export const getEnvironment = (): string => {
  return import.meta.env.MODE || (isProd() ? 'production' : 'development');
};

/**
 * Check if the current environment should enable debug features
 * Can be enabled in any environment via VITE_ENABLE_DEBUG flag
 * @returns boolean indicating if debug features should be enabled
 */
export const isDebugEnabled = (): boolean => {
  return isDev() || import.meta.env.VITE_ENABLE_DEBUG === 'true';
};

/**
 * Log a message only in development mode
 * @param message Message to log
 * @param args Additional arguments to log
 */
export const devLog = (message: string, ...args: any[]): void => {
  if (isDev() || isDebugEnabled()) {
    console.log(`[DEV] ${message}`, ...args);
  }
};

/**
 * Get the base API URL for the current environment
 * @returns API base URL string
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || (isProd() ? '/api' : 'http://localhost:3000/api');
};

/**
 * Get the base URL for assets (useful for CDN configuration)
 * @returns Assets base URL string
 */
export const getAssetsBaseUrl = (): string => {
  return import.meta.env.VITE_ASSETS_URL || '';
};
