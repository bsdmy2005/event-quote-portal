"use server"

import { auth } from "@clerk/nextjs/server"
import { ActionResult } from "@/types/actions/action-types"
import { revalidatePath } from "next/cache"
import { 
  createRfqInvite, 
  getRfqInviteById,
  updateRfqInvite
} from "@/db/queries/invites-queries"
import { 
  getRfqById,
  getRfqInvitesByRfq,
  getRfqInvitesBySupplier 
} from "@/db/queries/rfqs-queries"
import { getProfileById } from "@/db/queries/profiles-queries"
import { InsertRfqInvite } from "@/db/schema/invites-schema"

// Create RFQ Invite
export async function createRfqInviteAction(data: {
  rfqId: string
  supplierId: string
}): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get user profile to verify agency membership
    const userProfile = await getProfileById(userId)
    if (!userProfile || !userProfile.agencyId) {
      return { isSuccess: false, message: "User must be part of an agency to create RFQ invites" }
    }

    // Verify user has permission to create RFQ invites
    if (!["agency_admin", "agency_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to create RFQ invites" }
    }

    // Verify RFQ exists and belongs to user's agency
    const rfq = await getRfqById(data.rfqId)
    if (!rfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    if (rfq.agencyId !== userProfile.agencyId) {
      return { isSuccess: false, message: "You don't have permission to invite suppliers to this RFQ" }
    }

    const inviteData: InsertRfqInvite = {
      rfqId: data.rfqId,
      supplierId: data.supplierId,
      inviteStatus: "invited"
    }

    const newInvite = await createRfqInvite(inviteData)
    
    revalidatePath(`/rfqs/${data.rfqId}`)
    
    return {
      isSuccess: true,
      message: "RFQ invite created successfully",
      data: newInvite
    }
  } catch (error) {
    console.error("Error creating RFQ invite:", error)
    return { isSuccess: false, message: "Failed to create RFQ invite" }
  }
}

// Get RFQ Invite by ID
export async function getRfqInviteByIdAction(id: string): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const invite = await getRfqInviteById(id)
    if (!invite) {
      return { isSuccess: false, message: "RFQ invite not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    // Get RFQ to check agency access
    const rfq = await getRfqById(invite.rfqId)
    if (!rfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Check if user has access to this invite
    const hasAccess = 
      (userProfile.agencyId === rfq.agencyId && ["agency_admin", "agency_member"].includes(userProfile.role)) ||
      (userProfile.supplierId === invite.supplierId && ["supplier_admin", "supplier_member"].includes(userProfile.role))

    if (!hasAccess) {
      return { isSuccess: false, message: "You don't have permission to view this RFQ invite" }
    }

    return {
      isSuccess: true,
      message: "RFQ invite retrieved successfully",
      data: invite
    }
  } catch (error) {
    console.error("Error getting RFQ invite:", error)
    return { isSuccess: false, message: "Failed to get RFQ invite" }
  }
}

// Update RFQ Invite Status
export async function updateRfqInviteStatusAction(
  id: string, 
  status: "invited" | "opened" | "submitted" | "closed"
): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const invite = await getRfqInviteById(id)
    if (!invite) {
      return { isSuccess: false, message: "RFQ invite not found" }
    }

    // Get user profile to check permissions
    const userProfile = await getProfileById(userId)
    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    // Get RFQ to check agency access
    const rfq = await getRfqById(invite.rfqId)
    if (!rfq) {
      return { isSuccess: false, message: "RFQ not found" }
    }

    // Check if user has access to update this invite
    const hasAccess = 
      (userProfile.agencyId === rfq.agencyId && ["agency_admin", "agency_member"].includes(userProfile.role)) ||
      (userProfile.supplierId === invite.supplierId && ["supplier_admin", "supplier_member"].includes(userProfile.role))

    if (!hasAccess) {
      return { isSuccess: false, message: "You don't have permission to update this RFQ invite" }
    }

    const updatedInvite = await updateRfqInvite(id, { 
      inviteStatus: status,
      lastActivityAt: new Date()
    })
    
    revalidatePath(`/rfqs/${invite.rfqId}`)
    revalidatePath("/rfqs/received")
    
    return {
      isSuccess: true,
      message: "RFQ invite status updated successfully",
      data: updatedInvite
    }
  } catch (error) {
    console.error("Error updating RFQ invite status:", error)
    return { isSuccess: false, message: "Failed to update RFQ invite status" }
  }
}

// Get RFQ Invites by RFQ
export async function getRfqInvitesByRfqAction(rfqId: string): Promise<ActionResult<any[]>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Get RFQ to verify access
    const rfq = await getRfqById(rfqId)
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

// Get RFQ Invites by Supplier
export async function getRfqInvitesBySupplierAction(): Promise<ActionResult<any[]>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const userProfile = await getProfileById(userId)
    if (!userProfile || !userProfile.supplierId) {
      return { isSuccess: false, message: "User must be part of a supplier organization" }
    }

    if (!["supplier_admin", "supplier_member"].includes(userProfile.role)) {
      return { isSuccess: false, message: "You don't have permission to view RFQ invites" }
    }

    const invites = await getRfqInvitesBySupplier(userProfile.supplierId)
    
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
