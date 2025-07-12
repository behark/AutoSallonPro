import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  placeholder?: string;
}

/**
 * OptimizedImage component for better image loading and optimization
 * Features:
 * - Lazy loading
 * - Loading state management
 * - Blur-up placeholder effect
 * - Responsive sizing
 * - Accessibility support
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  priority = false,
  objectFit = 'cover',
  onLoad,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiAvPjwvc3ZnPg==', // Default to a light gray SVG placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [srcToShow, setSrcToShow] = useState(priority ? src : placeholder);

  useEffect(() => {
    // If priority is true, we've already set the src
    if (priority) return;

    // For non-priority images, implement lazy loading
    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onload = () => {
      setSrcToShow(src);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    imageLoader.onerror = () => {
      setIsError(true);
    };

    // Check if the image is already in the browser cache
    if (imageLoader.complete) {
      setSrcToShow(src);
      setIsLoaded(true);
      if (onLoad) onLoad();
    }

    return () => {
      imageLoader.onload = null;
      imageLoader.onerror = null;
    };
  }, [src, priority, onLoad]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
      }}
      aria-busy={!isLoaded}
    >
      {/* Main image */}
      <img
        src={srcToShow}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className={`transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectFit,
          width: '100%',
          height: '100%',
        }}
        onLoad={() => {
          if (srcToShow === src) {
            setIsLoaded(true);
            if (onLoad) onLoad();
          }
        }}
        onError={() => setIsError(true)}
      />

      {/* Placeholder or loading state */}
      {!isLoaded && !isError && (
        <div
          className="absolute inset-0 bg-gray-100 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Error state */}
      {isError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span className="sr-only">Image could not be loaded</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
