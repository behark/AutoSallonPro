import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Phone, Fuel, MapPin, Gauge } from "lucide-react";
import { Vehicle } from "@shared/schema";
import { useTranslation } from "../lib/i18n";
import { EditableBadge, EditableButton, EditableText } from "./EditableText";
import { Link } from "wouter";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails?: (vehicle: Vehicle) => void;
  onContact?: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onViewDetails, onContact }: VehicleCardProps) {
  const { t } = useTranslation();

  const handleViewDetails = () => {
    onViewDetails?.(vehicle);
  };

  const handleContact = () => {
    onContact?.(vehicle);
  };

  const formatPrice = (price: number) => {
    return `€${price.toLocaleString()}`;
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} km`;
  };

  return (
    <Card className="vehicle-card group">
      <div className="relative">
        <img
          src={vehicle.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-64 object-contain bg-gray-100"
        />
        
        <div className="absolute top-4 left-4">
          <Badge variant="destructive" className="bg-accent">
            <EditableBadge 
              sectionKey="vehicle_import_badge"
              defaultValue="Import from"
              page="global"
              section="vehicles"
            /> {vehicle.importCountry}
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-dark-gray">
              {vehicle.brand} {vehicle.model}
            </h4>
            <p className="text-secondary">
              {vehicle.year} • {vehicle.engine} • {vehicle.transmission}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{formatPrice(vehicle.price)}</div>
            <EditableText 
              sectionKey="vehicle_negotiable_label"
              defaultValue="Negotiable"
              className="text-sm text-secondary"
              page="global"
              section="vehicles"
              as="div"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-secondary mb-4">
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-2" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{vehicle.importCountry}</span>
          </div>
        </div>
        
        {vehicle.description && (
          <p className="text-sm text-secondary mb-4 line-clamp-2">
            {vehicle.description}
          </p>
        )}
        
        <div className="flex space-x-2">
          <Link href={`/vehicle/${vehicle.id}`} className="flex-1">
            <Button className="w-full bg-primary-light hover:bg-primary">
              <EditableButton 
                sectionKey="vehicle_details_button"
                defaultValue="View Details"
                page="global"
                section="vehicles"
              />
            </Button>
          </Link>
          <Button
            onClick={handleContact}
            variant="outline"
            size="icon"
            className="border-primary-light text-primary-light hover:bg-primary-light hover:text-white"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
