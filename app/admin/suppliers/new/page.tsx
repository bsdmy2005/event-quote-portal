import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllCategoriesAction } from "@/actions/categories-actions";
import { getAllAgenciesAction } from "@/actions/organizations-actions";
import { getAllSuppliersAction } from "@/actions/organizations-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { CreateSupplierForm } from "@/components/forms/create-supplier-form";
import { AdminSidebar } from "@/components/ui/admin-sidebar";

export default async function NewSupplierPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is admin - TODO: implement proper profile check
  // For now, just check if we can access admin actions
  const profile = await getAllCategoriesAction();
  if (!profile.isSuccess) {
    redirect("/admin");
  }

  // Get categories for the form
  const categoriesResult = await getAllCategoriesAction();
  console.log("Categories result:", categoriesResult); // Debug log
  
  let categories: Array<{ id: string; name: string }> = [];
  if (categoriesResult.isSuccess && categoriesResult.data) {
    categories = categoriesResult.data as Array<{ id: string; name: string }>;
  } else {
    console.log("No categories found or error:", categoriesResult.message);
  }

  // Get counts for sidebar
  const agenciesResult = await getAllAgenciesAction();
  const suppliersResult = await getAllSuppliersAction();

  const categoriesCount = categoriesResult.isSuccess ? categoriesResult.data || [] : [];
  const agenciesCount = agenciesResult.isSuccess ? agenciesResult.data || [] : [];
  const suppliersCount = suppliersResult.isSuccess ? suppliersResult.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        categoriesCount={categoriesCount.length}
        agenciesCount={agenciesCount.length}
        suppliersCount={suppliersCount.length}
        activeSection="suppliers"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <Link href="/admin/suppliers">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Suppliers
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Supplier</h2>
                  <p className="text-gray-600">Add a new service supplier to the platform</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Create Content */}
        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-gray-900">Supplier Details</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the supplier information and service details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateSupplierForm categories={categories} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
