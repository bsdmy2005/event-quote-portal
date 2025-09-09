"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Link, 
  Plus,
  ExternalLink,
  ImageIcon
} from "lucide-react";
import { generateUnsplashUrl, getUnsplashImageForCategory, generateGalleryImages } from "@/lib/unsplash-utils";

interface ExternalImageUploadProps {
  onImageAdd: (imageUrl: string, altText: string, caption?: string) => void;
  disabled?: boolean;
  categories?: string[];
}

export function ExternalImageUpload({ 
  onImageAdd, 
  disabled = false,
  categories = []
}: ExternalImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddImage = () => {
    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }

    if (!altText.trim()) {
      setError("Please enter alt text for accessibility");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    onImageAdd(imageUrl, altText, caption);
    setImageUrl("");
    setAltText("");
    setCaption("");
    setError(null);
    setIsOpen(false);
  };

  const handleUnsplashSuggestion = (category: string) => {
    const suggestedUrl = getUnsplashImageForCategory(category);
    setImageUrl(suggestedUrl);
    setAltText(`${category} - Professional event service`);
  };

  const handleGallerySuggestion = (category: string) => {
    const galleryImages = generateGalleryImages(category, 1);
    if (galleryImages.length > 0) {
      setImageUrl(galleryImages[0]);
      setAltText(`${category} - Event gallery image`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Add External Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Add External Image
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Unsplash Suggestions */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Suggestions</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 4).map((category) => (
                  <div key={category} className="space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsplashSuggestion(category)}
                      className="w-full text-xs"
                    >
                      {category}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGallerySuggestion(category)}
                      className="w-full text-xs"
                    >
                      Gallery
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="alt-text">Alt Text *</Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Optional caption for the image"
                className="mt-1"
              />
            </div>
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setError(null);
                setImageUrl("");
                setAltText("");
                setCaption("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddImage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
