import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useTranslation } from "../lib/i18n";
import { 
  Phone, Mail, MapPin, Car, Fuel, Calendar, Settings, Gauge, Flag, 
  ChevronLeft, ChevronRight, ArrowLeft, Share2, Heart, Star, 
  Shield, CheckCircle, AlertCircle, Maximize, X, Tag, Award,
  Info, Clipboard, Clock, ShieldCheck, Users, Truck, Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import { Link } from "wouter";

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
  engine?: string;
  description?: string;
  images?: string[];
  featured?: boolean;
  importCountry?: string;
  features?: string[];
}

// Utility functions for formatting
const formatPrice = (price: number): string => {
  return `\u20ac${price.toLocaleString()}`;
};

const formatMileage = (mileage?: number): string => {
  if (!mileage) return "N/A";
  return `${mileage.toLocaleString()} km`;
};

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { data: vehicle, isLoading, error } = useQuery<Vehicle>({
    queryKey: ["/api/vehicles", id],
    enabled: !!id,
  });
  
  // Handle escape key to exit fullscreen mode
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullscreen]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the vehicle you're looking for. It may have been removed or the URL is incorrect.</p>
          <Link href="/inventory">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real implementation, this would save to user's favorites in database
  };

  const handleContactClick = () => {
    window.open(`tel:049204242`, '_blank');
  };

  const handleEmailClick = () => {
    const brand = vehicle?.brand || vehicle?.make || '';
    window.open(`mailto:aniautosallon@gmail.com?subject=Interest in ${brand} ${vehicle?.model || ''}`, '_blank');
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle?.brand || vehicle?.make || ''} ${vehicle?.model || ''} at ANI Auto Sallon`,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (vehicle?.images && vehicle.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images!.length);
    }
  };

  const prevImage = () => {
    if (vehicle?.images && vehicle.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images!.length) % vehicle.images!.length);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  // Get vehicle images with fallback for empty array
  const vehicleImages = vehicle?.images || [];
  const currentImage = vehicleImages[currentImageIndex] || '/api/placeholder/800/600';
  
  // Get vehicle features with fallback for empty array
  const vehicleFeatures = vehicle?.features || [];

  return (
    <>
      <SEO 
        title={`${vehicle?.brand || vehicle?.make || ''} ${vehicle?.model || ''} | ANI Auto Sallon`} 
        description={`${vehicle?.year || ''} ${vehicle?.brand || vehicle?.make || ''} ${vehicle?.model || ''} with ${formatMileage(vehicle?.mileage)} - ${vehicle?.description?.substring(0, 100) || 'Premium vehicle'}`} 
      />
      
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm">
                <Link href="/">
                  <span className="text-gray-500 hover:text-primary-600 cursor-pointer">Home</span>
                </Link>
                <span className="text-gray-500">/</span>
                <Link href="/inventory">
                  <span className="text-gray-500 hover:text-primary-600 cursor-pointer">Inventory</span>
                </Link>
                <span className="text-gray-500">/</span>
                <span className="text-gray-900 font-medium">
                  {vehicle?.brand || vehicle?.make || ''} {vehicle?.model || ''}
                </span>
              </div>
              <Link href="/inventory">
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Inventory
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Gallery - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm h-[400px] sm:h-[500px] group cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              >
                <img 
                  src={currentImage} 
                  alt={`${vehicle?.brand || vehicle?.make || ''} ${vehicle?.model || ''}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white w-10 h-10 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreen(true);
                    }}
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
                
                {vehicleImages.length > 1 && (
                  <>
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-3 z-10">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }} 
                        size="icon"
                        variant="secondary" 
                        className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white w-10 h-10 shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="absolute top-1/2 transform -translate-y-1/2 right-3 z-10">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }} 
                        size="icon"
                        variant="secondary" 
                        className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white w-10 h-10 shadow-md"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                )}
                
                {/* Price badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg text-xl">
                    {formatPrice(vehicle.price)}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite();
                    }} 
                    size="icon"
                    variant="secondary" 
                    className={`rounded-full ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/90 backdrop-blur-sm hover:bg-white'} w-10 h-10 shadow-md`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareClick();
                    }} 
                    size="icon"
                    variant="secondary" 
                    className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white w-10 h-10 shadow-md"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
              
              {/* Fullscreen Image Gallery Modal */}
              <AnimatePresence>
                {isFullscreen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        onClick={() => setIsFullscreen(false)}
                        size="icon"
                        variant="outline"
                        className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white w-12 h-12"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    
                    <div className="w-full h-full max-w-6xl max-h-[80vh] relative flex items-center justify-center">
                      <motion.img
                        key={currentImageIndex}
                        initial={{ opacity: 0.5, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        src={currentImage}
                        alt={`${vehicle?.brand || vehicle?.make || ''} ${vehicle?.model || ''}`}
                        className="max-w-full max-h-full object-contain"
                      />
                      
                      {vehicleImages.length > 1 && (
                        <>
                          <Button
                            onClick={prevImage}
                            size="icon"
                            variant="ghost"
                            className="absolute left-2 rounded-full bg-black/50 hover:bg-black/70 text-white w-12 h-12"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </Button>
                          <Button
                            onClick={nextImage}
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 rounded-full bg-black/50 hover:bg-black/70 text-white w-12 h-12"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* Fullscreen thumbnails */}
                    {vehicleImages.length > 1 && (
                      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 overflow-x-auto py-2">
                        <div className="flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full">
                          {vehicleImages.map((image, index) => (
                            <div
                              key={index}
                              onClick={() => selectImage(index)}
                              className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${index === currentImageIndex ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                            >
                              <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Thumbnails */}
              {vehicleImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {vehicleImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div 
                        onClick={() => selectImage(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          index === currentImageIndex ? 'border-primary-500 shadow-md' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Vehicle Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {vehicle?.brand || vehicle?.make || ''} {vehicle?.model || ''}
                </h1>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{vehicle?.year}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Gauge className="w-4 h-4 mr-1" />
                    <span>{formatMileage(vehicle?.mileage)}</span>
                  </div>
                  {vehicle?.importCountry && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Flag className="w-4 h-4 mr-1" />
                      <span>Imported from {vehicle.importCountry}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Description */}
              {vehicle?.description && (
                <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-gray-700 leading-relaxed"
                    >
                      {vehicle.description}
                    </motion.p>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              {vehicleFeatures.length > 0 && (
                <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Settings className="w-5 h-5 text-primary-500" />
                      Features & Equipment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {vehicleFeatures.map((feature, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 font-medium py-1.5 px-3">
                            {feature}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Specifications */}
              <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800 font-semibold">
                    <Car className="w-5 h-5 text-primary-600" />
                    Vehicle Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Settings className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Engine</p>
                        <p className="font-medium text-gray-900">{vehicle?.engine || 'N/A'}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Settings className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transmission</p>
                        <p className="font-medium text-gray-900">{vehicle?.transmission || 'N/A'}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Fuel className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fuel Type</p>
                        <p className="font-medium text-gray-900">{vehicle?.fuelType || 'N/A'}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Gauge className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mileage</p>
                        <p className="font-medium text-gray-900">{formatMileage(vehicle?.mileage)}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium text-gray-900">{vehicle?.year}</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Tag className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Condition</p>
                        <p className="font-medium text-gray-900">{vehicle?.condition || 'N/A'}</p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Dealer Info */}
              <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-5 h-5" />
                    Contact Dealer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col space-y-4"
                  >
                    <div className="mb-2">
                      <p className="text-gray-600 mb-2">Interested in this vehicle? Contact us for more details or to schedule a test drive.</p>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button 
                        onClick={handleContactClick}
                        size="lg"
                        className="w-full flex items-center justify-center gap-2 text-base bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg transition-shadow duration-200"
                      >
                        <Phone className="w-5 h-5" />
                        Call Dealer
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button 
                        onClick={handleEmailClick}
                        variant="outline"
                        size="lg"
                        className="w-full flex items-center justify-center gap-2 text-base hover:bg-primary-50 transition-colors duration-200 border-primary-200 text-primary-700 hover:text-primary-800 hover:border-primary-300"
                      >
                        <Mail className="w-5 h-5" />
                        Email Dealer
                      </Button>
                    </motion.div>
                    
                    <div className="pt-6 border-t border-gray-100 mt-2">
                      <div className="grid grid-cols-1 gap-4">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="bg-blue-50 p-2 rounded-full">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">049 204 242</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="flex items-center gap-3"
                        >
                          <div className="bg-green-50 p-2 rounded-full">
                            <Mail className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">aniautosallon@gmail.com</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <div className="bg-amber-50 p-2 rounded-full">
                            <MapPin className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium text-gray-900">Rr. Taukbashqe, Veternik, Prishtinë</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Warranty and Services */}
              <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Shield className="w-5 h-5 text-primary-500" />
                    Warranty & Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700">Free vehicle history report</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700">30-day warranty included</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700">Financing options available</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700">Full service history</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Vehicles */}
              <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Car className="w-5 h-5 text-primary-500" />
                    You May Also Like
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center text-sm text-gray-500 py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Car className="w-8 h-8 text-gray-400" />
                    </div>
                    <p>Similar vehicles will appear here as they become available.</p>
                    <Link href="/inventory">
                      <Button 
                        variant="link" 
                        className="mt-2 text-primary-600 hover:text-primary-700"
                      >
                        Browse all vehicles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
