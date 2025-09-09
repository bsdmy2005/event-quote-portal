"use client"

import { useState, useEffect } from "react"
import { getAgenciesAction } from "@/actions/organizations-actions"
import { AgenciesGrid } from "./_components/agencies-grid"
import { AgenciesSkeleton } from "./_components/agencies-skeleton"
import { AgenciesHeader } from "./_components/agencies-header"
import { SelectAgency } from "@/db/schema"

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<SelectAgency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<SelectAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    loadAgencies();
  }, []);

  useEffect(() => {
    filterAgencies();
  }, [agencies, searchTerm, categoryFilter, locationFilter]);

  const loadAgencies = async () => {
    try {
      const result = await getAgenciesAction();
      if (result.isSuccess && result.data) {
        setAgencies(result.data);
      }
    } catch (error) {
      console.error("Error loading agencies:", error);
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
        agency.about?.toLowerCase().includes(term) ||
        agency.location?.city.toLowerCase().includes(term) ||
        agency.location?.province.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(agency => 
        agency.interestCategories?.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()))
      );
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
      <div className="min-h-screen bg-background">
        <AgenciesHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />
        <div className="container mx-auto px-4 py-8">
          <AgenciesSkeleton />
        </div>
      </div>
    );
  }

  if (!agencies.length) {
    return (
      <div className="min-h-screen bg-background">
        <AgenciesHeader 
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
              No agencies found
            </h2>
            <p className="text-muted-foreground">
              We're working on adding more agencies to our platform.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AgenciesHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />
      
      <div className="container mx-auto px-4 py-8">
        <AgenciesGrid agencies={filteredAgencies} />
      </div>
    </div>
  );
}
