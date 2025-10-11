"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileById } from "@/db/queries/profiles-queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function QuotationsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // Get user profile to check permissions
  const userProfile = await getProfileById(userId)
  if (!userProfile || !userProfile.supplierId) {
    redirect("/organization")
  }

  if (!["supplier_admin", "supplier_member"].includes(userProfile.role)) {
    redirect("/organization")
  }

  // TODO: Get actual quotations data
  const quotations: any[] = []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-100 text-blue-800"
      case "under_review": return "bg-yellow-100 text-yellow-800"
      case "accepted": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted": return "Submitted"
      case "under_review": return "Under Review"
      case "accepted": return "Accepted"
      case "rejected": return "Rejected"
      default: return status
    }
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
            <p className="text-gray-600 mt-2">
              Manage your submitted quotations and track their status
            </p>
          </div>
        </div>

        {/* Quotations List */}
        {quotations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations yet</h3>
              <p className="text-gray-600 mb-6">
                Submit quotations for RFQs to see them here
              </p>
              <Button asChild>
                <Link href="/rfqs/received">
                  <Eye className="h-4 w-4 mr-2" />
                  View Received RFQs
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {quotations.map((quotation) => (
              <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{quotation.rfqTitle}</CardTitle>
                      <CardDescription>
                        Submitted to {quotation.agencyName}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(quotation.status)}>
                      {getStatusLabel(quotation.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Submission Details */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          Submitted {format(new Date(quotation.submittedAt), "PPP 'at' p")}
                        </span>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{quotation.fileName}</span>
                      <span className="text-gray-400">•</span>
                      <span>{(quotation.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    </div>

                    {/* Notes */}
                    {quotation.notes && (
                      <div className="text-sm text-gray-700">
                        <p className="line-clamp-2">{quotation.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4" />
                        <span>Version {quotation.version}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/quotations/${quotation.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
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
