// Configuration variables for the application

export const config = {
  // Social media integration
  facebook: {
    pageId: process.env.FACEBOOK_PAGE_ID || '2681347762153745', // Default page ID from existing code
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
  },
  instagram: {
    accountId: process.env.INSTAGRAM_ACCOUNT_ID || '',
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '', // Often same as Facebook token for connected accounts
  },
  // Site information
  site: {
    name: 'AUTO ANI',
    description: 'Premium used cars imported from Finland and Germany with unbeatable quality and competitive prices.',
    url: 'https://autoani.com',
    logoUrl: '/logo.svg',
  },
  // Contact information
  contact: {
    email: 'info@autoani.com',
    phone: '+383 44 123 456',
    address: 'Mitrovica, Kosovo',
    whatsapp: '+383 44 123 456',
  },
  // SEO and social media
  seo: {
    title: 'AUTO ANI - Premium Used Cars from Finland and Germany',
    description: 'Find your perfect vehicle at AUTO ANI. Premium used cars imported from Finland and Germany with unbeatable quality and competitive prices.',
    keywords: 'used cars, import cars, Finnish cars, German cars, quality used vehicles, Kosovo car dealer, premium cars',
    ogImage: '/og-image.jpg',
    twitterHandle: '@autoani',
  },
  // API endpoints
  api: {
    baseUrl: '/api',
    facebookCars: '/api/facebook-cars',
    instagramCars: '/api/instagram-cars',
    featuredVehicles: '/api/vehicles/featured',
    allVehicles: '/api/vehicles',
  },
};

export default config;

// Helper functions to get API endpoints
export const getFacebookCarsEndpoint = () => config.api.facebookCars;
export const getInstagramCarsEndpoint = () => config.api.instagramCars;
export const getFeaturedVehiclesEndpoint = () => config.api.featuredVehicles;
export const getAllVehiclesEndpoint = () => config.api.allVehicles;
