import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { VehicleCard } from "../components/VehicleCard";
import { VehicleFilters, FilterState } from "../components/VehicleFilters";
import { useTranslation } from "../lib/i18n";
// Define Vehicle interface locally if import fails
interface Vehicle {
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
  description?: string;
  images?: string[];
  featured?: boolean;
  importCountry?: string;
}
import { Loader2, Filter, Grid, List, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import { EditableTitle, EditableDescription } from "../components/EditableText";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { Badge } from "../components/ui/badge";

export default function Inventory() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    priceRange: "",
    year: "",
    fuelType: "",
    transmission: "",
    importCountry: "",
  });

  const { data: vehicles = [], isLoading, error } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles/available"],
  });

  const filterVehicles = (vehicles: Vehicle[], filters: FilterState) => {
    return vehicles.filter((vehicle) => {
      if (filters.brand && vehicle.brand !== filters.brand) return false;
      if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false;
      if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
      if (filters.importCountry && vehicle.importCountry !== filters.importCountry) return false;
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max && (vehicle.price < min || vehicle.price > max)) return false;
        if (!max && filters.priceRange.includes('+') && vehicle.price < min) return false;
      }
      
      if (filters.year) {
        if (filters.year.includes('+')) {
          const minYear = parseInt(filters.year.replace('+', ''));
          if (vehicle.year < minYear) return false;
        } else if (filters.year.includes('-')) {
          const [minYear, maxYear] = filters.year.split('-').map(Number);
          if (vehicle.year < minYear || vehicle.year > maxYear) return false;
        }
      }
      
      return true;
    });
  };

  const filteredVehicles = filterVehicles(vehicles, filters);

  const handleViewDetails = (vehicle: Vehicle) => {
    // TODO: Implement vehicle details modal or page
    console.log("View details for:", vehicle);
  };

  const handleContact = (vehicle: Vehicle) => {
    // TODO: Implement contact functionality
    console.log("Contact for:", vehicle);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Vehicles</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Added state for view mode and sorting options
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Sort vehicles based on selected option
  const sortVehicles = (vehicles: Vehicle[], sortOption: string) => {
    const sortedVehicles = [...vehicles];
    
    switch(sortOption) {
      case 'price-low':
        return sortedVehicles.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedVehicles.sort((a, b) => b.price - a.price);
      case 'newest':
        return sortedVehicles.sort((a, b) => b.year - a.year);
      case 'oldest':
        return sortedVehicles.sort((a, b) => a.year - b.year);
      case 'mileage-low':
        return sortedVehicles.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
      default:
        return sortedVehicles;
    }
  };
  
  // Apply sorting to filtered vehicles
  const sortedFilteredVehicles = sortVehicles(filteredVehicles, sortBy);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO 
        title="Inventory | Ani Auto Sallon"
        description="Browse our premium selection of imported vehicles from Finland and Germany. Find your dream car today."
        keywords="car dealership, imported cars, premium vehicles, Finland, Germany, auto sallon"
      />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-secondary-900 to-secondary-800 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary-900 opacity-90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-primary-light/20 text-primary-light px-4 py-1.5 mb-4 rounded-full font-medium text-sm inline-flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Premium Selection
            </Badge>
            <EditableTitle 
              sectionKey="inventory_title"
              defaultValue="Our Vehicle Collection"
              className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
              page="inventory"
              section="header"
            />
            <EditableDescription 
              sectionKey="inventory_subtitle"
              defaultValue="Browse our curated selection of premium vehicles imported from Finland and Germany"
              className="text-lg text-white/80 max-w-2xl mx-auto"
              page="inventory"
              section="header"
            />
          </motion.div>
        </div>
        
        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%' }}></div>
      </div>
      
      {/* Inventory Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-800 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{isFilterPanelOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            {/* Sorting and View Options */}
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div className="flex items-center gap-4">
                <label className="text-sm text-secondary-600">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-2 bg-white text-secondary-800 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="mileage-low">Mileage (Low to High)</option>
                </select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Panel - Visible on larger screens or when toggled on mobile */}
            <div className={`w-full lg:w-64 flex-shrink-0 ${isFilterPanelOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 text-secondary-900 flex items-center gap-2">
                  <Filter className="h-4 w-4" /> 
                  Filter Options
                </h3>
                <VehicleFilters onFiltersChange={setFilters} />
              </div>
            </div>
            
            {/* Vehicle Listing */}
            <div className="flex-grow">
              {filteredVehicles.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <AlertCircle className="h-12 w-12 text-secondary-300 mb-4" />
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">No Vehicles Found</h3>
                  <p className="text-secondary-600 max-w-md">No vehicles match your current filter criteria. Try adjusting your filters or browse our complete inventory.</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-secondary-600">
                      Showing <span className="font-semibold text-secondary-900">{filteredVehicles.length}</span> of <span className="font-semibold text-secondary-900">{vehicles.length}</span> vehicles
                    </p>
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.05 }}
                      className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {sortedFilteredVehicles.map((vehicle) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <VehicleCard
                            vehicle={vehicle}
                            onViewDetails={handleViewDetails}
                            onContact={handleContact}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {sortedFilteredVehicles.map((vehicle) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-64 md:h-auto relative">
                              {vehicle.images && vehicle.images.length > 0 ? (
                                <img 
                                  src={vehicle.images[0]} 
                                  alt={`${vehicle.make || vehicle.brand} ${vehicle.model}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">No Image</span>
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <span className="bg-secondary-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  {vehicle.year}
                                </span>
                              </div>
                              {vehicle.featured && (
                                <div className="absolute top-3 right-3">
                                  <span className="bg-primary-light text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Featured
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex flex-col justify-between flex-grow">
                              <div>
                                <div className="flex justify-between items-start">
                                  <h3 className="text-xl font-bold text-secondary-900">
                                    {vehicle.make || vehicle.brand} {vehicle.model}
                                  </h3>
                                  <p className="text-xl font-bold text-primary-dark">
                                    €{vehicle.price.toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-secondary-600 mt-2 line-clamp-2">{vehicle.description || "Premium imported vehicle with top features and excellent condition."}</p>
                                
                                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                                  {vehicle.mileage && (
                                    <div className="flex items-center text-sm text-secondary-600">
                                      <span className="font-medium">Mileage:</span>
                                      <span className="ml-1">{vehicle.mileage.toLocaleString()} km</span>
                                    </div>
                                  )}
                                  {vehicle.fuelType && (
                                    <div className="flex items-center text-sm text-secondary-600">
                                      <span className="font-medium">Fuel:</span>
                                      <span className="ml-1">{vehicle.fuelType}</span>
                                    </div>
                                  )}
                                  {vehicle.transmission && (
                                    <div className="flex items-center text-sm text-secondary-600">
                                      <span className="font-medium">Transmission:</span>
                                      <span className="ml-1">{vehicle.transmission}</span>
                                    </div>
                                  )}
                                  {vehicle.importCountry && (
                                    <div className="flex items-center text-sm text-secondary-600">
                                      <span className="font-medium">Imported From:</span>
                                      <span className="ml-1">{vehicle.importCountry}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                  onClick={() => handleContact(vehicle)}
                                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-secondary-800 rounded-lg transition-colors text-sm"
                                >
                                  Contact
                                </button>
                                <button
                                  onClick={() => handleViewDetails(vehicle)}
                                  className="px-4 py-2 bg-secondary-900 hover:bg-secondary-800 text-white rounded-lg transition-colors text-sm"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
