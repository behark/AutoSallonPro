import { useState, useRef } from "react";
import { ImageCarousel } from "./ImageCarousel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export function ImageUpload({ 
  onImagesUploaded, 
  existingImages = [], 
  maxImages = 10 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Drag-and-drop handler
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (uploading) return;
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;
    await handleFilesUpload(files);
  };

  // Drag-over highlight
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // File input handler
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images total.`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const newImages = [...images, ...result.urls];
      setImages(newImages);
      onImagesUploaded(newImages);

      toast({
        title: "Images uploaded successfully!",
        description: `${result.urls.length} image(s) added.`
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (!window.confirm("Are you sure you want to remove this image?")) return;
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Drag-and-drop + reordering logic
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragEnd = () => setDraggedIndex(null);
  const handleDropImage = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...images];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, removed);
    setImages(reordered);
    onImagesUploaded(reordered);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <Label>Vehicle Images</Label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-2 min-h-[60px]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Upload Button */}
        <div className="flex items-center gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileSelect}
            disabled={uploading || images.length >= maxImages}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload from PC"}
          </Button>
          <span className="text-sm text-gray-500">
            {images.length}/{maxImages} images
          </span>
        </div>
        {/* Progress bars */}
        {uploading && uploadProgress.length > 0 && (
          <div className="flex flex-col gap-1 mb-2">
            {uploadProgress.map((progress, idx) => (
              <div key={idx} className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }} />
              </div>
            ))}
          </div>
        )}
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        {/* Image carousel preview */}
        {images.length > 0 && (
          <>
            <ImageCarousel images={images} altBase="Vehicle image" className="mb-2" />
            <div className="flex flex-wrap gap-2">
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`relative group border rounded-lg overflow-hidden w-20 h-20 flex items-center justify-center bg-gray-100 ${draggedIndex === index ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDrop={() => handleDropImage(index)}
                  onDragOver={e => e.preventDefault()}
                  title="Drag to reorder"
                >
                  <img
                    src={imageUrl}
                    alt={`Vehicle image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Empty state */}
        {images.length === 0 && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={triggerFileSelect}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Click to upload vehicle images</p>
            <p className="text-sm text-gray-500">or drag and drop files here</p>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG, GIF up to 5MB each</p>
          </div>
        )}
      </div>
    </div>
  );
}