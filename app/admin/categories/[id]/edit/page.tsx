import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllCategoriesAction, getCategoryByIdAction } from "@/actions/categories-actions";
import { getAllAgenciesAction } from "@/actions/organizations-actions";
import { getAllSuppliersAction } from "@/actions/organizations-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { EditCategoryForm } from "@/components/forms/edit-category-form";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get the category data
  const categoryResult = await getCategoryByIdAction(params.id);
  if (!categoryResult.isSuccess || !categoryResult.data) {
    notFound();
  }

  const category = categoryResult.data;

  // Get categories for the form
  const categoriesResult = await getAllCategoriesAction();
  let categories: Array<{ id: string; name: string }> = [];
  if (categoriesResult.isSuccess && categoriesResult.data) {
    categories = categoriesResult.data as Array<{ id: string; name: string }>;
  }

  // Get counts for sidebar
  const agenciesResult = await getAllAgenciesAction();
  const suppliersResult = await getAllSuppliersAction();

  const categoriesCount = categoriesResult.isSuccess ? categoriesResult.data || [] : [];
  const agenciesCount = agenciesResult.isSuccess ? agenciesResult.data || [] : [];
  const suppliersCount = suppliersResult.isSuccess ? suppliersResult.data || [] : [];

  return (
    <div className="min-h-screen bg-slate-100 flex">
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
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
                <Link href="/admin/categories">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Link>
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Edit Category</h2>
                  <p className="text-slate-600">Update category information</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Edit Content */}
        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-slate-900">Category Details</CardTitle>
                <CardDescription className="text-slate-600">
                  Update the category information and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditCategoryForm category={category} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
