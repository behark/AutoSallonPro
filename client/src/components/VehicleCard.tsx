import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Phone, Fuel, MapPin, Gauge, Calendar, Key, Tag, ArrowRight, Clock, Info } from "lucide-react";
import { Vehicle } from "@shared/schema";
import { useTranslation } from "../lib/i18n";
import { EditableBadge, EditableButton, EditableText } from "./EditableText";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails?: (vehicle: Vehicle) => void;
  onContact?: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onViewDetails, onContact }: VehicleCardProps) {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleViewDetails = () => {
    onViewDetails?.(vehicle);
  };

  const handleContact = () => {
    onContact?.(vehicle);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return `€${price.toLocaleString()}`;
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} km`;
  };
  
  // Get the first image or use fallback
  const vehicleImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[0] 
    : "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="vehicle-card group h-full flex flex-col">
        <div className="vehicle-card-image">
          <img
            src={vehicleImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            width="640"
            height="360"
            className="w-full h-full object-cover hover-zoom transition-transform duration-500"
          />
          
          {/* Price tag */}
          <div className="price-tag">
            <span className="text-base md:text-lg font-bold">{formatPrice(vehicle.price)}</span>
          </div>
          
          {/* Import badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="destructive" className="badge-featured px-3 py-1.5 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <EditableBadge 
                sectionKey="vehicle_import_badge"
                defaultValue="Import from"
                page="global"
                section="vehicles"
              /> {vehicle.importCountry}
            </Badge>
          </div>
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white shadow-lg text-accent hover:text-accent-700 transition-all duration-300"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-5 flex-grow flex flex-col">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-secondary-800 mb-1 line-clamp-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="flex items-center text-secondary-600 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-3">{vehicle.year}</span>
              <Key className="h-4 w-4 mr-1" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-secondary-700 text-sm">
            <div className="car-info-item">
              <Gauge className="h-4 w-4 text-primary" />
              <span>{formatMileage(vehicle.mileage)}</span>
            </div>
            <div className="car-info-item">
              <Fuel className="h-4 w-4 text-primary" />
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="car-info-item">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{vehicle.importCountry}</span>
            </div>
            <div className="car-info-item">
              <Clock className="h-4 w-4 text-primary" />
              <EditableText 
                sectionKey="vehicle_available_label"
                defaultValue="Available Now"
                className=""
                page="global"
                section="vehicles"
                as="span"
              />
            </div>
          </div>
          
          {/* Negotiable label */}
          <div className="mb-4 text-sm">
            <span className="inline-flex items-center text-secondary-600">
              <Info className="h-4 w-4 mr-1" />
              <EditableText 
                sectionKey="vehicle_negotiable_label"
                defaultValue="Price Negotiable"
                className=""
                page="global"
                section="vehicles"
                as="span"
              />
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <Link href={`/vehicles/${vehicle.id}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleViewDetails}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <EditableButton 
                  sectionKey="vehicle_view_details_button"
                  defaultValue="View Details"
                  page="global"
                  section="vehicles"
                />
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button
              variant="secondary"
              onClick={handleContact}
              className="btn-accent w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              <EditableButton 
                sectionKey="vehicle_contact_button"
                defaultValue="Contact"
                page="global"
                section="vehicles"
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
