"use server"

import { auth } from "@clerk/nextjs/server"
import { ActionResult } from "@/types/actions/action-types"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { 
  createAgency, 
  createSupplier, 
  updateAgency, 
  updateSupplier,
  getAgencyById,
  getSupplierById
} from "@/db/queries/organizations-queries"
import { 
  getProfileById, 
  updateProfile, 
  getProfileByEmail, 
  getProfileWithOrganization 
} from "@/db/queries/profiles-queries"
import { 
  createOrgInvite, 
  getOrgInviteByTokenHash, 
  updateOrgInvite 
} from "@/db/queries/invites-queries"
import { generateWelcomeEmail } from "@/lib/email-templates"
import { sendTeamInviteEmail } from "@/lib/email-service"

// Agency Onboarding
export async function createAgencyOnboardingAction(data: {
  name: string
  contactName: string
  email: string
  phone?: string
  website?: string
  location: {
    city: string
    province: string
    country: string
  }
  interestCategories: string[]
  about?: string
  isPublished?: boolean
}): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Check if user already has an organization
    const existingProfile = await getProfileById(userId)

    if (existingProfile?.agencyId || existingProfile?.supplierId) {
      return { isSuccess: false, message: "User already belongs to an organization" }
    }

    // Create the agency
    const newAgency = await createAgency({
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      website: data.website,
      location: data.location,
      interestCategories: data.interestCategories,
      about: data.about,
      isPublished: data.isPublished ?? true,
      status: "active"
    })

    // Update user profile to be agency admin
    await updateProfile(userId, {
      role: "agency_admin",
      agencyId: newAgency.id,
      supplierId: null
    })

    revalidatePath("/dashboard")
    revalidatePath("/agencies")

    return {
      isSuccess: true,
      message: "Agency created successfully",
      data: newAgency
    }
  } catch (error) {
    console.error("Error creating agency:", error)
    return { isSuccess: false, message: "Failed to create agency" }
  }
}

// Supplier Onboarding
export async function createSupplierOnboardingAction(data: {
  name: string
  contactName: string
  email: string
  phone?: string
  location: {
    city: string
    province: string
    country: string
  }
  serviceCategories: string[]
  servicesText?: string
  isPublished?: boolean
}): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Check if user already has an organization
    const existingProfile = await getProfileById(userId)

    if (existingProfile?.agencyId || existingProfile?.supplierId) {
      return { isSuccess: false, message: "User already belongs to an organization" }
    }

    // Create the supplier
    const newSupplier = await createSupplier({
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      serviceCategories: data.serviceCategories,
      servicesText: data.servicesText,
      isPublished: data.isPublished ?? true,
      status: "active"
    })

    // Update user profile to be supplier admin
    await updateProfile(userId, {
      role: "supplier_admin",
      agencyId: null,
      supplierId: newSupplier.id
    })

    revalidatePath("/dashboard")
    revalidatePath("/suppliers")

    return {
      isSuccess: true,
      message: "Supplier created successfully",
      data: newSupplier
    }
  } catch (error) {
    console.error("Error creating supplier:", error)
    return { isSuccess: false, message: "Failed to create supplier" }
  }
}

// Team Invitation
export async function sendTeamInviteAction(data: {
  orgType: "agency" | "supplier"
  orgId: string
  email: string
  role: string
}): Promise<ActionResult<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Verify user has permission to invite (is admin of the organization)
    const userProfile = await getProfileById(userId)

    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    // Check if user is admin of the organization
    const isOrgAdmin = (data.orgType === "agency" && userProfile.agencyId === data.orgId && userProfile.role === "agency_admin") ||
                      (data.orgType === "supplier" && userProfile.supplierId === data.orgId && userProfile.role === "supplier_admin")

    if (!isOrgAdmin) {
      return { isSuccess: false, message: "You don't have permission to invite users to this organization" }
    }

    // Check if email already has a profile
    const existingProfile = await getProfileByEmail(data.email)

    if (existingProfile) {
      return { isSuccess: false, message: "User with this email already exists" }
    }

    // Generate invite token (keep for compatibility but don't use in flow)
    const token = randomBytes(32).toString('hex')
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create invite record
    await createOrgInvite({
      orgType: data.orgType,
      orgId: data.orgId,
      email: data.email,
      role: data.role,
      tokenHash: tokenHash,
      expiresAt: expiresAt
    })

    // Get organization details
    const organization = data.orgType === "agency" 
      ? await getAgencyById(data.orgId)
      : await getSupplierById(data.orgId)

    if (!organization) {
      return { isSuccess: false, message: "Organization not found" }
    }

    // Get inviter name
    const inviterName = userProfile.firstName && userProfile.lastName 
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : userProfile.firstName || "Team Admin"

    // Send email invitation using Postmark
    await sendTeamInviteEmail({
      to: data.email,
      organizationName: organization.name,
      organizationType: data.orgType,
      inviterName: inviterName,
      role: data.role
    })

    return {
      isSuccess: true,
      message: "Invitation sent successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error sending team invite:", error)
    return { isSuccess: false, message: "Failed to send invitation" }
  }
}

