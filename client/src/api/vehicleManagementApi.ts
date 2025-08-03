import { queryClient } from "@/lib/queryClient";

// Vehicle interface
export interface Vehicle {
  id: string;
  brand?: string;
  make?: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  description?: string;
  images?: string[];
  featured?: boolean;
  importCountry?: string;
  features?: string[];
}

// Local storage helpers
const STORAGE_KEY = 'ani_auto_vehicles';

const getStoredVehicles = (): Vehicle[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse stored vehicles:', error);
    return [];
  }
};

const storeVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  } catch (error) {
    console.error('Failed to store vehicles:', error);
  }
};

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// API Functions
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return vehicles from local storage
  return getStoredVehicles();
};

export const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find vehicle in local storage
  const vehicles = getStoredVehicles();
  const vehicle = vehicles.find(v => v.id === id);
  
  if (!vehicle) {
    throw new Error(`Vehicle with ID ${id} not found`);
  }
  
  return vehicle;
};

export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create new vehicle with ID
  const newVehicle: Vehicle = {
    ...vehicle,
    id: generateId()
  };
  
  // Add to storage
  const vehicles = getStoredVehicles();
  storeVehicles([...vehicles, newVehicle]);
  
  // Invalidate cache
  await queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
  
  return newVehicle;
};

export const updateVehicle = async (id: string, vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find and update vehicle
  const vehicles = getStoredVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) {
    throw new Error(`Vehicle with ID ${id} not found`);
  }
  
  const updatedVehicle: Vehicle = {
    ...vehicle,
    id
  };
  
  vehicles[index] = updatedVehicle;
  storeVehicles(vehicles);
  
  // Invalidate cache
  await queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
  await queryClient.invalidateQueries({ queryKey: ['/api/vehicles', id] });
  
  return updatedVehicle;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Remove vehicle
  const vehicles = getStoredVehicles();
  const filteredVehicles = vehicles.filter(v => v.id !== id);
  
  if (vehicles.length === filteredVehicles.length) {
    throw new Error(`Vehicle with ID ${id} not found`);
  }
  
  storeVehicles(filteredVehicles);
  
  // Invalidate cache
  await queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
};

// Image upload simulation
export const uploadImage = async (file: File): Promise<string> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a fake URL using a data URI
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // In a real implementation, this would be the URL returned from your image hosting service
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

// Initialize mock data if storage is empty
export const initializeMockVehicles = (): void => {
  const vehicles = getStoredVehicles();
  
  if (vehicles.length === 0) {
    const mockVehicles: Vehicle[] = [
      {
        id: generateId(),
        brand: 'Volvo',
        model: 'XC60',
        year: 2020,
        price: 38000,
        mileage: 42000,
        condition: 'Used',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engine: '2.0L D4',
        description: 'Excellent Volvo XC60 imported from Finland with complete service history. Features advanced safety systems and winter package.',
        images: ['/vehicles/volvo-xc60-1.jpg', '/vehicles/volvo-xc60-2.jpg'],
        featured: true,
        importCountry: 'Finland',
        features: ['Leather Seats', 'Navigation System', 'Winter Package', 'Heated Seats', 'Pilot Assist', 'Four Corner Air Suspension']
      },
      {
        id: generateId(),
        brand: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2021,
        price: 45000,
        mileage: 28000,
        condition: 'Used',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engine: '1.5L Turbo',
        description: 'Beautiful Mercedes-Benz C-Class imported from Finland. Excellent condition with comprehensive warranty coverage.',
        images: ['/vehicles/mercedes-c-1.jpg', '/vehicles/mercedes-c-2.jpg'],
        featured: true,
        importCountry: 'Finland',
        features: ['Leather Seats', 'Navigation System', 'Driver Assistance Package', 'Heated Seats', 'Premium Audio', 'Wireless Charging']
      },
      {
        id: generateId(),
        brand: 'BMW',
        model: '320d',
        year: 2019,
        price: 32000,
        mileage: 55000,
        condition: 'Used',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engine: '2.0L TwinPower Turbo',
        description: 'Reliable BMW 320d with excellent fuel economy. Imported from Finland with complete documentation and service records.',
        images: ['/vehicles/bmw-320d-1.jpg', '/vehicles/bmw-320d-2.jpg'],
        featured: true,
        importCountry: 'Finland',
        features: ['Sport Seats', 'Navigation System', 'BMW ConnectedDrive', 'Heated Seats', 'Dual Zone Climate', 'LED Headlights']
      },
      {
        id: generateId(),
        brand: 'Audi',
        model: 'A4 Avant',
        year: 2020,
        price: 36000,
        mileage: 40000,
        condition: 'Used',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engine: '2.0 TDI',
        description: 'Spacious Audi A4 Avant wagon with Quattro AWD. Perfect for families, imported from Finland with winter equipment.',
        images: ['/vehicles/audi-a4-1.jpg', '/vehicles/audi-a4-2.jpg'],
        featured: true,
        importCountry: 'Finland',
        features: ['Quattro AWD', 'Navigation System', 'Virtual Cockpit', 'Heated Seats', 'Winter Tires Included', 'Bang & Olufsen Audio']
      },
      {
        id: generateId(),
        brand: 'Toyota',
        model: 'RAV4',
        year: 2021,
        price: 42000,
        mileage: 25000,
        condition: 'Used',
        fuelType: 'Hybrid',
        transmission: 'CVT',
        engine: '2.5L Hybrid',
        description: 'Efficient Toyota RAV4 Hybrid with excellent reliability. Imported from Finland with full Toyota warranty remaining.',
        images: ['/vehicles/toyota-rav4-1.jpg', '/vehicles/toyota-rav4-2.jpg'],
        featured: true,
        importCountry: 'Finland',
        features: ['AWD', 'Navigation System', 'Toyota Safety Sense', 'Heated Seats', 'Panoramic Roof', 'Wireless Phone Charging']
      },
      {
        id: generateId(),
        brand: 'Volkswagen',
        model: 'Tiguan',
        year: 2020,
        price: 34000,
        mileage: 48000,
        condition: 'Used',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engine: '1.4 TSI',
        description: 'Well-equipped VW Tiguan with 4Motion AWD. Imported from Finland with complete service documentation.',
        images: ['/vehicles/vw-tiguan-1.jpg', '/vehicles/vw-tiguan-2.jpg'],
        featured: false,
        importCountry: 'Finland',
        features: ['4Motion AWD', 'Navigation System', 'Digital Cockpit', 'Heated Seats', 'Parking Sensors', 'LED Headlights']
      }
    ];
    
    storeVehicles(mockVehicles);
  }
};

// Call initialization when the module is imported
initializeMockVehicles();
