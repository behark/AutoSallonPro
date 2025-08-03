import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define Vehicle type locally if not imported elsewhere
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  isNew?: boolean;
}

// Fetch vehicles function
const fetchVehicles = async (): Promise<Vehicle[]> => {
  // Mock data representing premium Finnish imports similar to Sherreti style
  return [
    {
      id: "1",
      make: "BMW",
      model: "X7 M50i",
      year: 2024,
      price: 89900,
      mileage: 5000,
      image: "/api/placeholder/400/300",
      isNew: false
    },
    {
      id: "2", 
      make: "MERCEDES",
      model: "GLS 63 AMG",
      year: 2025,
      price: 125000,
      mileage: 0,
      image: "/api/placeholder/400/300",
      isNew: true
    },
    {
      id: "3",
      make: "AUDI",
      model: "RSQ8 4.0 TFSI",
      year: 2024,
      price: 98500,
      mileage: 8000,
      image: "/api/placeholder/400/300",
      isNew: false
    },
    {
      id: "4",
      make: "VOLKSWAGEN",
      model: "ID.7 Pro S",
      year: 2025,
      price: 55900,
      mileage: 0,
      image: "/api/placeholder/400/300",
      isNew: true
    },
    {
      id: "5",
      make: "BMW",
      model: "M4 Competition",
      year: 2024,
      price: 76500,
      mileage: 12000,
      image: "/api/placeholder/400/300",
      isNew: false
    },
    {
      id: "6",
      make: "MERCEDES",
      model: "E 63 S AMG",
      year: 2024,
      price: 89900,
      mileage: 7500,
      image: "/api/placeholder/400/300",
      isNew: false
    }
  ];
};

export default function Home() {
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section - Sherreti Style */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            With pleasure we present to you<br />
            <span className="text-blue-400">AUTO ANI</span>, as a regional leader with experience in car trading since 2005
          </h1>
          <h4 className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Browse our wide range of cars from economical to the most exclusive classes.
          </h4>
          <Link href="/inventory">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105">
              CLICK HERE FOR VEHICLES
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Services Section - Sherreti Style */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Featured Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Award Winner */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-600 text-2xl">🏆</span>
                </div>
                <h5 className="font-bold text-lg mb-3 text-gray-800">Award-Winning Service</h5>
                <p className="text-gray-600 text-sm">
                  One of the companies that has consistently won recognition for excellence in Kosovo's automotive sector since 2005.
                </p>
              </div>
            </div>

            {/* Trade-In */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🔄</span>
                </div>
                <h5 className="font-bold text-lg mb-3 text-gray-800">Trade Your Vehicle</h5>
                <p className="text-gray-600 text-sm">
                  Buy a new car from our inventory by paying only the difference in value between the new car and your current vehicle. We provide a complete evaluation of your current vehicle.
                </p>
              </div>
            </div>

            {/* Financing */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">💳</span>
                </div>
                <h5 className="font-bold text-lg mb-3 text-gray-800">Financing</h5>
                <p className="text-gray-600 text-sm">
                  Vehicle financing from well-known banks in Kosovo. This extraordinary opportunity allows you to buy a new car faster and easier, without the need to pay the entire amount at once.
                </p>
              </div>
            </div>

            {/* Warranty */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-2xl">🛡️</span>
                </div>
                <h5 className="font-bold text-lg mb-3 text-gray-800">Buy with Confidence – Vehicle with Warranty</h5>
                <p className="text-gray-600 text-sm">
                  All our vehicles come with full warranty after sale, in accordance with European standards. AUTO ANI guarantees quality, safety and reliability for every imported vehicle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section - Sherreti Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Featured Vehicles
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            If you want to see the special cars we own and are available for sale, here are some of the options we have available
          </p>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading vehicles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading vehicles. Please try again later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles?.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative">
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {vehicle.isNew && (
                      <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-800">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <span className="bg-gray-100 px-3 py-1 rounded">{vehicle.year}</span>
                      <span className="bg-gray-100 px-3 py-1 rounded">
                        {vehicle.mileage === 0 ? '0 km' : `${vehicle.mileage.toLocaleString()} km`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        €{vehicle.price.toLocaleString()}
                      </span>
                      <Link href={`/vehicle/${vehicle.id}`}>
                        <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/inventory">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
                &gt; See all vehicles in stock &lt;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Showroom Section - Sherreti Style */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Find your dream car in our showroom.
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            We have a complete range of luxury vehicles at competitive prices, including brand new offers from high-end car manufacturers carefully selected to meet the needs and personality of the customer.
          </p>
        </div>
      </section>

      {/* Browse by Brand Section - Sherreti Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Browse by Brand
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We import all types of vehicles from Finland including: BMW, Mercedes, Audi, Volkswagen, Škoda and others.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "BMW", logo: "🚗" },
              { name: "Mercedes", logo: "⭐" },
              { name: "Audi", logo: "🔵" },
              { name: "Volkswagen", logo: "🚙" },
              { name: "Škoda", logo: "💎" },
              { name: "Volvo", logo: "🇸🇪" },
              { name: "Saab", logo: "✈️" },
              { name: "Seat", logo: "🎯" },
              { name: "Ford", logo: "🔷" },
              { name: "Opel", logo: "⚡" }
            ].map((brand) => (
              <Card key={brand.name} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h4 className="font-semibold text-gray-800">{brand.name}</h4>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
