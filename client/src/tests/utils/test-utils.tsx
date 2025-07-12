import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccessibilityProvider } from '../../components/AccessibilityProvider';

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

/**
 * Custom render function that wraps components with all necessary providers
 * - QueryClientProvider: For React Query
 * - HelmetProvider: For Helmet SEO components
 * - AccessibilityProvider: For accessibility features
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function AllProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AccessibilityProvider>
            {children}
          </AccessibilityProvider>
        </HelmetProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions });
}

// Mock implementation for window.matchMedia
export function mockMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// Helper to mock IntersectionObserver
export function mockIntersectionObserver() {
  class IntersectionObserverMock {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
}

// Create mock responses for common API endpoints
export const mockResponses = {
  vehicles: [
    {
      id: '1',
      make: 'BMW',
      model: '5 Series',
      year: 2019,
      price: 32500,
      mileage: 45000,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      images: ['https://example.com/image1.jpg'],
      features: ['Leather Seats', 'Navigation'],
      description: 'Test vehicle description',
    },
    {
      id: '2',
      make: 'Mercedes-Benz',
      model: 'E-Class',
      year: 2020,
      price: 38900,
      mileage: 32000,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      images: ['https://example.com/image2.jpg'],
      features: ['Panoramic Roof', 'LED Lights'],
      description: 'Another test vehicle description',
    },
  ],
};