// Accept Team Invitation
export async function acceptTeamInviteAction(token: string): Promise<ActionResult<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex')

    // Find the invite
    const invite = await getOrgInviteByTokenHash(tokenHash)

    if (!invite) {
      return { isSuccess: false, message: "Invalid invitation token" }
    }

    if (invite.expiresAt < new Date()) {
      return { isSuccess: false, message: "Invitation has expired" }
    }

    if (invite.acceptedAt) {
      return { isSuccess: false, message: "Invitation has already been accepted" }
    }

    // Get user profile
    const userProfile = await getProfileById(userId)

    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    // Check if user already belongs to an organization
    if (userProfile.agencyId || userProfile.supplierId) {
      return { isSuccess: false, message: "User already belongs to an organization" }
    }

    // Update user profile
    const updateData = invite.orgType === "agency" 
      ? { role: invite.role as any, agencyId: invite.orgId, supplierId: null }
      : { role: invite.role as any, agencyId: null, supplierId: invite.orgId }

    await updateProfile(userId, updateData)

    // Mark invite as accepted
    await updateOrgInvite(invite.id, { acceptedAt: new Date() })

    revalidatePath("/dashboard")

    return {
      isSuccess: true,
      message: "Invitation accepted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error accepting team invite:", error)
    return { isSuccess: false, message: "Failed to accept invitation" }
  }
}

// Get user's organization info for management
export async function getUserOrganizationAction(): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    const userProfile = await getProfileWithOrganization(userId)

    if (!userProfile) {
      return { isSuccess: false, message: "User profile not found" }
    }

    const organization = userProfile.agency || userProfile.supplier
    if (!organization) {
      return { isSuccess: false, message: "User does not belong to any organization" }
    }

    return {
      isSuccess: true,
      message: "Organization retrieved successfully",
      data: {
        organization,
        userRole: userProfile.role,
        orgType: userProfile.agency ? "agency" : "supplier"
      }
    }
  } catch (error) {
    console.error("Error getting user organization:", error)
    return { isSuccess: false, message: "Failed to get organization" }
  }
}

// Update organization actions for non-admin users
export async function updateAgencyAction(id: string, data: any): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Verify user has permission to update this agency
    const userProfile = await getProfileById(userId)

    if (!userProfile || userProfile.agencyId !== id || !userProfile.role.includes("admin")) {
      return { isSuccess: false, message: "You don't have permission to update this agency" }
    }

    const updatedAgency = await updateAgency(id, data)
    revalidatePath("/organization")
    revalidatePath("/agencies")

    return {
      isSuccess: true,
      message: "Agency updated successfully",
      data: updatedAgency
    }
  } catch (error) {
    console.error("Error updating agency:", error)
    return { isSuccess: false, message: "Failed to update agency" }
  }
}

export async function updateSupplierAction(id: string, data: any): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Verify user has permission to update this supplier
    const userProfile = await getProfileById(userId)

    if (!userProfile || userProfile.supplierId !== id || !userProfile.role.includes("admin")) {
      return { isSuccess: false, message: "You don't have permission to update this supplier" }
    }

    const updatedSupplier = await updateSupplier(id, data)
    revalidatePath("/organization")
    revalidatePath("/suppliers")

    return {
      isSuccess: true,
      message: "Supplier updated successfully",
      data: updatedSupplier
    }
  } catch (error) {
    console.error("Error updating supplier:", error)
    return { isSuccess: false, message: "Failed to update supplier" }
  }
}

// Admin access action (for development/testing purposes)
export async function promoteToAdminAction(): Promise<ActionResult<void>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" }
    }

    // Update user profile to be admin
    await updateProfile(userId, {
      role: "admin",
      agencyId: null,
      supplierId: null
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin")

    return {
      isSuccess: true,
      message: "User promoted to admin successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error promoting user to admin:", error)
    return { isSuccess: false, message: "Failed to promote user to admin" }
  }
}
