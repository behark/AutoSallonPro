import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVehicles, addVehicle, updateVehicle, deleteVehicle, uploadImage, Vehicle as VehicleType } from "@/api/vehicleManagementApi";
import { 
  Plus, Trash2, Upload, Save, Car, Edit, X, ImagePlus, 
  CheckCircle, AlertCircle, ChevronDown, ChevronUp, Eye
} from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { Link } from "wouter";

// Using the Vehicle type from our API

// Blank vehicle template
const blankVehicle: Omit<VehicleType, "id"> = {
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  condition: "Used",
  fuelType: "Petrol",
  transmission: "Manual",
  engine: "",
  description: "",
  images: [],
  featured: false,
  importCountry: "Finland",
  features: [],
};

export default function AdminCarManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("add");
  const [currentVehicle, setCurrentVehicle] = useState<Omit<VehicleType, "id">>(blankVehicle);
  const [editId, setEditId] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch vehicles
  const { data: vehicles = [], isLoading } = useQuery<VehicleType[]>({
    queryKey: ["/api/vehicles"],
    queryFn: fetchVehicles
  });
  
  // Add mutation
  const addVehicleMutation = useMutation({
    mutationFn: (vehicle: Omit<VehicleType, "id">) => addVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Vehicle Added",
        description: "The vehicle has been successfully added to the inventory.",
      });
      setCurrentVehicle(blankVehicle);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add vehicle: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateVehicleMutation = useMutation({
    mutationFn: ({ id, vehicle }: { id: string; vehicle: Omit<VehicleType, "id"> }) => updateVehicle(id, vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Vehicle Updated",
        description: "The vehicle has been successfully updated.",
      });
      setEditId(null);
      setCurrentVehicle(blankVehicle);
      setActiveTab("list");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update vehicle: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been successfully removed from the inventory.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete vehicle: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form input changes
  const handleChange = (key: keyof typeof currentVehicle, value: any) => {
    setCurrentVehicle({ ...currentVehicle, [key]: value });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editId) {
      updateVehicleMutation.mutate({ id: editId, vehicle: currentVehicle });
    } else {
      addVehicleMutation.mutate(currentVehicle);
    }
  };
  
  // Handle adding a new feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...(currentVehicle.features || []), newFeature.trim()];
      setCurrentVehicle({ ...currentVehicle, features: updatedFeatures });
      setNewFeature("");
    }
  };
  
  // Handle removing a feature
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = currentVehicle.features?.filter((_, i) => i !== index);
    setCurrentVehicle({ ...currentVehicle, features: updatedFeatures });
  };
  
  // Handle image upload
  const handleImageUpload = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    // Handle file selection
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        setIsUploading(true);
        setImageUploadProgress(0);
        
        try {
          // Progress simulation
          const interval = setInterval(() => {
            setImageUploadProgress(prev => Math.min(prev + 10, 90));
          }, 300);
          
          // Actual upload
          const imageUrl = await uploadImage(file);
          
          // Cleanup and update
          clearInterval(interval);
          setImageUploadProgress(100);
          
          setTimeout(() => {
            const updatedImages = [...(currentVehicle.images || []), imageUrl];
            setCurrentVehicle({ ...currentVehicle, images: updatedImages });
            setIsUploading(false);
            setImageUploadProgress(0);
          }, 500);
        } catch (error) {
          toast({
            title: "Upload Failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
          setImageUploadProgress(0);
        }
      }
    };
    
    // Trigger file selection
    fileInput.click();
  };
  
  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    const updatedImages = currentVehicle.images?.filter((_, i) => i !== index);
    setCurrentVehicle({ ...currentVehicle, images: updatedImages });
  };
  
  // Handle editing a vehicle
  const handleEdit = (vehicle: VehicleType) => {
    setCurrentVehicle({
      brand: vehicle.brand || "",
      make: vehicle.make || "",
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage || 0,
      condition: vehicle.condition || "Used",
      fuelType: vehicle.fuelType || "Petrol",
      transmission: vehicle.transmission || "Manual",
      engine: vehicle.engine || "",
      description: vehicle.description || "",
      images: vehicle.images || [],
      featured: vehicle.featured || false,
      importCountry: vehicle.importCountry || "Finland",
      features: vehicle.features || [],
    });
    setEditId(vehicle.id);
    setActiveTab("add");
  };
  
  // Handle deleting a vehicle
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
      deleteVehicleMutation.mutate(id);
    }
  };
  
  return (
    <>
      <SEO title="Car Management | ANI Auto Sallon Admin" description="Add, edit, and manage your vehicle inventory" />
      
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Website
              </Button>
            </Link>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="list" className="text-sm">
                Vehicle Inventory
              </TabsTrigger>
              <TabsTrigger value="add" className="text-sm">
                {editId ? "Edit Vehicle" : "Add New Vehicle"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Inventory</CardTitle>
                  <CardDescription>
                    Manage your existing vehicles or add new ones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  ) : vehicles.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 p-4 rounded-full inline-flex justify-center items-center mb-4">
                        <Car className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="text-gray-600 mb-4">No vehicles in inventory yet</p>
                      <Button onClick={() => setActiveTab("add")} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Your First Vehicle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.map((vehicle) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="h-16 w-16 rounded-md overflow-hidden mr-4">
                            <img 
                              src={vehicle.images?.[0] || "/api/placeholder/160/120"} 
                              alt={`${vehicle.brand || vehicle.make || ''} ${vehicle.model}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {vehicle.brand || vehicle.make || ''} {vehicle.model}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span className="mr-3">{vehicle.year}</span>
                              <span>{vehicle.price && `€${vehicle.price.toLocaleString()}`}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(vehicle)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(vehicle.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={() => {
                    setEditId(null);
                    setCurrentVehicle(blankVehicle);
                    setActiveTab("add");
                  }} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Vehicle
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>{editId ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
                  <CardDescription>
                    {editId 
                      ? "Update the details of this vehicle" 
                      : "Fill in the details to add a new vehicle to your inventory"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand/Make
                          </label>
                          <Input 
                            value={currentVehicle.brand || ""}
                            onChange={(e) => handleChange("brand", e.target.value)}
                            placeholder="E.g., BMW, Mercedes, Audi"
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model
                          </label>
                          <Input 
                            value={currentVehicle.model}
                            onChange={(e) => handleChange("model", e.target.value)}
                            placeholder="E.g., X5, E-Class, A4"
                            className="w-full"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Year
                            </label>
                            <Input 
                              type="number"
                              value={currentVehicle.year}
                              onChange={(e) => handleChange("year", parseInt(e.target.value))}
                              placeholder="E.g., 2022"
                              className="w-full"
                              required
                              min={1900}
                              max={new Date().getFullYear() + 1}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price (€)
                            </label>
                            <Input 
                              type="number"
                              value={currentVehicle.price}
                              onChange={(e) => handleChange("price", parseInt(e.target.value))}
                              placeholder="E.g., 25000"
                              className="w-full"
                              required
                              min={0}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Mileage (km)
                            </label>
                            <Input 
                              type="number"
                              value={currentVehicle.mileage || 0}
                              onChange={(e) => handleChange("mileage", parseInt(e.target.value))}
                              placeholder="E.g., 50000"
                              className="w-full"
                              min={0}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Condition
                            </label>
                            <Select 
                              value={currentVehicle.condition || "Used"}
                              onValueChange={(value) => handleChange("condition", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Used">Used</SelectItem>
                                <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fuel Type
                            </label>
                            <Select 
                              value={currentVehicle.fuelType || "Petrol"}
                              onValueChange={(value) => handleChange("fuelType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Petrol">Petrol</SelectItem>
                                <SelectItem value="Diesel">Diesel</SelectItem>
                                <SelectItem value="Electric">Electric</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Transmission
                            </label>
                            <Select 
                              value={currentVehicle.transmission || "Manual"}
                              onValueChange={(value) => handleChange("transmission", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select transmission" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                                <SelectItem value="CVT">CVT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Engine
                          </label>
                          <Input 
                            value={currentVehicle.engine || ""}
                            onChange={(e) => handleChange("engine", e.target.value)}
                            placeholder="E.g., 2.0L Turbo, 1.6L Diesel"
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Import Country
                          </label>
                          <Select 
                            value={currentVehicle.importCountry || "Finland"}
                            onValueChange={(value) => handleChange("importCountry", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select import country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Finland">Finland</SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="Sweden">Sweden</SelectItem>
                              <SelectItem value="Netherlands">Netherlands</SelectItem>
                              <SelectItem value="Belgium">Belgium</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={currentVehicle.featured || false}
                            onChange={(e) => handleChange("featured", e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                            Featured Vehicle (shown on homepage)
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <Textarea 
                            value={currentVehicle.description || ""}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Detailed description of the vehicle..."
                            className="w-full min-h-[150px]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Images
                          </label>
                          <div className="space-y-3">
                            {isUploading && (
                              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                  <div 
                                    className="bg-primary-600 h-2.5 rounded-full" 
                                    style={{ width: `${imageUploadProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 text-center">Uploading: {imageUploadProgress}%</p>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-3">
                              {currentVehicle.images?.map((image, index) => (
                                <div key={index} className="relative group">
                                  <div className="h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                                    <img
                                      src={image}
                                      alt={`Vehicle image ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                              
                              <button
                                type="button"
                                onClick={handleImageUpload}
                                disabled={isUploading}
                                className="h-20 w-20 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors"
                              >
                                <ImagePlus className="h-6 w-6 mb-1" />
                                <span className="text-xs">Add</span>
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                              Tip: Add multiple images to showcase the vehicle from different angles
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Features & Equipment
                          </label>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="E.g., Leather seats, Navigation, Sunroof"
                                className="flex-1"
                              />
                              <Button 
                                type="button"
                                onClick={handleAddFeature}
                                disabled={!newFeature.trim()}
                              >
                                Add
                              </Button>
                            </div>
                            
                            {currentVehicle.features && currentVehicle.features.length > 0 ? (
                              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                <ul className="space-y-2">
                                  {currentVehicle.features.map((feature, index) => (
                                    <li 
                                      key={index}
                                      className="flex justify-between items-center bg-white px-3 py-2 rounded border border-gray-100"
                                    >
                                      <span>{feature}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No features added yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditId(null);
                      setCurrentVehicle(blankVehicle);
                      setActiveTab("list");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editId ? "Update Vehicle" : "Save Vehicle"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
