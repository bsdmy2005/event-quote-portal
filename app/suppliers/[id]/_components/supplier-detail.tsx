"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Globe, 
  ArrowLeft,
  CheckCircle,
  Award,
  Users,
  Clock,
  Shield
} from "lucide-react"
import { SelectSupplier } from "@/db/schema"
import { SmartImage } from "@/components/ui/smart-image"
import { getCategoriesMap, resolveCategoryNames } from "@/lib/category-utils"
import { getImagesByOrganizationAction } from "@/actions/image-galleries-actions"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import Link from "next/link"

interface SupplierDetailProps {
  supplier: SelectSupplier & { featuredImage?: any }
}

export function SupplierDetail({ supplier }: SupplierDetailProps) {
  const [categoriesMap, setCategoriesMap] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<any[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      // Load categories
      const map = await getCategoriesMap();
      setCategoriesMap(map);
      
      // Load images
      setImagesLoading(true);
      try {
        const imagesResult = await getImagesByOrganizationAction(supplier.id, "supplier");
        if (imagesResult.isSuccess && imagesResult.data) {
          setImages(imagesResult.data);
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      } finally {
        setImagesLoading(false);
      }
    };
    loadData();
  }, [supplier.id]);

  const resolvedCategories = resolveCategoryNames(supplier.serviceCategories || [], categoriesMap);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/suppliers" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative mb-8">
        <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
          <SmartImage
            src={supplier.featuredImage?.fileUrl || supplier.logoUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGOUY0Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEwQjk4MSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMTBCOTgxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPkV2ZW50IFN1cHBsaWVyPC90ZXh0Pgo8L3N2Zz4K'}
            alt={supplier.featuredImage?.altText || `${supplier.name} - Event Supplier`}
            className="w-full h-full object-cover"
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGOUY0Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEwQjk4MSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMTBCOTgxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPkV2ZW50IFN1cHBsaWVyPC90ZXh0Pgo8L3N2Zz4K"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {supplier.name}
                </h1>
                <div className="flex items-center text-white/90 text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  {supplier.location?.city}, {supplier.location?.province}, {supplier.location?.country}
                </div>
              </div>
              <div className="text-right">
                {supplier.isPublished ? (
                  <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Verified Supplier
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Pending Verification
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">About {supplier.name}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {supplier.servicesText}
              </p>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resolvedCategories.map((category, index) => (
                  <div key={`${category}-${index}`} className="flex items-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-foreground font-medium">{category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gallery Section */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Gallery</h2>
              {imagesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      <SmartImage
                        src={image.fileUrl}
                        alt={image.altText || `${supplier.name} - Gallery Image`}
                        className="w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                        fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGOUY0Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEwQjk4MSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMTBCOTgxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPkV2ZW50IFN1cHBsaWVyPC90ZXh0Pgo8L3N2Zz4K"
                      />
                      {image.isFeatured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500 text-white text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                          {image.caption}
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 rounded-full p-2">
                            <Award className="h-6 w-6 text-gray-800" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Award className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Gallery Images</h3>
                  <p className="text-muted-foreground">
                    This supplier hasn't uploaded any gallery images yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Why Choose {supplier.name}?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Quality Service</h3>
                  <p className="text-muted-foreground text-sm">
                    Professional equipment and services for your events
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Expert Team</h3>
                  <p className="text-muted-foreground text-sm">
                    Experienced professionals dedicated to your success
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Reliable Delivery</h3>
                  <p className="text-muted-foreground text-sm">
                    On-time setup and professional service delivery
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card className="border-0 shadow-lg sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Get In Touch</h3>
              <div className="space-y-4">
                {(supplier as any).website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-muted-foreground mr-3" />
                    <a 
                      href={(supplier as any).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Contact this supplier through our platform for quotes and inquiries.
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button className="w-full" size="lg">
                  Request Quote
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Location</h3>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {supplier.location?.city}, {supplier.location?.province}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {supplier.location?.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Verification */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    variant={supplier.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {supplier.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verification</span>
                  <div className="flex items-center">
                    {supplier.isPublished ? (
                      <>
                        <Shield className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-green-600 text-sm font-medium">Verified</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={images}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        initialIndex={lightboxIndex}
      />
    </div>
  )
}
