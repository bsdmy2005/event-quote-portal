"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getRfqByIdAction } from "@/actions/rfqs-actions"
import { getProfileById } from "@/db/queries/profiles-queries"
import { SendRfqForm } from "@/components/forms/send-rfq-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SendRfqPageProps {
  params: {
    id: string
  }
}

export default async function SendRfqPage({ params }: SendRfqPageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // Get user profile to check permissions
  const userProfile = await getProfileById(userId)
  if (!userProfile || !userProfile.agencyId) {
    redirect("/organization")
  }

  if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
    redirect("/organization")
  }

  // Get RFQ details
  const rfqResult = await getRfqByIdAction(params.id)
  if (!rfqResult.isSuccess || !rfqResult.data) {
    redirect("/rfqs")
  }

  const rfq = rfqResult.data

  // Only allow sending draft RFQs
  if (rfq.status !== "draft") {
    redirect(`/rfqs/${params.id}`)
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/rfqs/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to RFQ
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Send RFQ to Suppliers</h1>
          <p className="text-gray-600 mt-2">
            Select suppliers to invite to this RFQ
          </p>
        </div>

        {/* Form */}
        <SendRfqForm rfq={rfq} />
      </div>
    </div>
  )
}
