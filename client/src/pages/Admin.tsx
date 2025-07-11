import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Vehicle, InsertVehicle } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageCarousel } from "@/components/ImageCarousel";

export default function Admin() {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertVehicle>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const createVehicleMutation = useMutation({
    mutationFn: (data: InsertVehicle) => apiRequest("/api/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsAddingNew(false);
      setFormData({});
      toast({ title: "Vehicle added successfully!" });
    },
    onError: (error) => {
      console.error("Create vehicle error:", error);
      toast({ 
        title: "Error creating vehicle", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertVehicle> }) => 
      apiRequest(`/api/vehicles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setEditingVehicle(null);
      setFormData({});
      toast({ title: "Vehicle updated successfully!" });
    },
    onError: (error) => {
      console.error("Update vehicle error:", error);
      toast({ 
        title: "Error updating vehicle", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/vehicles/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({ title: "Vehicle deleted successfully!" });
    },
  });

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setIsAddingNew(false);
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.brand || !formData.model || !formData.year || !formData.price) {
      toast({ 
        title: "Missing required fields", 
        description: "Please fill in brand, model, year, and price",
        variant: "destructive" 
      });
      return;
    }

    console.log("Saving vehicle with data:", formData);
    
    if (isAddingNew) {
      createVehicleMutation.mutate(formData as InsertVehicle);
    } else if (editingVehicle) {
      updateVehicleMutation.mutate({ id: editingVehicle.id, data: formData });
    }
  };

  const handleCancel = () => {
    setEditingVehicle(null);
    setIsAddingNew(false);
    setFormData({});
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingVehicle(null);
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: "Diesel",
      transmission: "Manual",
      engine: "",
      images: [],
      description: "",
      features: [],
      importCountry: "Germany",
      isAvailable: true,
      isFeatured: false,
    });
  };

  const handleInputChange = (field: keyof InsertVehicle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'images' | 'features', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Vehicle
          </Button>
        </div>

        {/* Edit Form */}
        {(editingVehicle || isAddingNew) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? "Add New Vehicle" : "Edit Vehicle"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model || ""}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange("price", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage || ""}
                    onChange={(e) => handleInputChange("mileage", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="engine">Engine</Label>
                  <Input
                    id="engine"
                    value={formData.engine || ""}
                    onChange={(e) => handleInputChange("engine", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <select
                    id="fuelType"
                    className="w-full p-2 border rounded"
                    value={formData.fuelType || ""}
                    onChange={(e) => handleInputChange("fuelType", e.target.value)}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <select
                    id="transmission"
                    className="w-full p-2 border rounded"
                    value={formData.transmission || ""}
                    onChange={(e) => handleInputChange("transmission", e.target.value)}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="DSG Automatic">DSG Automatic</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <ImageUpload
                  existingImages={formData.images || []}
                  onImagesUploaded={(imageUrls) => handleInputChange("images", imageUrls)}
                  maxImages={10}
                />
              </div>
              
              <div>
                <Label htmlFor="images">Or paste image URLs (comma-separated)</Label>
                <Textarea
                  id="images"
                  value={formData.images?.join(", ") || ""}
                  onChange={(e) => handleArrayChange("images", e.target.value)}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features?.join(", ") || ""}
                  onChange={(e) => handleArrayChange("features", e.target.value)}
                  placeholder="Navigation System, LED Headlights, Bluetooth"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable || false}
                    onChange={(e) => handleInputChange("isAvailable", e.target.checked)}
                    className="mr-2"
                  />
                  Available for Sale
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                    className="mr-2"
                  />
                  Featured Vehicle
                </label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles?.map((vehicle) => {
            const isTiguan = vehicle.model.toLowerCase().includes("tiguan");
            return (
              <Card
                key={vehicle.id}
                className={
                  isTiguan
                    ? "border-4 border-blue-500 shadow-lg scale-105 bg-blue-50"
                    : ""
                }
                style={isTiguan ? { gridColumn: "span 2" } : {}}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className={`text-lg ${isTiguan ? "text-blue-700 text-2xl" : ""}`}>
                        {vehicle.brand} {vehicle.model}
                        {isTiguan && (
                          <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">Tiguan Featured</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {vehicle.year} • €{vehicle.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => handleEdit(vehicle)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteVehicleMutation.mutate(vehicle.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <ImageCarousel images={vehicle.images} altBase={`${vehicle.brand} ${vehicle.model}`} className={isTiguan ? "h-64" : "h-48"} />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">No images</div>
                  )}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {vehicle.isFeatured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    {vehicle.isAvailable && (
                      <Badge variant="default">Available</Badge>
                    )}
                    <Badge variant="outline">{vehicle.images.length} images</Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {vehicle.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}