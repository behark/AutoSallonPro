import React, { useEffect, useState } from "react";
import axios from "axios";
import { Facebook as FacebookIcon, ExternalLink, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FacebookCar {
  images: string[];
  info: string;
  price: string;
  created_time: string;
}

interface FacebookCarListProps {
  pageId: string;
}

export const FacebookCarList: React.FC<FacebookCarListProps> = ({ pageId }) => {
  const [cars, setCars] = useState<FacebookCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/facebook-cars?pageId=${pageId}`)
      .then((res) => setCars(res.data))
      .catch((err) => setError("Failed to load Facebook cars"))
      .finally(() => setLoading(false));
  }, [pageId]);

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading cars from Facebook...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
          <h3 className="text-red-700 font-medium text-lg mb-2">Unable to Load Cars</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => {
              setError("");
              setLoading(true);
              axios
                .get(`/api/facebook-cars?pageId=${pageId}`)
                .then((res) => setCars(res.data))
                .catch((err) => setError("Failed to load Facebook cars"))
                .finally(() => setLoading(false));
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (cars.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-lg mx-auto text-center">
          <FacebookIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-gray-700 font-medium text-lg mb-2">No Cars Found</h3>
          <p className="text-gray-600 mb-4">No car listings were found on this Facebook page.</p>
          <a 
            href={`https://www.facebook.com/${pageId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            Visit Facebook Page <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FacebookIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold">Latest from Facebook</h2>
        </div>
        
        <a 
          href={`https://www.facebook.com/${pageId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline inline-flex items-center text-sm"
        >
          View All on Facebook <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, idx) => (
          <Card key={idx} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative">
              {car.images && car.images.length > 0 && (
                <img
                  src={car.images[0]}
                  alt={car.info || "Car"}
                  className="w-full h-56 object-cover"
                />
              )}
              <Badge className="absolute top-3 right-3 bg-blue-600">Facebook</Badge>
            </div>
            
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">
                {car.info || "Car"}
              </h3>
              
              <div className="text-blue-600 font-bold text-xl mb-4">{car.price}</div>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {new Date(car.created_time).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {car.images && car.images.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.images.slice(1, 4).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${car.info || "Car"} - Image ${i+2}`}
                      className="h-14 w-20 object-cover rounded border"
                    />
                  ))}
                  {car.images.length > 4 && (
                    <div className="h-14 w-20 bg-gray-200 rounded border flex items-center justify-center">
                      <span className="text-gray-600 font-medium">+{car.images.length - 4}</span>
                    </div>
                  )}
                </div>
              )}
              
              {car.link && (
                <a 
                  href={car.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
