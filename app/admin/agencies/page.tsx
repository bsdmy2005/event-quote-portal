"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Building2, Users, Tag, TrendingUp, Calendar, MapPin, Mail, Phone, Globe, Search, Filter, Settings, Home, BarChart3, FileText, Shield, Pencil, Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { getAllAgenciesAction, getAllSuppliersAction } from "@/actions/organizations-actions";
import { getAllCategoriesAction } from "@/actions/categories-actions";
import { DeleteAgencyButton } from "@/components/ui/delete-buttons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { SelectAgency } from "@/db/schema";

export default function AgenciesAdminPage() {
  const [agencies, setAgencies] = useState<SelectAgency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<SelectAgency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [suppliersCount, setSuppliersCount] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterAgencies();
  }, [agencies, searchTerm, statusFilter, locationFilter]);

  const loadAllData = async () => {
    try {
      // Load agencies
      const agenciesResult = await getAllAgenciesAction();
      if (agenciesResult.isSuccess && agenciesResult.data) {
        setAgencies(agenciesResult.data);
      }

      // Load suppliers count
      const suppliersResult = await getAllSuppliersAction();
      if (suppliersResult.isSuccess && suppliersResult.data) {
        setSuppliersCount(suppliersResult.data.length);
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

  const filterAgencies = () => {
    let filtered = [...agencies];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(agency => 
        agency.name.toLowerCase().includes(term) ||
        agency.email.toLowerCase().includes(term) ||
        agency.contactName.toLowerCase().includes(term) ||
        agency.location?.city.toLowerCase().includes(term) ||
        agency.location?.province.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter(a => a.status === "active");
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter(a => a.status === "inactive");
      }
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(agency => 
        agency.location?.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
        agency.location?.province.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredAgencies(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        categoriesCount={categoriesCount}
        agenciesCount={agencies.length}
        suppliersCount={suppliersCount}
        activeSection="agencies"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Agencies Management</h2>
              <p className="text-gray-600 text-lg">Manage event agencies and their profiles</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm">
              <Link href="/admin/agencies/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Agency
              </Link>
            </Button>
          </div>
        </header>

        {/* Agencies Content */}
        <main className="flex-1 p-8">
          <AgenciesList 
            agencies={filteredAgencies}
            allAgencies={agencies}
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

interface AgenciesListProps {
  agencies: SelectAgency[];
  allAgencies: SelectAgency[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  locationFilter: string;
  setLocationFilter: (filter: string) => void;
}

function AgenciesList({ 
  agencies, 
  allAgencies, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  locationFilter, 
  setLocationFilter 
}: AgenciesListProps) {
  if (allAgencies.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white rounded-xl">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agencies yet</h3>
            <p className="text-gray-500">Create your first event agency to get started</p>
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
              placeholder="Search agencies by name, email, or location..."
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
              <SelectItem value="all">All Agencies</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Showing</p>
                <p className="text-2xl font-bold text-gray-900">{agencies.length}</p>
                <p className="text-xs text-gray-400">of {allAgencies.length} total</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{agencies.filter(a => a.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-orange-600">{agencies.filter(a => a.status === 'inactive').length}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agencies Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">All Agencies</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Selected
              </Button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {agencies.map((agency) => (
            <div key={agency.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">{agency.name}</h4>
                      <Badge 
                        variant={agency.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs capitalize"
                      >
                        {agency.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{agency.contactName} • {agency.email}</p>
                    {agency.location && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {agency.location.city}, {agency.location.province}, {agency.location.country}
                      </p>
                    )}
                    {agency.interestCategories && agency.interestCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {agency.interestCategories.slice(0, 3).map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {agency.interestCategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{agency.interestCategories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href={`/agencies/${agency.id}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href={`/admin/agencies/${agency.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteAgencyButton agencyId={agency.id} agencyName={agency.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
