/**
 * CDN Configuration Utility
 * 
 * This utility helps manage CDN URL generation for assets and implements
 * best practices for using CDN in production environments.
 */

// CDN base URL from environment variable
const CDN_URL = import.meta.env.VITE_CDN_URL || '';
const USE_CDN = import.meta.env.VITE_USE_CDN === 'true';

/**
 * Generate a CDN URL for an asset
 * @param assetPath - The relative path to the asset
 * @returns The full CDN URL or local URL based on configuration
 */
export const cdnUrl = (assetPath: string): string => {
  // Strip leading slash if present
  const normalizedPath = assetPath.startsWith('/') ? assetPath.substring(1) : assetPath;
  
  // Use CDN in production if configured
  if (USE_CDN && CDN_URL && import.meta.env.VITE_NODE_ENV === 'production') {
    return `${CDN_URL}/${normalizedPath}`;
  }
  
  // Fallback to local path
  return `/${normalizedPath}`;
};

/**
 * Preconnect to CDN domain - call this in your app initialization
 * to improve performance when loading assets from CDN
 */
export const setupCdnPreconnect = (): void => {
  if (USE_CDN && CDN_URL && import.meta.env.VITE_NODE_ENV === 'production') {
    // Create preconnect link
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = CDN_URL;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    // Also add dns-prefetch as fallback for browsers that don't support preconnect
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = CDN_URL;
    document.head.appendChild(dnsPrefetch);
    
    console.log('CDN preconnect configured');
  }
};

/**
 * Get the optimal image size based on the device's screen size
 * @param originalWidth - The original width of the image
 * @returns The optimal width for the current device
 */
export const getOptimalImageSize = (originalWidth: number): number => {
  // Get device pixel ratio and screen width
  const pixelRatio = window.devicePixelRatio || 1;
  const screenWidth = window.innerWidth;
  
  // Calculate a reasonable size based on screen width and pixel ratio
  const optimalWidth = Math.min(screenWidth * pixelRatio, originalWidth);
  
  // Round to the nearest common size breakpoint
  const breakpoints = [320, 480, 640, 768, 1024, 1280, 1440, 1920, 2560];
  
  // Find the smallest breakpoint that is larger than the optimal width
  for (const breakpoint of breakpoints) {
    if (breakpoint >= optimalWidth) {
      return breakpoint;
    }
  }
  
  // If none of the breakpoints are larger, use the original width
  return originalWidth;
};

/**
 * Generate a responsive image URL with CDN parameters
 * @param imagePath - The path to the image
 * @param width - The desired width (optional, will use optimal if not provided)
 * @returns A CDN URL with responsive image parameters
 */
export const responsiveImageUrl = (imagePath: string, width?: number): string => {
  const baseUrl = cdnUrl(imagePath);
  
  if (!USE_CDN || import.meta.env.VITE_NODE_ENV !== 'production') {
    return baseUrl;
  }
  
  // Use the optimal size if width is not provided
  const imageWidth = width || getOptimalImageSize(1920); // Default max width
  
  // Add query parameters for CDN image resizing
  // Note: Format will depend on your specific CDN provider
  // This example uses a generic format, adjust as needed
  return `${baseUrl}?w=${imageWidth}&q=80&auto=format`;
};
