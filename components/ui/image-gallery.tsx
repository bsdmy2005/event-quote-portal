"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Edit, 
  Trash2, 
  Star, 
  ImageIcon, 
  Loader2,
  Plus,
  Upload
} from "lucide-react";
import { 
  updateImageAction,
  deleteImageAction,
  getImagesByOrganizationAction,
  createImageAction,
  setFeaturedImageAction
} from "@/actions/image-galleries-actions";
import { uploadImage, deleteImage as deleteImageFromStorage, validateImageFile } from "@/lib/supabase-storage";
import { isUnsplashUrl } from "@/lib/unsplash-utils";
import { ImageUpload } from "@/components/ui/image-upload";
import { ExternalImageUpload } from "@/components/ui/external-image-upload";
import type { Image, NewImage } from "@/db/schema";

interface ImageGalleryProps {
  organizationId: string;
  organizationType: "agency" | "supplier";
  maxFiles?: number;
  categories?: string[];
}

export function ImageGallery({ organizationId, organizationType, maxFiles = 10, categories = [] }: ImageGalleryProps) {
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

  // Upload new images
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

        return await createImageAction(imageData);
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const successfulImages = uploadedImages.filter(result => result.isSuccess && result.data).map(result => result.data!);

      // Update images state
      setImages(prevImages => [...prevImages, ...successfulImages]);
      setSelectedFiles([]);
      setSuccess(`${successfulImages.length} images uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  // Add external image URL
  const handleAddExternalImage = async (imageUrl: string, altText: string, caption?: string) => {
    setIsUploading(true);
    setError(null);

    try {
      // Create image record in database for external URL
      const imageData: NewImage = {
        organizationId,
        organizationType,
        fileName: `external-${Date.now()}`,
        filePath: imageUrl, // Store the external URL as the path
        fileUrl: imageUrl,
        fileSize: 0, // Unknown size for external images
        mimeType: 'image/jpeg', // Default mime type
        altText,
        caption,
        sortOrder: 0,
      };

      const result = await createImageAction(imageData);
      if (result.isSuccess && result.data) {
        setImages(prevImages => [...prevImages, result.data!]);
        setSuccess("External image added successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to add external image");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add external image");
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
      // Only delete from storage if it's not an external URL (like Unsplash)
      if (!isUnsplashUrl(image.fileUrl)) {
        const storageResult = await deleteImageFromStorage(organizationType, image.filePath);
        if (!storageResult.success) {
          console.warn("Failed to delete from storage:", storageResult.error);
        }
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
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="font-medium text-sm">Add Images</span>
          </div>
          <ExternalImageUpload
            onImageAdd={handleAddExternalImage}
            disabled={isUploading}
            categories={categories}
          />
        </div>
        
        <ImageUpload
          selectedFiles={selectedFiles}
          onFilesChange={setSelectedFiles}
          disabled={isUploading}
          maxFiles={maxFiles}
        />

        {selectedFiles.length > 0 && (
          <Button
            onClick={handleUploadImages}
            disabled={isUploading}
            size="sm"
            className="mt-3"
          >
            {isUploading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            <Plus className="mr-2 h-3 w-3" />
            Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        )}
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-4 w-4" />
            <span className="font-medium text-sm">Images ({images.length})</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image.fileUrl}
                    alt={image.altText || image.fileName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
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
                            className="h-7 w-7 p-0 bg-white text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-3 w-3" />
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
                          className="h-7 w-7 p-0 bg-white text-yellow-600 hover:bg-yellow-50"
                          title="Set as featured image"
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteImage(image)}
                        className="h-7 w-7 p-0 bg-white text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="mt-1 space-y-1">
                  <p className="text-xs font-medium text-gray-900 truncate">
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
                  <div className="absolute top-1 right-1">
                    <div className="bg-yellow-500 text-white text-xs px-1 py-0.5 rounded flex items-center gap-1">
                      <Star className="h-2 w-2" />
                      Featured
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Images Message */}
      {images.length === 0 && (
        <div className="border border-gray-200 rounded-lg p-8 text-center">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No images yet</h3>
          <p className="text-xs text-gray-500">Upload some images to showcase your work</p>
        </div>
      )}
    </div>
  );
}
