import React, { createContext, useContext, useState } from 'react';
import { announceForScreenReader } from '../utils/accessibility';

// Define the accessibility context type
interface AccessibilityContextType {
  announce: (message: string, politeness?: 'polite' | 'assertive') => void;
  setSkipLinkTarget: (id: string) => void;
  skipLinkTarget: string;
}

// Create context with default values
const AccessibilityContext = createContext<AccessibilityContextType>({
  announce: () => {},
  setSkipLinkTarget: () => {},
  skipLinkTarget: 'main-content',
});

// Custom hook to use the accessibility context
export const useAccessibility = () => useContext(AccessibilityContext);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for accessibility features
 * Provides screen reader announcements and skip link functionality
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [skipLinkTarget, setSkipLinkTarget] = useState('main-content');
  
  // Function to announce messages to screen readers
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    announceForScreenReader(message);
  };
  
  return (
    <AccessibilityContext.Provider 
      value={{
        announce,
        setSkipLinkTarget,
        skipLinkTarget,
      }}
    >
      {/* Skip to content link for keyboard users */}
      <a 
        href={`#${skipLinkTarget}`} 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-4 focus:bg-white focus:z-50 focus:text-blue-600"
      >
        Skip to content
      </a>
      
      {/* Screen reader announcement area */}
      <div 
        id="screen-reader-announcement" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      />
      
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
