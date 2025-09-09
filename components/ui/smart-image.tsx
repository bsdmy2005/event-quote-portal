"use client"

import { useState } from "react"
import { isUnsplashUrl } from "@/lib/unsplash-utils"
import { cn } from "@/lib/utils"

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  width?: number
  height?: number
  priority?: boolean
}

export function SmartImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "/placeholder.jpg",
  width,
  height,
  priority = false
}: SmartImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
      setHasError(true)
    }
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Optimize Unsplash URLs for better performance
  const getOptimizedSrc = (url: string) => {
    if (isUnsplashUrl(url)) {
      // Add optimization parameters to Unsplash URLs
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}w=${width || 800}&h=${height || 600}&fit=crop&crop=center&q=80&fm=webp`
    }
    return url
  }

  const optimizedSrc = getOptimizedSrc(imageSrc)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  )
}
