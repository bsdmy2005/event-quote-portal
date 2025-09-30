"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Building2, MapPin, Phone, Mail, Check } from "lucide-react"
import { getAllSuppliersAction } from "@/actions/organizations-actions"
import { toast } from "sonner"

interface Supplier {
  id: string
  name: string
  contactName: string
  email: string
  phone?: string
  location?: {
    city: string
    province: string
    country: string
  }
  serviceCategories?: string[]
  servicesText?: string
}

interface SupplierSelectionFormProps {
  selectedSuppliers: string[]
  onSelectionChange: (supplierIds: string[]) => void
  className?: string
}

export function SupplierSelectionForm({ 
  selectedSuppliers, 
  onSelectionChange, 
  className 
}: SupplierSelectionFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    loadSuppliers()
  }, [])

  useEffect(() => {
    filterSuppliers()
  }, [suppliers, searchTerm, selectedCategory])

  const loadSuppliers = async () => {
    try {
      const result = await getAllSuppliersAction()
      if (result.isSuccess && result.data) {
        const supplierData = result.data as Supplier[]
        setSuppliers(supplierData)
        
        // Extract unique categories
        const allCategories = supplierData
          .flatMap(supplier => supplier.serviceCategories || [])
          .filter((category, index, self) => self.indexOf(category) === index)
        setCategories(allCategories)
      } else {
        toast.error("Failed to load suppliers")
      }
    } catch (error) {
      console.error("Error loading suppliers:", error)
      toast.error("Failed to load suppliers")
    } finally {
      setIsLoading(false)
    }
  }

  const filterSuppliers = () => {
    let filtered = suppliers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.servicesText && supplier.servicesText.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(supplier =>
        supplier.serviceCategories?.includes(selectedCategory)
      )
    }

    setFilteredSuppliers(filtered)
  }

  const handleSupplierToggle = (supplierId: string) => {
    const newSelection = selectedSuppliers.includes(supplierId)
      ? selectedSuppliers.filter(id => id !== supplierId)
      : [...selectedSuppliers, supplierId]
    
    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedSuppliers.length === filteredSuppliers.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredSuppliers.map(s => s.id))
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">Loading suppliers...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Select Suppliers</CardTitle>
        <CardDescription>
          Choose which suppliers to invite to this RFQ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Suppliers</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name, contact, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Filter by Category</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedSuppliers.length} supplier{selectedSuppliers.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedSuppliers.length === filteredSuppliers.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Supplier List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No suppliers found matching your criteria
            </div>
          ) : (
            filteredSuppliers.map(supplier => (
              <div
                key={supplier.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedSuppliers.includes(supplier.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSupplierToggle(supplier.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedSuppliers.includes(supplier.id)}
                    onChange={() => handleSupplierToggle(supplier.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                      {selectedSuppliers.includes(supplier.id) && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      Contact: {supplier.contactName}
                    </p>
                    
                    {supplier.location && (
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {supplier.location.city}, {supplier.location.province}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{supplier.email}</span>
                      </div>
                      {supplier.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{supplier.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {supplier.serviceCategories && supplier.serviceCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {supplier.serviceCategories.slice(0, 3).map(category => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {supplier.serviceCategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{supplier.serviceCategories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
