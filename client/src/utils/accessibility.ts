/**
 * Utility functions for improving accessibility across the application
 */

/**
 * Creates props for keyboard navigation (tab and enter key handling)
 * @param onClick - The click handler function
 * @returns Object with props for keyboard accessibility
 */
export const withKeyboardNavigation = (
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
) => ({
  onClick,
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  },
  tabIndex: 0,
  role: 'button',
});

/**
 * Creates an ID for associating label with input
 * @param name - Base name for the ID
 * @returns Unique ID for accessibility associations
 */
export const createAccessibleId = (name: string): string => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Focus trap for modal dialogs
 * @param containerRef - Reference to the container element
 * @returns Functions to activate and deactivate focus trap
 */
export const createFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  let previouslyFocusedElement: HTMLElement | null = null;
  let tabbableElements: HTMLElement[] = [];
  
  const activate = () => {
    previouslyFocusedElement = document.activeElement as HTMLElement;
    
    if (containerRef.current) {
      // Find all focusable elements
      tabbableElements = Array.from(
        containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];
      
      // Focus the first element
      if (tabbableElements.length > 0) {
        tabbableElements[0].focus();
      }
      
      // Add keydown event listener
      document.addEventListener('keydown', handleKeyDown);
    }
  };
  
  const deactivate = () => {
    document.removeEventListener('keydown', handleKeyDown);
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (tabbableElements.length === 0) return;
      
      const firstElement = tabbableElements[0];
      const lastElement = tabbableElements[tabbableElements.length - 1];
      
      // Shift + Tab - backward navigation
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } 
      // Tab - forward navigation
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    // Close on Escape key
    if (e.key === 'Escape') {
      deactivate();
    }
  };
  
  return { activate, deactivate };
};

/**
 * Creates an announcement for screen readers
 * @param message - Message to announce
 */
export const announceForScreenReader = (message: string) => {
  const announcementElement = document.getElementById('screen-reader-announcement');
  
  if (announcementElement) {
    announcementElement.textContent = message;
  } else {
    const element = document.createElement('div');
    element.id = 'screen-reader-announcement';
    element.className = 'sr-only';
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.textContent = message;
    document.body.appendChild(element);
  }
};
