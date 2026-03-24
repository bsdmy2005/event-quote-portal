"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Building2, MapPin, Phone, Mail, Check, Star, Zap } from "lucide-react"
import { getAllSuppliersAction } from "@/actions/organizations-actions"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

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

interface RfqInfo {
  requiredServices?: string[] | null
}

interface SupplierSelectionFormProps {
  selectedSuppliers: string[]
  onSelectionChange: (supplierIds: string[]) => void
  rfq?: RfqInfo
  className?: string
}

function getMatchCount(supplier: Supplier, requiredServices: string[]): number {
  if (!supplier.serviceCategories || requiredServices.length === 0) return 0
  return supplier.serviceCategories.filter(cat =>
    requiredServices.some(req => req.toLowerCase() === cat.toLowerCase())
  ).length
}

function getMatchingCategories(supplier: Supplier, requiredServices: string[]): string[] {
  if (!supplier.serviceCategories || requiredServices.length === 0) return []
  return supplier.serviceCategories.filter(cat =>
    requiredServices.some(req => req.toLowerCase() === cat.toLowerCase())
  )
}

export function SupplierSelectionForm({
  selectedSuppliers,
  onSelectionChange,
  rfq,
  className
}: SupplierSelectionFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const hasAutoSelected = useRef(false)

  const requiredServices = useMemo(
    () => rfq?.requiredServices ?? [],
    [rfq?.requiredServices]
  )

  const requiredServicesLower = useMemo(
    () => requiredServices.map(s => s.toLowerCase()),
    [requiredServices]
  )

  useEffect(() => {
    loadSuppliers()
  }, [])

  useEffect(() => {
    filterSuppliers()
  }, [suppliers, searchTerm, selectedCategory])

  // Auto-pre-select matching suppliers on first load
  useEffect(() => {
    if (
      hasAutoSelected.current ||
      suppliers.length === 0 ||
      requiredServices.length === 0
    ) {
      return
    }
    hasAutoSelected.current = true
    const matchingIds = suppliers
      .filter(s => getMatchCount(s, requiredServices) > 0)
      .map(s => s.id)
    if (matchingIds.length > 0) {
      onSelectionChange(matchingIds)
    }
  }, [suppliers, requiredServices])

  const loadSuppliers = async () => {
    try {
      const result = await getAllSuppliersAction()
      if (notifyActionResult(result, { errorMessage: "Failed to load suppliers", silentSuccess: true }) && result.data) {
        const supplierData = result.data as Supplier[]
        setSuppliers(supplierData)

        // Extract unique categories
        const allCategories = supplierData
          .flatMap(supplier => supplier.serviceCategories || [])
          .filter((category, index, self) => self.indexOf(category) === index)
        setCategories(allCategories)
      }
    } catch (error) {
      console.error("Error loading suppliers:", error)
      notifyUnexpectedError("load suppliers")
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

    // Sort by relevance: most matching categories first
    if (requiredServices.length > 0) {
      filtered = [...filtered].sort((a, b) => {
        const matchA = getMatchCount(a, requiredServices)
        const matchB = getMatchCount(b, requiredServices)
        return matchB - matchA
      })
    }

    setFilteredSuppliers(filtered)
  }

  const matchingSupplierCount = useMemo(() => {
    if (requiredServices.length === 0) return 0
    return suppliers.filter(s => getMatchCount(s, requiredServices) > 0).length
  }, [suppliers, requiredServices])

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

  const handleSelectAllMatching = () => {
    const matchingIds = suppliers
      .filter(s => getMatchCount(s, requiredServices) > 0)
      .map(s => s.id)
    onSelectionChange(matchingIds)
  }

  const isRequiredCategory = (category: string) => {
    return requiredServicesLower.includes(category.toLowerCase())
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
        {/* Matching Summary */}
        {requiredServices.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {matchingSupplierCount} supplier{matchingSupplierCount !== 1 ? "s" : ""} match your required services
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={handleSelectAllMatching}
            >
              <Zap className="h-3 w-3 mr-1" />
              Select All Matching
            </Button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Suppliers</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
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
                  className={
                    isRequiredCategory(category) && selectedCategory !== category
                      ? "border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : ""
                  }
                >
                  {category}
                  {isRequiredCategory(category) && (
                    <Star className="h-3 w-3 ml-1 fill-current" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
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
            <div className="text-center py-8 text-slate-600">
              No suppliers found matching your criteria
            </div>
          ) : (
            filteredSuppliers.map(supplier => {
              const matchCount = getMatchCount(supplier, requiredServices)
              const isMatch = matchCount > 0
              const matchingCats = getMatchingCategories(supplier, requiredServices)

              return (
                <div
                  key={supplier.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSuppliers.includes(supplier.id)
                      ? 'border-blue-500 bg-blue-50'
                      : isMatch
                        ? 'border-l-4 border-l-blue-400 border-slate-200 hover:border-slate-300 bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300'
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
                        <Building2 className="h-4 w-4 text-slate-600" />
                        <h3 className="font-medium text-slate-900">{supplier.name}</h3>
                        {selectedSuppliers.includes(supplier.id) && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                        {isMatch && requiredServices.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
                          >
                            {matchCount}/{requiredServices.length} match
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 mt-1">
                        Contact: {supplier.contactName}
                      </p>

                      {supplier.location && (
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          <span className="text-xs text-slate-600">
                            {supplier.location.city}, {supplier.location.province}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-slate-500" />
                          <span className="text-xs text-slate-600">{supplier.email}</span>
                        </div>
                        {supplier.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-slate-500" />
                            <span className="text-xs text-slate-600">{supplier.phone}</span>
                          </div>
                        )}
                      </div>

                      {supplier.serviceCategories && supplier.serviceCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {supplier.serviceCategories.slice(0, 5).map(category => {
                            const isCatMatch = matchingCats.some(
                              mc => mc.toLowerCase() === category.toLowerCase()
                            )
                            return (
                              <Badge
                                key={category}
                                variant="secondary"
                                className={`text-xs ${
                                  isCatMatch
                                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                                    : ""
                                }`}
                              >
                                {category}
                                {isCatMatch && <Star className="h-2.5 w-2.5 ml-0.5 fill-current" />}
                              </Badge>
                            )
                          })}
                          {supplier.serviceCategories.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{supplier.serviceCategories.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
