"use client"

import { Search, Filter, MapPin, Wrench, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SuppliersHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  locationFilter: string;
  setLocationFilter: (filter: string) => void;
}

export function SuppliersHeader({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  locationFilter, 
  setLocationFilter 
}: SuppliersHeaderProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Event Suppliers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with South Africa's top event suppliers. From audio visual equipment 
            to catering services, find everything you need for your next corporate event.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search suppliers by name, service, or location..."
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="audio visual">Audio Visual</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
                <SelectItem value="venues">Venues</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="decor">Decor</SelectItem>
                <SelectItem value="lighting">Lighting</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-48 h-12">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="johannesburg">Johannesburg</SelectItem>
                <SelectItem value="cape town">Cape Town</SelectItem>
                <SelectItem value="durban">Durban</SelectItem>
                <SelectItem value="pretoria">Pretoria</SelectItem>
                <SelectItem value="port elizabeth">Port Elizabeth</SelectItem>
                <SelectItem value="bloemfontein">Bloemfontein</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge 
              variant={locationFilter === "johannesburg" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setLocationFilter(locationFilter === "johannesburg" ? "all" : "johannesburg")}
            >
              <MapPin className="mr-1 h-3 w-3" />
              Johannesburg
            </Badge>
            <Badge 
              variant={locationFilter === "cape town" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setLocationFilter(locationFilter === "cape town" ? "all" : "cape town")}
            >
              <MapPin className="mr-1 h-3 w-3" />
              Cape Town
            </Badge>
            <Badge 
              variant={locationFilter === "durban" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setLocationFilter(locationFilter === "durban" ? "all" : "durban")}
            >
              <MapPin className="mr-1 h-3 w-3" />
              Durban
            </Badge>
            <Badge 
              variant={categoryFilter === "audio visual" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setCategoryFilter(categoryFilter === "audio visual" ? "all" : "audio visual")}
            >
              <Wrench className="mr-1 h-3 w-3" />
              Audio Visual
            </Badge>
            <Badge 
              variant={categoryFilter === "catering" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setCategoryFilter(categoryFilter === "catering" ? "all" : "catering")}
            >
              <Wrench className="mr-1 h-3 w-3" />
              Catering
            </Badge>
            <Badge 
              variant={categoryFilter === "venues" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setCategoryFilter(categoryFilter === "venues" ? "all" : "venues")}
            >
              <Wrench className="mr-1 h-3 w-3" />
              Venues
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
