"use server"

import { auth } from "@clerk/nextjs/server"
import { ActionResult } from "@/types/actions/action-types"
import { revalidatePath } from "next/cache"
import { 
  createRfq, 
  getRfqById, 
  getRfqsByAgency, 
  getRfqsByCreator,
  updateRfq,
  deleteRfq,
  getRfqInvitesByRfq,
  getRfqInvitesBySupplier
} from "@/db/queries/rfqs-queries"
import { 
  createRfqInvite
} from "@/db/queries/invites-queries"
import { getProfileById } from "@/db/queries/profiles-queries"
import { getAgencyById, getSupplierById } from "@/db/queries/organizations-queries"
import { sendRfqInviteEmail } from "@/lib/email-service"
import { InsertRfq, SelectRfq } from "@/db/schema/rfqs-schema"
import { InsertRfqInvite } from "@/db/schema/invites-schema"

// Create RFQ
export async function createRfqAction(data: {
  title: string
  clientName: string
  eventDates?: {
    start: string
    end: string
  }
  venue?: string
  scope: string
  attachmentsUrl?: string[]
  deadlineAt: string
}): Promise<ActionResult<SelectRfq>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get user profile to verify agency membership
    const userProfile = await getProfileById(userId)
    if (!userProfile || !userProfile.agencyId) {
      return { isSuccess: false, message: "User must be part of an agency to create RFQs" }
    }

    // Verify user has permission to create RFQs
    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to create RFQs" }
    }

    const rfqData: InsertRfq = {
      agencyId: userProfile.agencyId,
      createdByUserId: userId,
      title: data.title,
      clientName: data.clientName,
      eventDates: data.eventDates,
      venue: data.venue,
      scope: data.scope,
      attachmentsUrl: data.attachmentsUrl,
      deadlineAt: new Date(data.deadlineAt),
      status: "draft"
    }

    const newRfq = await createRfq(rfqData)
    
    revalidatePath("/rfqs")
    revalidatePath("/organization")
    
    return {
      isSuccess: true,
      message: "RFQ created successfully",
      data: newRfq
    }
  } catch (error) {
    console.error("Error creating RFQ:", error)
    return { isSuccess: false, message: "Failed to create RFQ" }
  }
}

// Get RFQ by ID
export async function getRfqByIdAction(id: string): Promise<ActionResult<SelectRfq>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const rfq = await getRfqById(id)
    if (!rfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    // Check if user has access to this RFQ
    const hasAccess = 
      (userProfile.agencyId === rfq.agencyId && ["agency_admin", "agency_member"].includes(userProfile.role)) ||
      (userProfile.supplierId && ["supplier_admin", "supplier_member"].includes(userProfile.role))

    if (!hasAccess) {
      return { isSuccess: false, message: "You don't have permission to view this RFQ" }
    }

    return {
      isSuccess: true,
      message: "RFQ retrieved successfully",
      data: rfq
    }
  } catch (error) {
    console.error("Error getting RFQ:", error)
    return { isSuccess: false, message: "Failed to get RFQ" }
  }
}

// Get RFQs by Agency
export async function getRfqsByAgencyAction(): Promise<ActionResult<SelectRfq[]>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const userProfile = await getProfileById(userId)
    if (!userProfile || !userProfile.agencyId) {
      return { isSuccess: false, message: "User must be part of an agency" }
    }

    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to view RFQs" }
    }

    const rfqs = await getRfqsByAgency(userProfile.agencyId)
    
    return {
      isSuccess: true,
      message: "RFQs retrieved successfully",
      data: rfqs
    }
  } catch (error) {
    console.error("Error getting RFQs:", error)
    return { isSuccess: false, message: "Failed to get RFQs" }
  }
}

// Get RFQs by Creator
export async function getRfqsByCreatorAction(): Promise<ActionResult<SelectRfq[]>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const userProfile = await getProfileById(userId)
    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to view RFQs" }
    }

    const rfqs = await getRfqsByCreator(userId)
    
    return {
      isSuccess: true,
      message: "RFQs retrieved successfully",
      data: rfqs
    }
  } catch (error) {
    console.error("Error getting RFQs:", error)
    return { isSuccess: false, message: "Failed to get RFQs" }
  }
}

// Update RFQ
export async function updateRfqAction(
  id: string, 
  data: Partial<{
    title: string
    clientName: string
    eventDates: {
      start: string
      end: string
    }
    venue: string
    scope: string
    attachmentsUrl: string[]
    deadlineAt: string
    status: "draft" | "sent" | "closed" | "awarded" | "not_awarded"
  }>
): Promise<ActionResult<SelectRfq>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get existing RFQ
    const existingRfq = await getRfqById(id)
    if (!existingRfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile || userProfile.agencyId !== existingRfq.agencyId) {
      return { isSuccess: false, message: "You don't have permission to update this RFQ" }
    }

    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to update RFQs" }
    }

    // Prepare update data
    const updateData: Partial<InsertRfq> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.clientName !== undefined) updateData.clientName = data.clientName
    if (data.eventDates !== undefined) updateData.eventDates = data.eventDates
    if (data.venue !== undefined) updateData.venue = data.venue
    if (data.scope !== undefined) updateData.scope = data.scope
    if (data.attachmentsUrl !== undefined) updateData.attachmentsUrl = data.attachmentsUrl
    if (data.deadlineAt !== undefined) updateData.deadlineAt = new Date(data.deadlineAt)
    if (data.status !== undefined) updateData.status = data.status

    const updatedRfq = await updateRfq(id, updateData)
    
    revalidatePath("/rfqs")
    revalidatePath(`/rfqs/${id}`)
    
    return {
      isSuccess: true,
      message: "RFQ updated successfully",
      data: updatedRfq
    }
  } catch (error) {
    console.error("Error updating RFQ:", error)
    return { isSuccess: false, message: "Failed to update RFQ" }
  }
}

