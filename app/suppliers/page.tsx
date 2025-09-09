"use client"

import { useState, useEffect } from "react"
import { getSuppliersAction } from "@/actions/organizations-actions"
import { SuppliersGrid } from "./_components/suppliers-grid"
import { SuppliersSkeleton } from "./_components/suppliers-skeleton"
import { SuppliersHeader } from "./_components/suppliers-header"
import { SelectSupplier } from "@/db/schema"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SelectSupplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<SelectSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm, categoryFilter, locationFilter]);

  const loadSuppliers = async () => {
    try {
      const result = await getSuppliersAction();
      if (result.isSuccess && result.data) {
        setSuppliers(result.data);
      }
    } catch (error) {
      console.error("Error loading suppliers:", error);
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
        supplier.description?.toLowerCase().includes(term) ||
        supplier.location?.city.toLowerCase().includes(term) ||
        supplier.location?.province.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(supplier => 
        supplier.categories?.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()))
      );
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
      <div className="min-h-screen bg-background">
        <SuppliersHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />
        <div className="container mx-auto px-4 py-8">
          <SuppliersSkeleton />
        </div>
      </div>
    );
  }

  if (!suppliers.length) {
    return (
      <div className="min-h-screen bg-background">
        <SuppliersHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              No suppliers found
            </h2>
            <p className="text-muted-foreground">
              We're working on adding more suppliers to our platform.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SuppliersHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />
      
      <div className="container mx-auto px-4 py-8">
        <SuppliersGrid suppliers={filteredSuppliers} />
      </div>
    </div>
  );
}
