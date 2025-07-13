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
        brand: 'BMW',
        model: 'X5',
        year: 2020,
        price: 45000,
        mileage: 35000,
        condition: 'Used',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engine: '3.0L Inline-6',
        description: 'Well-maintained BMW X5 with full service history. Features include panoramic roof, heated seats, and premium sound system.',
        images: ['/vehicles/bmw-x5-1.jpg', '/vehicles/bmw-x5-2.jpg'],
        featured: true,
        importCountry: 'Germany',
        features: ['Leather Seats', 'Navigation System', 'Panoramic Roof', 'Heated Seats', 'Bluetooth', 'Parking Sensors']
      },
      {
        id: generateId(),
        brand: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2021,
        price: 52000,
        mileage: 20000,
        condition: 'Used',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engine: '2.0L Turbo',
        description: 'Elegant Mercedes-Benz E-Class with premium features and excellent condition. Includes warranty until 2025.',
        images: ['/vehicles/mercedes-e-1.jpg', '/vehicles/mercedes-e-2.jpg'],
        featured: true,
        importCountry: 'Germany',
        features: ['Leather Seats', 'Navigation System', 'Driver Assistance Package', 'Heated & Ventilated Seats', 'Premium Audio']
      }
    ];
    
    storeVehicles(mockVehicles);
  }
};

// Call initialization when the module is imported
initializeMockVehicles();
