"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Building2, Users, Tag, TrendingUp, Calendar, MapPin, Mail, Phone, Globe, Search, Filter, Settings, Home, BarChart3, FileText, Shield, Pencil, CheckCircle, XCircle, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { getAllSuppliersAction, getAllAgenciesAction } from "@/actions/organizations-actions";
import { getAllCategoriesAction } from "@/actions/categories-actions";
import { DeleteSupplierButton } from "@/components/ui/delete-buttons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { SelectSupplier } from "@/db/schema";

export default function SuppliersAdminPage() {
  const [suppliers, setSuppliers] = useState<SelectSupplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<SelectSupplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [agenciesCount, setAgenciesCount] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm, statusFilter, locationFilter]);

  const loadAllData = async () => {
    try {
      // Load suppliers
      const suppliersResult = await getAllSuppliersAction();
      if (suppliersResult.isSuccess && suppliersResult.data) {
        setSuppliers(suppliersResult.data);
      }

      // Load agencies count
      const agenciesResult = await getAllAgenciesAction();
      if (agenciesResult.isSuccess && agenciesResult.data) {
        setAgenciesCount(agenciesResult.data.length);
      }

      // Load categories count
      const categoriesResult = await getAllCategoriesAction();
      if (categoriesResult.isSuccess && categoriesResult.data) {
        setCategoriesCount(categoriesResult.data.length);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = [...suppliers];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(term) ||
        supplier.email.toLowerCase().includes(term) ||
        supplier.contactName.toLowerCase().includes(term) ||
        supplier.location?.city.toLowerCase().includes(term) ||
        supplier.location?.province.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "published") {
        filtered = filtered.filter(s => s.isPublished);
      } else if (statusFilter === "unpublished") {
        filtered = filtered.filter(s => !s.isPublished);
      } else if (statusFilter === "active") {
        filtered = filtered.filter(s => s.status === "active");
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter(s => s.status === "inactive");
      }
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(supplier => 
        supplier.location?.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
        supplier.location?.province.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredSuppliers(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        categoriesCount={categoriesCount}
        agenciesCount={agenciesCount}
        suppliersCount={suppliers.length}
        activeSection="suppliers"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Suppliers Management</h2>
              <p className="text-gray-600 text-lg">Manage service suppliers and their profiles</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm">
              <Link href="/admin/suppliers/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Link>
            </Button>
          </div>
        </header>

        {/* Suppliers Content */}
        <main className="flex-1 p-8">
          <SuppliersList 
            suppliers={filteredSuppliers}
            allSuppliers={suppliers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
          />
        </main>
      </div>
    </div>
  );
}

interface SuppliersListProps {
  suppliers: SelectSupplier[];
  allSuppliers: SelectSupplier[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  locationFilter: string;
  setLocationFilter: (filter: string) => void;
}

function SuppliersList({ 
  suppliers, 
  allSuppliers, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  locationFilter, 
  setLocationFilter 
}: SuppliersListProps) {
  if (allSuppliers.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white rounded-xl">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers yet</h3>
            <p className="text-gray-500">Create your first service supplier to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search suppliers by name, email, or location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="unpublished">Unpublished</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="johannesburg">Johannesburg</SelectItem>
              <SelectItem value="cape-town">Cape Town</SelectItem>
              <SelectItem value="durban">Durban</SelectItem>
              <SelectItem value="pretoria">Pretoria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Showing</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
                <p className="text-xs text-gray-400">of {allSuppliers.length} total</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-green-600">{suppliers.filter(s => s.isPublished).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{suppliers.filter(s => !s.isPublished).length}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-blue-600">{suppliers.filter(s => s.status === 'active').length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">All Suppliers</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Publish Selected
              </Button>
              <Button variant="outline" size="sm">
                <EyeOff className="h-4 w-4 mr-2" />
                Unpublish Selected
              </Button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">{supplier.name}</h4>
                      {supplier.isPublished ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">Published</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      )}
                      <Badge 
                        variant={supplier.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs capitalize"
                      >
                        {supplier.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{supplier.contactName} • {supplier.email}</p>
                    {supplier.location && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {supplier.location.city}, {supplier.location.province}, {supplier.location.country}
                      </p>
                    )}
                    {supplier.serviceCategories && supplier.serviceCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {supplier.serviceCategories.slice(0, 3).map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
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
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href={`/suppliers/${supplier.id}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href={`/admin/suppliers/${supplier.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteSupplierButton supplierId={supplier.id} supplierName={supplier.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
