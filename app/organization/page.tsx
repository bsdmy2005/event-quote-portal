"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserOrganizationAction } from "@/actions/onboarding-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Wrench, MapPin, Mail, Phone, Globe, Users, Settings } from "lucide-react"
import Link from "next/link"

export default async function OrganizationPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  const orgResult = await getUserOrganizationAction()
  
  if (!orgResult.isSuccess || !orgResult.data) {
    redirect("/onboard")
  }

  const { organization, userRole, orgType } = orgResult.data
  const isAdmin = userRole.includes("_admin")

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {organization.name}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant={orgType === "agency" ? "default" : "secondary"}>
              {orgType === "agency" ? "Agency" : "Supplier"}
            </Badge>
            <Badge variant="outline">
              {userRole.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Badge>
          </div>
        </div>
        
        {isAdmin && (
          <Button asChild>
            <Link href="/organization/edit">
              <Settings className="h-4 w-4 mr-2" />
              Edit Organization
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Organization Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {orgType === "agency" ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <Wrench className="h-5 w-5" />
                )}
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Name</label>
                  <p className="text-gray-900">{organization.contactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{organization.email}</p>
                  </div>
                </div>
                {organization.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{organization.phone}</p>
                    </div>
                  </div>
                )}
                {organization.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {organization.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {organization.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">
                      {organization.location.city}, {organization.location.province}, {organization.location.country}
                    </p>
                  </div>
                </div>
              )}

              {organization.about && (
                <div>
                  <label className="text-sm font-medium text-gray-500">About</label>
                  <p className="text-gray-900 mt-1">{organization.about}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories/Services */}
          <Card>
            <CardHeader>
              <CardTitle>
                {orgType === "agency" ? "Interest Categories" : "Service Categories"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orgType === "agency" ? (
                organization.interestCategories && organization.interestCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {organization.interestCategories.map((category: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No categories specified</p>
                )
              ) : (
                organization.serviceCategories && organization.serviceCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {organization.serviceCategories.map((category: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No service categories specified</p>
                )
              )}
            </CardContent>
          </Card>

          {/* Services Description (for suppliers) */}
          {orgType === "supplier" && organization.servicesText && (
            <Card>
              <CardHeader>
                <CardTitle>Services Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{organization.servicesText}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Organization Status</span>
                  <Badge variant={organization.status === "active" ? "default" : "secondary"}>
                    {organization.status}
                  </Badge>
                </div>
                {orgType === "supplier" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Published</span>
                    <Badge variant={organization.isPublished ? "default" : "outline"}>
                      {organization.isPublished ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isAdmin && (
                <>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/organization/edit">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Organization
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/organization/team">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                </>
              )}
              
              {orgType === "agency" && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/rfqs">
                    <Building2 className="h-4 w-4 mr-2" />
                    View RFQs
                  </Link>
                </Button>
              )}
              
              {orgType === "supplier" && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/quotations">
                    <Wrench className="h-4 w-4 mr-2" />
                    View Quotations
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Created Date */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{new Date(organization.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span>{new Date(organization.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
