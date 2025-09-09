"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Upload, 
  Edit, 
  Trash2, 
  Star, 
  ImageIcon, 
  Loader2,
  X,
  Plus
} from "lucide-react";
import { 
  createImageAction,
  updateImageAction,
  deleteImageAction,
  getImagesByOrganizationAction,
  setFeaturedImageAction
} from "@/actions/image-galleries-actions";
import { uploadImage, deleteImage as deleteImageFromStorage, validateImageFile } from "@/lib/supabase-storage";
import type { Image, NewImage } from "@/db/schema";

interface ImageManagerProps {
  organizationId: string;
  organizationType: "agency" | "supplier";
}

export default function ImageManager({ organizationId, organizationType }: ImageManagerProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editImageAltText, setEditImageAltText] = useState("");
  const [editImageCaption, setEditImageCaption] = useState("");

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, [organizationId, organizationType]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const result = await getImagesByOrganizationAction(organizationId, organizationType);
      if (result.isSuccess && result.data) {
        setImages(result.data);
      } else {
        setError(result.message || "Failed to load images");
      }
    } catch (error) {
      setError("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setError(null);
    }
  }, []);

  // Upload images
  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        // Upload to storage
        const uploadResult = await uploadImage(file, organizationType, organizationId);
        if (!uploadResult.success || !uploadResult.data) {
          throw new Error(uploadResult.error || "Upload failed");
        }

        // Create image record in database
        const imageData: NewImage = {
          organizationId,
          organizationType,
          fileName: file.name,
          filePath: uploadResult.data.path,
          fileUrl: uploadResult.data.url,
          fileSize: uploadResult.data.size,
          mimeType: uploadResult.data.type,
          altText: file.name,
          sortOrder: 0,
        };

        const imageResult = await createImageAction(imageData);
        if (!imageResult.isSuccess) {
          throw new Error(imageResult.message || "Failed to create image record");
        }

        return imageResult.data;
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Update images state
      setImages(prevImages => [...prevImages, ...uploadedImages.filter(img => img !== undefined)]);

      setSelectedFiles([]);
      setSuccess(`${uploadedImages.length} images uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  // Update image
  const handleUpdateImage = async (imageId: string) => {
    try {
      const result = await updateImageAction(imageId, {
        altText: editImageAltText,
        caption: editImageCaption,
      });

      if (result.isSuccess) {
        setImages(images.map(image => 
          image.id === imageId 
            ? { ...image, altText: editImageAltText, caption: editImageCaption }
            : image
        ));
        setEditingImage(null);
        setSuccess("Image updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to update image");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  // Delete image
  const handleDeleteImage = async (image: Image) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      // Delete from storage
      const storageResult = await deleteImageFromStorage(organizationType, image.filePath);
      if (!storageResult.success) {
        console.warn("Failed to delete from storage:", storageResult.error);
      }

      // Delete from database
      const result = await deleteImageAction(image.id);
      if (result.isSuccess) {
        setImages(images.filter(img => img.id !== image.id));
        setSuccess("Image deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to delete image");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  // Set image as featured
  const handleSetFeatured = async (imageId: string) => {
    try {
      const result = await setFeaturedImageAction(imageId);
      if (result.isSuccess) {
        // Update local state to reflect the change
        setImages(images.map(img => ({
          ...img,
          isFeatured: img.id === imageId
        })));
        setSuccess("Featured image updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to set featured image");
      }
    } catch (error) {
      setError("Failed to set featured image");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Section */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
              Choose Images
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPEG, PNG, WebP. Max size: 10MB per file.
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {file.name}
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                onClick={handleUploadImages}
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length > 0 && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Images ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image.fileUrl}
                      alt={image.altText || image.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingImage(image.id);
                                setEditImageAltText(image.altText || "");
                                setEditImageCaption(image.caption || "");
                              }}
                              className="h-8 w-8 p-0 bg-white text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Image</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="alt-text">Alt Text</Label>
                                <Input
                                  id="alt-text"
                                  value={editImageAltText}
                                  onChange={(e) => setEditImageAltText(e.target.value)}
                                  placeholder="Describe the image for accessibility"
                                />
                              </div>
                              <div>
                                <Label htmlFor="caption">Caption</Label>
                                <Textarea
                                  id="caption"
                                  value={editImageCaption}
                                  onChange={(e) => setEditImageCaption(e.target.value)}
                                  placeholder="Optional caption for the image"
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingImage(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleUpdateImage(image.id)}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {!image.isFeatured && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetFeatured(image.id)}
                            className="h-8 w-8 p-0 bg-white text-yellow-600 hover:bg-yellow-50"
                            title="Set as featured image"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteImage(image)}
                          className="h-8 w-8 p-0 bg-white text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.fileName}
                    </p>
                    {image.altText && (
                      <p className="text-xs text-gray-500 truncate">
                        {image.altText}
                      </p>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {image.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Images Message */}
      {images.length === 0 && (
        <Card className="border border-gray-200">
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-500 mb-4">Upload some images to showcase your work</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
