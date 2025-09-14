"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Wrench, MapPin, Mail, Phone, Globe, Users, Settings, ImageIcon, FileText, Plus, ClipboardList, UserPlus } from "lucide-react"
import Link from "next/link"
import ImageManager from "@/components/ui/image-manager"
import { OrganizationSidebar } from "@/components/ui/organization-sidebar"

interface OrganizationClientProps {
  organization: any
  userRole: string
  orgType: "agency" | "supplier"
  isAdmin: boolean
}

export default function OrganizationClient({ 
  organization, 
  userRole, 
  orgType, 
  isAdmin 
}: OrganizationClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <OrganizationSidebar 
        orgType={orgType}
        organizationName={organization.name}
        activeSection="overview"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Organization Overview</h2>
              <p className="text-gray-600 text-lg">Manage your {orgType === "agency" ? "agency" : "supplier"} profile and activities</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={orgType === "agency" ? "default" : "secondary"}>
                {orgType === "agency" ? "Agency" : "Supplier"}
              </Badge>
              <Badge variant="outline">
                {userRole.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Organization Details */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
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

            {/* Status & Quick Actions */}
            <Card className="border-0 shadow-sm bg-white rounded-xl">
              <CardHeader>
                <CardTitle>Status & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Organization Status</span>
                    <Badge variant={organization.status === "active" ? "default" : "secondary"}>
                      {organization.status}
                    </Badge>
                  </div>
                  {orgType === "supplier" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Public Visibility</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={organization.isPublished ? "default" : "outline"}>
                          {organization.isPublished ? "Visible" : "Hidden"}
                        </Badge>
                        {!organization.isPublished && (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            Not in directory
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  {orgType === "agency" ? (
                    <>
                      <Button asChild className="w-full justify-start">
                        <Link href="/rfqs/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Issue New RFP
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/rfqs">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Manage RFPs
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/quotations">
                          <FileText className="h-4 w-4 mr-2" />
                          View Quotations
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/rfqs/received">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Received RFPs
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/organization/team">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/organization/edit">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Organization
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories/Services */}
          <Card className="border-0 shadow-sm bg-white rounded-xl mt-8">
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
            <Card className="border-0 shadow-sm bg-white rounded-xl mt-8">
              <CardHeader>
                <CardTitle>Services Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{organization.servicesText}</p>
              </CardContent>
            </Card>
          )}

          {/* Image Gallery */}
          <Card className="border-0 shadow-sm bg-white rounded-xl mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Portfolio Images
              </CardTitle>
              <CardDescription>
                {orgType === "agency" 
                  ? "Showcase your events and work" 
                  : "Showcase your services and portfolio"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageManager 
                organizationId={organization.id}
                organizationType={orgType}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
