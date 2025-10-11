"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileById } from "@/db/queries/profiles-queries"
import { CreateRfqForm } from "@/components/forms/create-rfq-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewRfqPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Create New RFQ</h1>
          <p className="text-gray-600 mt-2">
            Create a new Request for Quote to send to suppliers
          </p>
        </div>

        {/* Form */}
        <CreateRfqForm />
      </div>
    </div>
  )
}
