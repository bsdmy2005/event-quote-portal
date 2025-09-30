"use client"

import { Search, Filter, MapPin, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgenciesHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  locationFilter: string;
  setLocationFilter: (filter: string) => void;
}

export function AgenciesHeader({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  locationFilter, 
  setLocationFilter 
}: AgenciesHeaderProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Event Agencies
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover South Africa&apos;s leading corporate event agencies. 
            From brand activations to product launches, find the perfect partner for your next event.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search agencies by name, location, or services..."
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
                <SelectItem value="brand activation">Brand Activation</SelectItem>
                <SelectItem value="product launch">Product Launch</SelectItem>
                <SelectItem value="conference management">Conference Management</SelectItem>
                <SelectItem value="corporate events">Corporate Events</SelectItem>
                <SelectItem value="exhibition">Exhibition</SelectItem>
                <SelectItem value="trade shows">Trade Shows</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
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
              variant={categoryFilter === "brand activation" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setCategoryFilter(categoryFilter === "brand activation" ? "all" : "brand activation")}
            >
              <Users className="mr-1 h-3 w-3" />
              Brand Activation
            </Badge>
            <Badge 
              variant={categoryFilter === "product launch" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setCategoryFilter(categoryFilter === "product launch" ? "all" : "product launch")}
            >
              <Users className="mr-1 h-3 w-3" />
              Product Launch
            </Badge>
            <Badge 
              variant={categoryFilter === "conference management" ? "default" : "secondary"} 
              className="px-4 py-2 cursor-pointer hover:bg-primary/10"
              onClick={() => setCategoryFilter(categoryFilter === "conference management" ? "all" : "conference management")}
            >
              <Users className="mr-1 h-3 w-3" />
              Conference Management
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
