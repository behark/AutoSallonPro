import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

/**
 * Reusable loading state component for data-heavy sections
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  fullPage = false,
}) => {
  // Size mapping for the loader
  const sizeMap = {
    sm: {
      container: 'p-4',
      spinner: 'w-4 h-4',
      text: 'text-sm'
    },
    md: {
      container: 'p-6',
      spinner: 'w-8 h-8',
      text: 'text-base'
    },
    lg: {
      container: 'p-8',
      spinner: 'w-12 h-12',
      text: 'text-lg'
    }
  };
  
  const styles = sizeMap[size];
  
  const loadingContent = (
    <div className={`flex flex-col items-center justify-center ${styles.container}`}>
      <Loader2 className={`animate-spin ${styles.spinner} text-primary mb-2`} aria-hidden="true" />
      {message && (
        <p className={`${styles.text} text-gray-600`} role="status">
          {message}
          <span className="sr-only">Please wait</span>
        </p>
      )}
    </div>
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
        {loadingContent}
      </div>
    );
  }
  
  return loadingContent;
};

export default LoadingState;
