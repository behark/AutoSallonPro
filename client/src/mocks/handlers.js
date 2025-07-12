// Mock Service Worker handler for Facebook cars API
import { rest } from 'msw';
import facebookCars from './facebook-cars.json';
import featuredVehicles from './featured-vehicles.json';

export const handlers = [
  // Fallback handler for all unmatched requests
  rest.all('*', (req, res, ctx) => {
    console.log('[MSW] Fallback handler hit for', req.url.href);
    return res(ctx.status(404), ctx.json({ error: 'No handler found' }));
  }),
  rest.get('/api/facebook-cars*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(facebookCars));
  }),
  rest.get('/api/vehicles/featured*', (req, res, ctx) => {
  console.log('[MSW] /api/vehicles/featured intercepted');
    return res(ctx.status(200), ctx.json(featuredVehicles));
  }),
];
