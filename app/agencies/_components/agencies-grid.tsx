"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Globe, ArrowRight } from "lucide-react"
import { SelectAgency } from "@/db/schema"
import { SmartImage } from "@/components/ui/smart-image"
import { getCategoriesMap, resolveCategoryNames } from "@/lib/category-utils"
import Link from "next/link"

interface AgencyWithImage {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  location?: {
    city: string;
    province: string;
    country: string;
  } | null;
  interestCategories?: string[] | null;
  about?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: {
    id: string;
    fileUrl: string;
    altText?: string | null;
  } | null;
}

interface AgenciesGridProps {
  agencies: AgencyWithImage[]
}

export function AgenciesGrid({ agencies }: AgenciesGridProps) {
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
      {agencies.map((agency) => {
        const resolvedCategories = resolveCategoryNames(agency.interestCategories || [], categoriesMap);
        
        return (
        <Card key={agency.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <SmartImage
              src={agency.featuredImage?.fileUrl || agency.logoUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2NS4zNzMgMTAwIDEzNy41IDEyNy44NzMgMTM3LjUgMTYyLjVWMTM3LjVDMTM3LjUgMTcyLjEyNyAxNjUuMzczIDIwMCAyMDAgMjAwQzIzNC42MjcgMjAwIDI2Mi41IDE3Mi4xMjcgMjYyLjUgMTM3LjVWMTYyLjVDMjYyLjUgMTI3Ljg3MyAyMzQuNjI3IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzYzNjY2QSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjIuNSIgcj0iMjUiIGZpbGw9IiM2MzY2NkEiLz4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2MzY2NkEiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+RXZlbnQgQWdlbmN5PC90ZXh0Pgo8L3N2Zz4K'}
              alt={agency.featuredImage?.altText || `${agency.name} - Event Agency`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2NS4zNzMgMTAwIDEzNy41IDEyNy44NzMgMTM3LjUgMTYyLjVWMTM3LjVDMTM3LjUgMTcyLjEyNyAxNjUuMzczIDIwMCAyMDAgMjAwQzIzNC42MjcgMjAwIDI2Mi41IDE3Mi4xMjcgMjYyLjUgMTM3LjVWMTYyLjVDMjYyLjUgMTI3Ljg3MyAyMzQuNjI3IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzYzNjY2QSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjIuNSIgcj0iMjUiIGZpbGw9IiM2MzY2NkEiLz4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2MzY2NkEiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+RXZlbnQgQWdlbmN5PC90ZXh0Pgo8L3N2Zz4K"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-xl mb-1">
                {agency.name}
              </h3>
              <div className="flex items-center text-white/90 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {agency.location?.city}, {agency.location?.province}
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {agency.about}
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
                  {agency.website && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={agency.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                
                <Button asChild className="group/btn">
                  <Link href={`/agencies/${agency.id}`}>
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