// Delete RFQ
export async function deleteRfqAction(id: string): Promise<ActionResult<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get existing RFQ
    const existingRfq = await getRfqById(id)
    if (!existingRfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile || userProfile.agencyId !== existingRfq.agencyId) {
      return { isSuccess: false, message: "You don't have permission to delete this RFQ" }
    }

    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to delete RFQs" }
    }

    // Only allow deletion of draft RFQs
    if (existingRfq.status !== "draft") {
      return { isSuccess: false, message: "Only draft RFQs can be deleted" }
    }

    await deleteRfq(id)
    
    revalidatePath("/rfqs")
    revalidatePath("/organization")
    
    return {
      isSuccess: true,
      message: "RFQ deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting RFQ:", error)
    return { isSuccess: false, message: "Failed to delete RFQ" }
  }
}

// Send RFQ to suppliers
export async function sendRfqAction(
  rfqId: string, 
  supplierIds: string[]
): Promise<ActionResult<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get existing RFQ
    const existingRfq = await getRfqById(rfqId)
    if (!existingRfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile || userProfile.agencyId !== existingRfq.agencyId) {
      return { isSuccess: false, message: "You don't have permission to send this RFQ" }
    }

    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to send RFQs" }
    }

    // Only allow sending draft RFQs
    if (existingRfq.status !== "draft") {
      return { isSuccess: false, message: "Only draft RFQs can be sent" }
    }

    // Get agency details for email
    const agency = await getAgencyById(existingRfq.agencyId)
    if (!agency) {
      return { isSuccess: false, message: "Agency not found" }
    }

    // Create RFQ invites for each supplier and send emails
    const invitePromises = supplierIds.map(async (supplierId) => {
      // Create the invite
      const invite = await createRfqInvite({
        rfqId: rfqId,
        supplierId: supplierId,
        inviteStatus: "invited"
      })

      // Get supplier details for email
      const supplier = await getSupplierById(supplierId)
      if (supplier) {
        // Send email invitation
        try {
          const rfqUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/rfqs/received/${invite.id}`
          await sendRfqInviteEmail({
            to: supplier.email,
            rfqTitle: existingRfq.title,
            clientName: existingRfq.clientName,
            agencyName: agency.name,
            deadline: existingRfq.deadlineAt.toISOString(),
            rfqUrl: rfqUrl
          })
        } catch (emailError) {
          console.error(`Failed to send email to ${supplier.email}:`, emailError)
          // Continue even if email fails
        }
      }

      return invite
    })

    await Promise.all(invitePromises)

    // Update RFQ status to sent
    await updateRfq(rfqId, { status: "sent" })
    
    revalidatePath("/rfqs")
    revalidatePath(`/rfqs/${rfqId}`)
    
    return {
      isSuccess: true,
      message: `RFQ sent to ${supplierIds.length} supplier(s) successfully`,
      data: undefined
    }
  } catch (error) {
    console.error("Error sending RFQ:", error)
    return { isSuccess: false, message: "Failed to send RFQ" }
  }
}

// Get RFQ invites for a specific RFQ
export async function getRfqInvitesByRfqAction(rfqId: string): Promise<ActionResult<any[]>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get existing RFQ
    const existingRfq = await getRfqById(rfqId)
    if (!existingRfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    // Check if user has access to this RFQ
    const hasAccess = 
      (userProfile.agencyId === existingRfq.agencyId && ["agency_admin", "agency_member"].includes(userProfile.role)) ||
      (userProfile.supplierId && ["supplier_admin", "supplier_member"].includes(userProfile.role))

    if (!hasAccess) {
      return { isSuccess: false, message: "You don't have permission to view this RFQ's invites" }
    }

    const invites = await getRfqInvitesByRfq(rfqId)
    
    return {
      isSuccess: true,
      message: "RFQ invites retrieved successfully",
      data: invites
    }
  } catch (error) {
    console.error("Error getting RFQ invites:", error)
    return { isSuccess: false, message: "Failed to get RFQ invites" }
  }
}

// Update RFQ attachments
export async function updateRfqAttachmentsAction(
  rfqId: string,
  attachmentsUrl: string[]
): Promise<ActionResult<SelectRfq>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get existing RFQ
    const existingRfq = await getRfqById(rfqId)
    if (!existingRfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile || userProfile.agencyId !== existingRfq.agencyId) {
      return { isSuccess: false, message: "You don't have permission to update this RFQ" }
    }

    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to update RFQs" }
    }

    const updatedRfq = await updateRfq(rfqId, { attachmentsUrl })
    
    revalidatePath("/rfqs")
    revalidatePath(`/rfqs/${rfqId}`)
    
    return {
      isSuccess: true,
      message: "RFQ attachments updated successfully",
      data: updatedRfq
    }
  } catch (error) {
    console.error("Error updating RFQ attachments:", error)
    return { isSuccess: false, message: "Failed to update RFQ attachments" }
  }
}
