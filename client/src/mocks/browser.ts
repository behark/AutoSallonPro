import { setupWorker } from 'msw/browser';
import { facebookCarsHandler, instagramCarsHandler, featuredVehiclesHandler } from './handlers/socialMediaHandlers';

// Define handlers for the browser environment
export const handlers = [
  facebookCarsHandler,
  instagramCarsHandler,
  featuredVehiclesHandler,
];

// Create and export the service worker
export const worker = setupWorker(...handlers);

// Initialize the worker
async function startWorker() {
  await worker.start({
    onUnhandledRequest: 'bypass', // 'bypass' | 'warn' | 'error'
  });
  console.log('[MSW] Mock service worker started');
}

// Start the worker
startWorker();
