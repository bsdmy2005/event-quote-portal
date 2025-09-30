"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileById } from "@/db/queries/profiles-queries"
import { getRfqInvitesBySupplierAction } from "@/actions/rfq-invites-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Clock, Building2, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function ReceivedRfqsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // Get user profile to check permissions
  const userProfile = await getProfileById(userId)
  if (!userProfile || !userProfile.supplierId) {
    redirect("/dashboard")
  }

  if (!["supplier_admin", "supplier_member"].includes(userProfile.role)) {
    redirect("/dashboard")
  }

  // Get RFQ invites for this supplier
  const invitesResult = await getRfqInvitesBySupplierAction()
  const invites = invitesResult.isSuccess ? invitesResult.data || [] : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "invited": return "bg-yellow-100 text-yellow-800"
      case "opened": return "bg-blue-100 text-blue-800"
      case "submitted": return "bg-green-100 text-green-800"
      case "closed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Received RFQs</h1>
            <p className="text-gray-600 mt-2">
              View and respond to RFQ invitations from agencies
            </p>
          </div>
        </div>

        {/* RFQs List */}
        {invites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQ invitations yet</h3>
              <p className="text-gray-600 mb-6">
                You'll receive email notifications when agencies invite you to submit quotations
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {invites.map((invite) => (
              <Card key={invite.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{invite.rfq?.title || "RFQ"}</CardTitle>
                      <CardDescription className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {invite.rfq?.clientName || "Client"}
                        </span>
                        {invite.rfq?.venue && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {invite.rfq.venue}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(invite.inviteStatus)}>
                      {getStatusLabel(invite.inviteStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Event Dates */}
                    {invite.rfq?.eventDates && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(invite.rfq.eventDates.start).toLocaleDateString()} - {new Date(invite.rfq.eventDates.end).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Deadline */}
                    {invite.rfq?.deadlineAt && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            Response deadline: {format(new Date(invite.rfq.deadlineAt), "PPP 'at' p")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Scope Preview */}
                    {invite.rfq?.scope && (
                      <div className="text-sm text-gray-700">
                        <p className="line-clamp-2">{invite.rfq.scope}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {invite.rfq?.attachmentsUrl && invite.rfq.attachmentsUrl.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{invite.rfq.attachmentsUrl.length} attachment{invite.rfq.attachmentsUrl.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Invited {format(new Date(invite.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/rfqs/received/${invite.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View RFQ
                          </Link>
                        </Button>
                        {invite.inviteStatus === "invited" && (
                          <Button size="sm" asChild>
                            <Link href={`/rfqs/received/${invite.id}/respond`}>
                              Submit Quotation
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
