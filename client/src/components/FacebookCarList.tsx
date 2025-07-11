import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) return <div>Loading Facebook cars...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (cars.length === 0) return <div>No Facebook cars found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car, idx) => (
        <div key={idx} className="border rounded-lg shadow p-4 bg-white">
          {car.images && car.images.length > 0 && (
            <img
              src={car.images[0]}
              alt={car.info || `Car ${idx + 1}`}
              className="w-full h-48 object-cover rounded mb-2"
            />
          )}
          <div className="font-semibold text-lg mb-1">{car.info || "Car"}</div>
          <div className="text-blue-600 font-bold text-xl mb-2">{car.price}</div>
          {car.images.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {car.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={car.info || `Car ${idx + 1}`}
                  className="h-14 w-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
