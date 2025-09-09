"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Star
} from "lucide-react"
import { SmartImage } from "@/components/ui/smart-image"

interface ImageLightboxProps {
  images: Array<{
    id: string;
    fileUrl: string;
    fileName?: string;
    altText?: string;
    caption?: string;
    isFeatured?: boolean;
  }>;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function ImageLightbox({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log('🖼️ ImageLightbox render:', {
    isOpen,
    imagesLength: images?.length,
    currentIndex,
    initialIndex,
    images: images?.map(img => ({ id: img.id, fileUrl: img.fileUrl?.substring(0, 50) + '...' }))
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Modal opened, resetting state:', { initialIndex });
      setCurrentIndex(initialIndex);
      setIsLoading(false);
    }
  }, [isOpen, initialIndex]);

  // Track currentIndex changes
  useEffect(() => {
    console.log('📊 currentIndex changed:', { 
      currentIndex, 
      totalImages: images.length,
      currentImage: images[currentIndex] ? { id: images[currentIndex].id } : null
    });
  }, [currentIndex, images]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    console.log('⬅️ goToPrevious called:', { currentIndex, imagesLength: images.length });
    if (images.length <= 1) {
      console.log('❌ Only one image, cannot navigate');
      return;
    }
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    console.log('⬅️ Setting new index:', newIndex);
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    console.log('➡️ goToNext called:', { currentIndex, imagesLength: images.length });
    if (images.length <= 1) {
      console.log('❌ Only one image, cannot navigate');
      return;
    }
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    console.log('➡️ Setting new index:', newIndex);
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToImage = useCallback((index: number) => {
    console.log('🎯 goToImage called:', { from: currentIndex, to: index });
    setCurrentIndex(index);
  }, [currentIndex]);


  // Download function
  const handleDownload = useCallback(() => {
    const currentImage = images[currentIndex];
    if (currentImage?.fileUrl) {
      const link = document.createElement('a');
      link.href = currentImage.fileUrl;
      link.download = currentImage.fileName || `image-${currentIndex + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [images, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen || images.length === 0) {
    console.log('❌ Lightbox not rendering:', { isOpen, imagesLength: images?.length });
    return null;
  }

  const currentImage = images[currentIndex];
  console.log('🖼️ Current image:', { 
    currentIndex, 
    currentImage: currentImage ? { 
      id: currentImage.id, 
      fileUrl: currentImage.fileUrl,
      fileName: currentImage.fileName,
      altText: currentImage.altText
    } : null,
    allImages: images.map((img, idx) => ({
      index: idx,
      id: img.id,
      fileUrl: img.fileUrl,
      fileName: img.fileName
    }))
  });
  
  if (!currentImage) {
    console.log('❌ No current image found at index:', currentIndex);
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[85vh] p-0 bg-black border-0 overflow-hidden">
        <DialogTitle className="sr-only">Image Gallery</DialogTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                {currentIndex + 1} of {images.length}
              </span>
              {currentImage.isFeatured && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 relative bg-gray-800 flex items-center justify-center overflow-hidden min-h-0">
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    console.log('🖱️ Previous button clicked');
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20 bg-black/50 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    console.log('🖱️ Next button clicked');
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20 bg-black/50 backdrop-blur-sm"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image Container - Fixed Size Window */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <div 
                className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg"
                style={{
                  width: '80vw',
                  height: '60vh',
                  maxWidth: '1200px',
                  maxHeight: '800px'
                }}
              >
                <SmartImage
                  key={`main-image-${currentImage.id}-${currentIndex}`}
                  src={currentImage.fileUrl}
                  alt={currentImage.altText || `Gallery image ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                  style={{
                    imageRendering: 'high-quality'
                  }}
                onLoad={() => {
                  console.log('✅ Image loaded:', currentImage.id);
                  setIsLoading(false);
                }}
                onLoadStart={() => {
                  console.log('⏳ Image loading started:', currentImage.id);
                  setIsLoading(true);
                }}
                fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2NS4zNzMgMTAwIDEzNy41IDEyNy44NzMgMTM3LjUgMTYyLjVWMTM3LjVDMTM3LjUgMTcyLjEyNyAxNjUuMzczIDIwMCAyMDAgMjAwQzIzNC42MjcgMjAwIDI2Mi41IDE3Mi4xMjcgMjYyLjUgMTM3LjVWMTYyLjVDMjYyLjUgMTI3Ljg3MyAyMzQuNjI3IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzYzNjY2QSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjIuNSIgcj0iMjUiIGZpbGw9IiM2MzY2NkEiLz4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2MzY2NkEiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+RXZlbnQgQWdlbmN5PC90ZXh0Pgo8L3N2Zz4K"
                />
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                <div className="text-white text-sm">Loading...</div>
              </div>
            )}
          </div>

          {/* Caption */}
          {(currentImage.caption || currentImage.altText) && (
            <div className="px-4 py-2 bg-gray-900 text-white border-t border-gray-700 flex-shrink-0">
              <p className="text-sm text-center text-gray-300">
                {currentImage.caption || currentImage.altText}
              </p>
            </div>
          )}

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="p-2 bg-gray-900 border-t border-gray-700 flex-shrink-0">
              <div className="flex space-x-1 overflow-x-auto justify-center">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      console.log('🖱️ Thumbnail clicked:', { index, imageId: image.id });
                      goToImage(index);
                    }}
                    className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex 
                        ? 'border-white shadow-lg ring-1 ring-white/50' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <SmartImage
                      src={image.fileUrl}
                      alt={image.altText || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxNUMxOS4wMjkgMTUgMTUgMTkuMDI5IDE1IDI0VjI3QzE1IDMxLjk3MSAxOS4wMjkgMzYgMjQgMzZDMjguOTcxIDM2IDMzIDMxLjk3MSAzMyAyN1YyNEMzMyAxOS4wMjkgMjguOTcxIDE1IDI0IDE1WiIgZmlsbD0iIzYzNjY2QSIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIzIiBmaWxsPSIjNjM2NjZAIi8+Cjwvc3ZnPgo="
                    />
                    {image.isFeatured && (
                      <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}