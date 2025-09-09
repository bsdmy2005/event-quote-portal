"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Globe, ArrowRight, CheckCircle } from "lucide-react"
import { SelectSupplier } from "@/db/schema"
import { SmartImage } from "@/components/ui/smart-image"
import { getCategoriesMap, resolveCategoryNames } from "@/lib/category-utils"
import Link from "next/link"

interface SupplierWithImage {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone?: string | null;
  logoUrl?: string | null;
  brochureUrl?: string | null;
  idImageUrl?: string | null;
  location?: {
    city: string;
    province: string;
    country: string;
  } | null;
  serviceCategories?: string[] | null;
  servicesText?: string | null;
  isPublished: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: {
    id: string;
    fileUrl: string;
    altText?: string | null;
  } | null;
}

interface SuppliersGridProps {
  suppliers: SupplierWithImage[]
}

export function SuppliersGrid({ suppliers }: SuppliersGridProps) {
  const [categoriesMap, setCategoriesMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadCategories = async () => {
      const map = await getCategoriesMap();
      setCategoriesMap(map);
    };
    loadCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {suppliers.map((supplier) => {
        const resolvedCategories = resolveCategoryNames(supplier.serviceCategories, categoriesMap);
        
        return (
        <Card key={supplier.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <SmartImage
              src={supplier.featuredImage?.fileUrl || supplier.logoUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGOUY0Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEwQjk4MSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMTBCOTgxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPkV2ZW50IFN1cHBsaWVyPC90ZXh0Pgo8L3N2Zz4K'}
              alt={supplier.featuredImage?.altText || `${supplier.name} - Event Supplier`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGOUY0Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEwQjk4MSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMTBCOTgxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPkV2ZW50IFN1cHBsaWVyPC90ZXh0Pgo8L3N2Zz4K"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {supplier.isPublished ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Pending
                </Badge>
              )}
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-xl mb-1">
                {supplier.name}
              </h3>
              <div className="flex items-center text-white/90 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {supplier.location?.city}, {supplier.location?.province}
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {supplier.servicesText}
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm">Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {resolvedCategories.slice(0, 3).map((category, index) => (
                    <Badge key={`${category}-${index}`} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {resolvedCategories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{resolvedCategories.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex space-x-3">
                  {supplier.website && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                
                <Button asChild className="group/btn">
                  <Link href={`/suppliers/${supplier.id}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  )
}
