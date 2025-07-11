import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VehicleCard } from "../components/VehicleCard";
import { VehicleFilters, FilterState } from "../components/VehicleFilters";
import { useTranslation } from "../lib/i18n";
import { Vehicle } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { EditableTitle, EditableDescription } from "../components/EditableText";

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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <EditableTitle 
            sectionKey="inventory_title"
            defaultValue="Our Vehicle Inventory"
            className="text-4xl font-bold text-dark-gray mb-4"
            page="inventory"
            section="header"
            as="h1"
          />
          <EditableDescription 
            sectionKey="inventory_subtitle"
            defaultValue="Browse our collection of premium vehicles imported from Finland and Germany"
            className="text-lg text-secondary"
            page="inventory"
            section="header"
          />
        </div>
        
        <div className="mb-12">
          <VehicleFilters onFiltersChange={setFilters} />
        </div>
        
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-secondary">No vehicles found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-secondary">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onViewDetails={handleViewDetails}
                  onContact={handleContact}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
