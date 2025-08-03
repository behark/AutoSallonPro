import { http, HttpResponse } from 'msw';
import { config } from '@/lib/config';
import { fetchFacebookCars } from '@/lib/api/facebook';
import { fetchInstagramCars } from '@/lib/api/instagram';

// Mock data in case API keys are not set or API fails
const mockFacebookCars = [
  {
    id: "fb1",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    ],
    info: "2018 Mercedes-Benz C-Class C 300 4MATIC Sedan. Low mileage, excellent condition, full service history.",
    price: "22,500€",
    created_time: "2023-09-15T12:34:56+0000",
    link: "https://facebook.com/post1"
  },
  {
    id: "fb2",
    images: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    ],
    info: "2019 BMW 3 Series 320d xDrive. Sport package, leather interior, navigation system, one owner.",
    price: "24,900€",
    created_time: "2023-09-10T15:22:33+0000",
    link: "https://facebook.com/post2"
  },
  {
    id: "fb3",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    ],
    info: "2020 Audi A4 40 TDI quattro S line. Premium package, virtual cockpit, Bang & Olufsen sound system.",
    price: "29,800€",
    created_time: "2023-09-05T09:15:27+0000",
    link: "https://facebook.com/post3"
  }
];

const mockInstagramCars = [
  {
    id: "ig1",
    images: [
      "https://images.unsplash.com/photo-1617654112368-307952531f38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1617654112368-307952531f38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    ],
    info: "2021 Volkswagen Golf GTI. Performance package, DSG transmission, sunroof, only 15,000 km.",
    price: "32,500€",
    created_time: "2023-08-20T14:30:45+0000",
    link: "https://instagram.com/p/abc123"
  },
  {
    id: "ig2",
    images: [
      "https://images.unsplash.com/photo-1560253414-f65d1f5a1a37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    ],
    info: "2019 Škoda Octavia RS 245. Fully loaded, panoramic roof, adaptive cruise control, Canton sound system.",
    price: "19,900€",
    created_time: "2023-08-15T10:45:12+0000",
    link: "https://instagram.com/p/def456"
  }
];

// Mock featured vehicles
const mockFeaturedVehicles = [
  {
    id: "1",
    make: "Volvo",
    model: "XC60",
    year: 2020,
    price: 38000,
    mileage: 42000,
    fuelType: "Diesel",
    transmission: "Automatic",
    images: ["https://images.unsplash.com/photo-1566473965997-3de9c817e938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    features: ["Winter Package", "Pilot Assist", "Heated Seats", "Navigation System"],
    description: "Excellent Volvo XC60 imported from Finland with complete service history and winter equipment.",
    isFeatured: true
  },
  {
    id: "2",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2021,
    price: 45000,
    mileage: 28000,
    fuelType: "Petrol",
    transmission: "Automatic",
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    features: ["Driver Assistance Package", "Premium Audio", "Wireless Charging", "LED Headlights"],
    description: "Beautiful Mercedes-Benz C-Class imported from Finland. Excellent condition with comprehensive warranty.",
    isFeatured: true
  },
  {
    id: "3",
    make: "BMW",
    model: "320d",
    year: 2019,
    price: 32000,
    mileage: 55000,
    fuelType: "Diesel",
    transmission: "Automatic",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    features: ["Sport Seats", "BMW ConnectedDrive", "Heated Seats", "LED Headlights"],
    description: "Reliable BMW 320d with excellent fuel economy. Imported from Finland with complete documentation.",
    isFeatured: true
  },
  {
    id: "4",
    make: "Toyota",
    model: "RAV4",
    year: 2021,
    price: 42000,
    mileage: 25000,
    fuelType: "Hybrid",
    transmission: "CVT",
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    features: ["AWD", "Toyota Safety Sense", "Panoramic Roof", "Wireless Charging"],
    description: "Efficient Toyota RAV4 Hybrid imported from Finland with full Toyota warranty remaining.",
    isFeatured: true
  }
];

// Handler for Facebook cars endpoint
export const facebookCarsHandler = http.get('/api/facebook-cars', async ({ request }) => {
  const url = new URL(request.url);
  const pageId = url.searchParams.get('pageId') || config.facebook.pageId;
  
  console.log(`[MSW] /api/facebook-cars intercepted with pageId: ${pageId}`);
  
  // If accessToken is available, try to fetch real data
  if (config.facebook.accessToken) {
    try {
      const cars = await fetchFacebookCars(
        pageId,
        config.facebook.accessToken,
        50
      );
      
      // If we successfully got cars, return them
      if (cars && cars.length > 0) {
        return HttpResponse.json(cars);
      }
    } catch (error) {
      console.error('[MSW] Error fetching Facebook cars:', error);
      // Fall back to mock data on error
    }
  }
  
  // Return mock data if no token or if fetch failed
  return HttpResponse.json(mockFacebookCars);
});

// Handler for Instagram cars endpoint
export const instagramCarsHandler = http.get('/api/instagram-cars', async ({ request }) => {
  console.log(`[MSW] /api/instagram-cars intercepted`);
  
  // If accessToken is available, try to fetch real data
  if (config.instagram.accessToken && config.instagram.accountId) {
    try {
      const cars = await fetchInstagramCars(
        config.instagram.accountId,
        config.instagram.accessToken,
        50
      );
      
      // If we successfully got cars, return them
      if (cars && cars.length > 0) {
        return HttpResponse.json(cars);
      }
    } catch (error) {
      console.error('[MSW] Error fetching Instagram cars:', error);
      // Fall back to mock data on error
    }
  }
  
  // Return mock data if no token or if fetch failed
  return HttpResponse.json(mockInstagramCars);
});

// Handler for featured vehicles
export const featuredVehiclesHandler = http.get('/api/vehicles/featured', () => {
  console.log('[MSW] /api/vehicles/featured intercepted');
  return HttpResponse.json(mockFeaturedVehicles);
});
