"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileById } from "@/db/queries/profiles-queries"
import { getAgencyById, getSupplierById } from "@/db/queries/organizations-queries"
import { OrganizationSidebar } from "@/components/ui/organization-sidebar"

export default async function ReceivedRfqsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // Get user profile to determine organization
  const userProfile = await getProfileById(userId)
  if (!userProfile) {
    redirect("/onboard")
  }

  // Determine organization type and get organization details
  let orgType: "agency" | "supplier" | null = null
  let organizationName = ""
  let activeSection: 'overview' | 'edit' | 'team' | 'rfps' | 'quotations' | 'received-rfps' = 'received-rfps'

  if (userProfile.agencyId) {
    orgType = "agency"
    const agency = await getAgencyById(userProfile.agencyId)
    organizationName = agency?.name || "Agency"
  } else if (userProfile.supplierId) {
    orgType = "supplier"
    const supplier = await getSupplierById(userProfile.supplierId)
    organizationName = supplier?.name || "Supplier"
  } else {
    redirect("/onboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <OrganizationSidebar 
        orgType={orgType}
        organizationName={organizationName}
        activeSection={activeSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
