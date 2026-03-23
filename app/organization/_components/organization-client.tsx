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
  orgType: "agency" | "supplier" | "cost_consultant"
  isAdmin: boolean
}

export default function OrganizationClient({
  organization,
  userRole,
  orgType,
  isAdmin
}: OrganizationClientProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <OrganizationSidebar
        orgType={orgType}
        organizationName={organization.name}
        activeSection="overview"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Organization Overview</h2>
              <p className="text-slate-600 text-lg">Manage your {orgType === "agency" ? "agency" : orgType === "supplier" ? "supplier" : "cost consultant"} profile and activities</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={orgType === "agency" ? "default" : "secondary"} className={orgType === "agency" ? "" : "bg-slate-100 text-slate-700 border border-slate-300"}>
                {orgType === "agency" ? "Agency" : orgType === "supplier" ? "Supplier" : "Cost Consultant"}
              </Badge>
              <Badge variant="outline" className="border-slate-300 text-slate-700">
                {userRole.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Organization Details */}
            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  {orgType === "agency" ? (
                    <Building2 className="h-5 w-5 text-slate-700" />
                  ) : (
                    <Wrench className="h-5 w-5 text-slate-700" />
                  )}
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Contact Name</label>
                    <p className="text-slate-900">{organization.contactName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <p className="text-slate-900">{organization.email}</p>
                    </div>
                  </div>
                  {organization.phone && (
                    <div>
                      <label className="text-sm font-medium text-slate-500">Phone</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <p className="text-slate-900">{organization.phone}</p>
                      </div>
                    </div>
                  )}
                  {organization.website && (
                    <div>
                      <label className="text-sm font-medium text-slate-500">Website</label>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-500" />
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
                    <label className="text-sm font-medium text-slate-500">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <p className="text-slate-900">
                        {organization.location.city}, {organization.location.province}, {organization.location.country}
                      </p>
                    </div>
                  </div>
                )}

                {organization.about && (
                  <div>
                    <label className="text-sm font-medium text-slate-500">About</label>
                    <p className="text-slate-800 mt-1">{organization.about}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status & Quick Actions */}
            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-slate-900">Status & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Organization Status</span>
                    <Badge variant={organization.status === "active" ? "default" : "secondary"} className={organization.status === "active" ? "bg-green-100 text-green-800 border border-green-200" : "bg-slate-100 text-slate-600 border border-slate-200"}>
                      {organization.status}
                    </Badge>
                  </div>
                  {orgType === "supplier" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Public Visibility</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={organization.isPublished ? "default" : "outline"} className={organization.isPublished ? "bg-green-100 text-green-800 border border-green-200" : "border-slate-300 text-slate-600"}>
                          {organization.isPublished ? "Visible" : "Hidden"}
                        </Badge>
                        {!organization.isPublished && (
                          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                            Not in directory
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                  {orgType === "agency" ? (
                    <>
                      <Button asChild className="w-full justify-start">
                        <Link href="/rfqs/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Issue New RFP
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start border-slate-300 text-slate-700 hover:text-slate-900">
                        <Link href="/rfqs">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Manage RFPs
                        </Link>
                      </Button>
                    </>
                  ) : orgType === "cost_consultant" ? (
                    <>
                      <Button asChild className="w-full justify-start">
                        <Link href="/rfqs/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Issue New Brief
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start border-slate-300 text-slate-700 hover:text-slate-900">
                        <Link href="/rfqs">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Manage Briefs
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start border-slate-300 text-slate-700 hover:text-slate-900">
                        <Link href="/organization/performance">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          View Performance
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full justify-start border-slate-300 text-slate-700 hover:text-slate-900">
                        <Link href="/quotations">
                          <FileText className="h-4 w-4 mr-2" />
                          View Quotations
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start border-slate-300 text-slate-700 hover:text-slate-900">
                        <Link href="/rfqs/received">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Received RFPs
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button asChild variant="outline" className="w-full justify-start border-slate-300 text-slate-700 hover:text-slate-900">
                    <Link href="/organization/team">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start border-slate-300 text-slate-700 hover:text-slate-900">
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
          <Card className="border border-slate-200 shadow-sm bg-white rounded-xl mt-8">
            <CardHeader>
              <CardTitle className="text-slate-900">
                {orgType === "agency" ? "Interest Categories" : orgType === "supplier" ? "Service Categories" : "Consulting Categories"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orgType === "agency" ? (
                organization.interestCategories && organization.interestCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {organization.interestCategories.map((category: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-slate-300 text-slate-700">
                        {category}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No categories specified</p>
                )
              ) : (
                organization.serviceCategories && organization.serviceCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {organization.serviceCategories.map((category: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-slate-300 text-slate-700">
                        {category}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No service categories specified</p>
                )
              )}
            </CardContent>
          </Card>

          {/* Services Description (for suppliers) */}
          {orgType === "supplier" && organization.servicesText && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-xl mt-8">
              <CardHeader>
                <CardTitle className="text-slate-900">Services Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-800 whitespace-pre-wrap">{organization.servicesText}</p>
              </CardContent>
            </Card>
          )}

          {/* Image Gallery */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-xl mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <ImageIcon className="h-5 w-5 text-slate-700" />
                Portfolio Images
              </CardTitle>
              <CardDescription className="text-slate-500">
                {orgType === "agency"
                  ? "Showcase your events and work"
                  : "Showcase your services and portfolio"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageManager
                organizationId={organization.id}
                organizationType={orgType === "cost_consultant" ? "agency" : orgType}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
