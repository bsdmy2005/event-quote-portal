"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getRfqByIdAction, getRfqInvitesByRfqAction } from "@/actions/rfqs-actions"
import { getProfileById } from "@/db/queries/profiles-queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Calendar, 
  Building2, 
  Clock, 
  FileText, 
  Users, 
  Download,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface RfqPageProps {
  params: {
    id: string
  }
}

export default async function RfqPage({ params }: RfqPageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // Get user profile to check permissions
  const userProfile = await getProfileById(userId)
  if (!userProfile) {
    redirect("/organization")
  }

  // Get RFQ details
  const rfqResult = await getRfqByIdAction(params.id)
  if (!rfqResult.isSuccess || !rfqResult.data) {
    redirect("/rfqs")
  }

  const rfq = rfqResult.data

  // Get RFQ invites
  const invitesResult = await getRfqInvitesByRfqAction(params.id)
  const invites = invitesResult.isSuccess ? invitesResult.data || [] : []

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

  const getInviteStatusIcon = (status: string) => {
    switch (status) {
      case "invited": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "opened": return <Clock className="h-4 w-4 text-blue-500" />
      case "submitted": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closed": return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getInviteStatusLabel = (status: string) => {
    switch (status) {
      case "invited": return "Invited"
      case "opened": return "Opened"
      case "submitted": return "Submitted"
      case "closed": return "Closed"
      default: return status
    }
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rfqs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to RFQs
              </Link>
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{rfq.title}</h1>
              <p className="text-gray-600 mt-2">Client: {rfq.clientName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(rfq.status)}>
                {getStatusLabel(rfq.status)}
              </Badge>
              {rfq.status === "draft" && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/rfqs/${rfq.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/rfqs/${rfq.id}/send`}>
                      <Send className="h-4 w-4 mr-2" />
                      Send to Suppliers
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rfq.eventDates && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Dates</h4>
                    <p className="text-gray-600">
                      {new Date(rfq.eventDates.start).toLocaleDateString()} - {new Date(rfq.eventDates.end).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {rfq.venue && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Venue</h4>
                    <p className="text-gray-600">{rfq.venue}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Response Deadline</h4>
                  <p className="text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(rfq.deadlineAt), "PPP 'at' p")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Scope */}
            <Card>
              <CardHeader>
                <CardTitle>Project Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{rfq.scope}</p>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {rfq.attachmentsUrl && rfq.attachmentsUrl.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Attachments ({rfq.attachmentsUrl.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rfq.attachmentsUrl.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            Attachment {index + 1}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supplier Invites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Supplier Invites ({invites.length})
                </CardTitle>
                <CardDescription>
                  Track supplier responses to this RFQ
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invites.length === 0 ? (
                  <p className="text-gray-500 text-sm">No suppliers invited yet</p>
                ) : (
                  <div className="space-y-3">
                    {invites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getInviteStatusIcon(invite.inviteStatus)}
                          <div>
                            <p className="text-sm font-medium">Supplier {invite.supplierId}</p>
                            <p className="text-xs text-gray-500">
                              {getInviteStatusLabel(invite.inviteStatus)}
                            </p>
                          </div>
                        </div>
                        {invite.inviteStatus === "submitted" && (
                          <Button variant="outline" size="sm">
                            View Quotation
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Invites</span>
                  <span className="font-medium">{invites.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Responses</span>
                  <span className="font-medium">
                    {invites.filter(invite => invite.inviteStatus === "submitted").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Opened</span>
                  <span className="font-medium">
                    {invites.filter(invite => invite.inviteStatus === "opened").length}
                  </span>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  Created {format(new Date(rfq.createdAt), "MMM d, yyyy 'at' p")}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
