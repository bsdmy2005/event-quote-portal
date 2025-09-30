"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getRfqsByAgencyAction } from "@/actions/rfqs-actions"
import { getProfileById } from "@/db/queries/profiles-queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Building2, Users, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function RfqsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // Get user profile to check permissions
  const userProfile = await getProfileById(userId)
  if (!userProfile || !userProfile.agencyId) {
    redirect("/dashboard")
  }

  if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
    redirect("/dashboard")
  }

  // Get RFQs for the agency
  const rfqsResult = await getRfqsByAgencyAction()
  const rfqs = rfqsResult.isSuccess ? rfqsResult.data || [] : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800"
      case "sent": return "bg-blue-100 text-blue-800"
      case "closed": return "bg-red-100 text-red-800"
      case "awarded": return "bg-green-100 text-green-800"
      case "not_awarded": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft": return "Draft"
      case "sent": return "Sent"
      case "closed": return "Closed"
      case "awarded": return "Awarded"
      case "not_awarded": return "Not Awarded"
      default: return status
    }
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RFQs</h1>
              <p className="text-gray-600 mt-2">
                Manage your Request for Quotes and track supplier responses
              </p>
            </div>
            <Button asChild>
              <Link href="/rfqs/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New RFQ
              </Link>
            </Button>
          </div>
        </div>

        {/* RFQs List */}
        {rfqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first RFQ to start receiving quotations from suppliers
              </p>
              <Button asChild>
                <Link href="/rfqs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First RFQ
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {rfqs.map((rfq) => (
              <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{rfq.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {rfq.clientName}
                        </span>
                        {rfq.venue && (
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {rfq.venue}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(rfq.status)}>
                      {getStatusLabel(rfq.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Event Dates */}
                    {rfq.eventDates && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(rfq.eventDates.start).toLocaleDateString()} - {new Date(rfq.eventDates.end).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Deadline */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          Response deadline: {format(new Date(rfq.deadlineAt), "PPP 'at' p")}
                        </span>
                      </div>
                    </div>

                    {/* Scope Preview */}
                    <div className="text-sm text-gray-700">
                      <p className="line-clamp-2">{rfq.scope}</p>
                    </div>

                    {/* Attachments */}
                    {rfq.attachmentsUrl && rfq.attachmentsUrl.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{rfq.attachmentsUrl.length} attachment{rfq.attachmentsUrl.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>Created {format(new Date(rfq.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/rfqs/${rfq.id}`}>
                            View Details
                          </Link>
                        </Button>
                        {rfq.status === "draft" && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/rfqs/${rfq.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        )}
                        {rfq.status === "draft" && (
                          <Button size="sm" asChild>
                            <Link href={`/rfqs/${rfq.id}/send`}>
                              Send to Suppliers
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
