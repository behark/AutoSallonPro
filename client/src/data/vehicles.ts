// Vehicle data constants and utilities for AUTO ANI
// This file provides vehicle-related constants and helper functions

export const vehicleBrands = [
  "BMW",
  "Mercedes", 
  "Audi",
  "Volkswagen",
  "Škoda",
  "Seat"
] as const;

export const fuelTypes = [
  "Petrol",
  "Diesel", 
  "Hybrid",
  "Electric"
] as const;

export const transmissionTypes = [
  "Manual",
  "Automatic"
] as const;

export const importCountries = [
  "Finland",
  "Germany"
] as const;

export interface VehicleFilterOptions {
  brands: typeof vehicleBrands;
  fuelTypes: typeof fuelTypes;
  transmissionTypes: typeof transmissionTypes;
  importCountries: typeof importCountries;
  priceRanges: Array<{
    label: string;
    value: string;
    min: number;
    max?: number;
  }>;
  yearRanges: Array<{
    label: string;
    value: string;
    min: number;
    max?: number;
  }>;
}

export const vehicleFilterOptions: VehicleFilterOptions = {
  brands: vehicleBrands,
  fuelTypes: fuelTypes,
  transmissionTypes: transmissionTypes,
  importCountries: importCountries,
  priceRanges: [
    { label: "€5,000 - €10,000", value: "5000-10000", min: 5000, max: 10000 },
    { label: "€10,000 - €20,000", value: "10000-20000", min: 10000, max: 20000 },
    { label: "€20,000 - €30,000", value: "20000-30000", min: 20000, max: 30000 },
    { label: "€30,000+", value: "30000+", min: 30000 }
  ],
  yearRanges: [
    { label: "2020+", value: "2020+", min: 2020 },
    { label: "2018-2019", value: "2018-2019", min: 2018, max: 2019 },
    { label: "2015-2017", value: "2015-2017", min: 2015, max: 2017 },
    { label: "2010-2014", value: "2010-2014", min: 2010, max: 2014 }
  ]
};

// Helper function to format vehicle price
export const formatPrice = (price: number): string => {
  return `€${price.toLocaleString()}`;
};

// Helper function to format vehicle mileage
export const formatMileage = (mileage: number): string => {
  return `${mileage.toLocaleString()} km`;
};

// Helper function to get vehicle image placeholder based on brand
export const getVehicleImagePlaceholder = (brand: string): string => {
  const imageMap: Record<string, string> = {
    BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    Mercedes: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    Volkswagen: "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    Škoda: "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    Seat: "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  };
  
  return imageMap[brand] || "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
};

// Vehicle condition mapping
export const vehicleConditions = [
  "Excellent",
  "Very Good", 
  "Good",
  "Fair"
] as const;

// Common vehicle features
export const commonVehicleFeatures = [
  "Navigation System",
  "Leather Seats",
  "Automatic Climate Control",
  "Parking Sensors",
  "AWD",
  "Premium Audio",
  "LED Headlights",
  "Panoramic Sunroof",
  "Digital Cockpit",
  "Bluetooth",
  "Alloy Wheels",
  "Air Conditioning",
  "Cruise Control",
  "Heated Seats",
  "Keyless Entry",
  "Rear Camera",
  "Infotainment System",
  "Safety Pack",
  "Electric Windows",
  "Central Locking",
  "Sport Seats",
  "Touchscreen",
  "USB Connectivity",
  "ESP"
] as const;

// Helper to generate vehicle specification string
export const generateVehicleSpecs = (year: number, engine: string, transmission: string): string => {
  return `${year} • ${engine} • ${transmission}`;
};

// Helper to validate vehicle data
export const isValidVehicleBrand = (brand: string): brand is typeof vehicleBrands[number] => {
  return vehicleBrands.includes(brand as any);
};

export const isValidFuelType = (fuelType: string): fuelType is typeof fuelTypes[number] => {
  return fuelTypes.includes(fuelType as any);
};

export const isValidTransmission = (transmission: string): transmission is typeof transmissionTypes[number] => {
  return transmissionTypes.includes(transmission as any);
};

export const isValidImportCountry = (country: string): country is typeof importCountries[number] => {
  return importCountries.includes(country as any);
};
