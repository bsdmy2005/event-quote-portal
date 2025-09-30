import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, Tag, Search, Filter, BarChart3, Pencil } from "lucide-react";
import Link from "next/link";
import { getAllCategoriesAction } from "@/actions/categories-actions";
import { getAllAgenciesAction } from "@/actions/organizations-actions";
import { getAllSuppliersAction } from "@/actions/organizations-actions";
import { AdminSidebar } from "@/components/ui/admin-sidebar";

export default async function AdminPage() {
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
        activeSection="dashboard"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600 text-lg">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Categories</p>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{categoriesCount.length}</p>
                    <p className="text-sm text-gray-500">Service categories</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                    <Tag className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Agencies</p>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{agenciesCount.length}</p>
                    <p className="text-sm text-gray-500">Event agencies</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-1 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Suppliers</p>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{suppliersCount.length}</p>
                    <p className="text-sm text-gray-500">Service suppliers</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="ghost" className="h-auto py-4 flex-col text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href="/admin/categories/new">
                      <Plus className="h-6 w-6 mb-2 text-gray-500 group-hover:text-blue-600" />
                      <span className="font-medium">Add Category</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto py-4 flex-col text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href="/admin/agencies/new">
                      <Plus className="h-6 w-6 mb-2 text-gray-500 group-hover:text-blue-600" />
                      <span className="font-medium">Add Agency</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto py-4 flex-col text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href="/admin/suppliers/new">
                      <Plus className="h-6 w-6 mb-2 text-gray-500 group-hover:text-blue-600" />
                      <span className="font-medium">Add Supplier</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-auto py-4 flex-col text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Link href="/admin/analytics">
                      <BarChart3 className="h-6 w-6 mb-2 text-gray-500 group-hover:text-blue-600" />
                      <span className="font-medium">View Analytics</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Recent Activity</CardTitle>
                <CardDescription className="text-gray-600">Latest platform updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm p-3 bg-blue-50 rounded-lg">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">New supplier registered</span>
                    <span className="text-gray-400 ml-auto text-xs">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm p-3 bg-blue-50 rounded-lg">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Category updated</span>
                    <span className="text-gray-400 ml-auto text-xs">4h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm p-3 bg-blue-50 rounded-lg">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Agency profile completed</span>
                    <span className="text-gray-400 ml-auto text-xs">6h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Recent Categories</CardTitle>
                <CardDescription className="text-gray-600">Latest service categories added</CardDescription>
              </CardHeader>
              <CardContent>
                {categoriesCount.length > 0 ? (
                  <div className="space-y-3">
                    {categoriesCount.slice(0, 3).map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-blue-100 rounded-lg">
                            <Tag className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No categories yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Recent Agencies</CardTitle>
                <CardDescription className="text-gray-600">Latest event agencies registered</CardDescription>
              </CardHeader>
              <CardContent>
                {agenciesCount.length > 0 ? (
                  <div className="space-y-3">
                    {agenciesCount.slice(0, 3).map((agency) => (
                      <div key={agency.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-blue-100 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">{agency.name}</span>
                            <p className="text-xs text-gray-500">{agency.contactName}</p>
                          </div>
                        </div>
                                                 <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                           <Link href={`/admin/agencies/${agency.id}/edit`}>
                             <Pencil className="h-4 w-4" />
                           </Link>
                         </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No agencies yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 