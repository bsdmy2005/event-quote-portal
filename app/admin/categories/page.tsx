import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Building2, Users, Tag, TrendingUp, Calendar, MapPin, Mail, Phone, Globe, Search, Filter, Settings, Home, BarChart3, FileText, Shield, Pencil } from "lucide-react";
import Link from "next/link";
import { getAllCategoriesAction } from "@/actions/categories-actions";
import { getAllAgenciesAction } from "@/actions/organizations-actions";
import { getAllSuppliersAction } from "@/actions/organizations-actions";
import { DeleteCategoryButton, DeleteAgencyButton, DeleteSupplierButton } from "@/components/ui/delete-buttons";
import { AdminSidebar } from "@/components/ui/admin-sidebar";

export default async function CategoriesAdminPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const profile = await db.query.profilesTable.findFirst({
    where: (profiles, { eq }) => eq(profiles.userId, userId),
  });

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Get counts using actions
  const categoriesResult = await getAllCategoriesAction();
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
        activeSection="categories"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Categories Management</h2>
              <p className="text-gray-600 text-lg">Manage service categories for suppliers and agencies</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm">
              <Link href="/admin/categories/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </Button>
          </div>
        </header>

        {/* Categories Content */}
        <main className="flex-1 p-8">
          <CategoriesList />
        </main>
      </div>
    </div>
  );
}

async function CategoriesList() {
  const result = await getAllCategoriesAction();
  const categories = result.isSuccess ? result.data || [] : [];

  if (categories.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white rounded-xl">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500">Create your first service category to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">All Categories</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {categories.map((category) => (
          <div key={category.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-500">Created {new Date(category.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
