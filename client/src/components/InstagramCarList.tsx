import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, RefreshCw, Car, Hash, Calendar, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInstagramCarsEndpoint } from '../lib/config';
import { InstagramCar } from '../lib/api/instagram';
import { formatCurrency } from '../utils/formatters';

interface InstagramCarListProps {
  pageId?: string;
}

// Instagram car list component that fetches car data from the Instagram API endpoint
export const InstagramCarList: React.FC<InstagramCarListProps> = ({ pageId }) => {
  const [retryCount, setRetryCount] = useState(0);

  // Fetch Instagram cars using React Query
  const {
    data: instagramCars,
    isLoading,
    isError,
    refetch,
  } = useQuery<InstagramCar[]>({
    queryKey: ['instagramCars', retryCount],
    queryFn: async () => {
      const response = await axios.get(getInstagramCarsEndpoint());
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Handle retry when fetch fails
  const handleRetry = () => {
    setRetryCount((count: number) => count + 1);
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <Loader2 className="h-10 w-10 animate-spin mb-3" />
        <p className="text-lg font-medium">Loading Instagram listings...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-600 border border-red-200 rounded-lg bg-red-50">
        <AlertCircle className="h-10 w-10 mb-3" />
        <p className="text-lg font-medium mb-3">Failed to load Instagram listings</p>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  // No data state
  if (!instagramCars || instagramCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600 border border-gray-200 rounded-lg bg-gray-50">
        <Car className="h-10 w-10 mb-3" />
        <p className="text-lg font-medium">No Instagram car listings available</p>
      </div>
    );
  }

  // Render cars
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <img src="/instagram-icon.svg" alt="Instagram" className="h-5 w-5" />
        Instagram Car Listings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instagramCars.map((car) => (
          <div key={car.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Car image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
              {car.images && car.images.length > 0 ? (
                <img 
                  src={car.images[0]} 
                  alt={`Instagram car ${car.id}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Car className="h-10 w-10 text-gray-400" />
                </div>
              )}
              
              <div className="absolute top-2 left-2">
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full inline-flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" fill="currentColor"/>
                  </svg>
                  Instagram
                </span>
              </div>
              
              {/* Price badge */}
              {car.price && (
                <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow text-green-600 font-bold">
                  {formatCurrency(car.price)}
                </div>
              )}
            </div>
            
            {/* Car details */}
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2 line-clamp-1">
                {car.info && car.info.split('\n')[0]}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{car.info}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {car.created_time && (
                  <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(car.created_time).toLocaleDateString()}
                  </span>
                )}
                {car.images && (
                  <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {car.images.length} {car.images.length === 1 ? 'image' : 'images'}
                  </span>
                )}
                {car.id && (
                  <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                    <Hash className="h-3 w-3 mr-1" />
                    ID: {car.id.substring(0, 8)}...
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/inventory?source=instagram&id=${car.id}`}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View Details
                </Link>
                <a 
                  href={car.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  View on Instagram
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramCarList;
