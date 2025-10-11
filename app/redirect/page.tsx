"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileById } from "@/db/queries/profiles-queries"
import { autoAcceptInvitationAction } from "@/actions/onboarding-actions"

export default async function RedirectPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  console.log("=== REDIRECT PAGE START ===")
  console.log("User ID:", userId)

  // Get full user object from Clerk with email addresses
  const user = await currentUser()
  console.log("User object:", JSON.stringify(user, null, 2))

  // Get user email from Clerk
  const userEmail = user?.emailAddresses?.[0]?.emailAddress
  console.log("User email:", userEmail)

  if (!userEmail) {
    console.log("No email found in user object, waiting and checking layout...")
    // Let layout handle profile creation and invitation
    // Wait a bit for layout to complete
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Check if profile now exists (created by layout)
    let profile = await getProfileById(userId).catch(() => null)
    if (profile) {
      console.log("Profile exists after layout, checking organization...")
      if (profile.role === "admin") {
        redirect("/admin")
      }
      if (profile.agencyId || profile.supplierId) {
        redirect("/organization")
      }
    }
    // Still no profile or organization, go to onboard
    redirect("/onboard")
  }

  // Get or create user profile
  console.log("Fetching user profile directly from database (no cache)...")
  let profile = await getProfileById(userId).catch(() => null)

  console.log("Initial profile result:", JSON.stringify(profile, null, 2))

  // If no profile exists, create one
  if (!profile) {
    console.log("No profile found, creating basic profile...")

    // Create basic profile
    const { createProfile } = await import("@/db/queries/profiles-queries")
    profile = await createProfile({
      userId: userId,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: userEmail!,
      role: "agency_member",
      agencyId: null,
      supplierId: null
    })
    
    console.log("Profile created:", JSON.stringify(profile, null, 2))
    
    // Check for pending invitations and auto-accept
    console.log("Checking for invitations for:", userEmail)
    const inviteResult = await autoAcceptInvitationAction(userId, userEmail!)
    console.log("Invitation check result:", inviteResult)
    
    if (inviteResult.isSuccess) {
      // Invitation accepted, fetch updated profile
      console.log("Invitation accepted, fetching updated profile...")
      profile = await getProfileById(userId).catch(() => null)
      console.log("Updated profile after invitation:", JSON.stringify(profile, null, 2))
    }
  }

  // Ensure profile exists
  if (!profile) {
    console.log("No profile available, redirecting to onboard")
    redirect("/onboard")
  }

  // Route based on role
  if (profile.role === "admin") {
    console.log("User is admin, redirecting to admin page")
    redirect("/admin")
  }

  // If user has an organization, go to organization page
  console.log("Checking if user has organization...")
  console.log("agencyId:", profile.agencyId)
  console.log("supplierId:", profile.supplierId)
  
  if (profile.agencyId || profile.supplierId) {
    console.log("User has organization! Redirecting to organization page")
    redirect("/organization")
  }
  
  console.log("User has NO organization, checking for invitations...")

  // Check for pending invitations before sending to onboarding (userEmail already defined above)
  if (userEmail) {
    console.log("Checking for invitations for:", userEmail)
    const inviteResult = await autoAcceptInvitationAction(userId, userEmail)
    console.log("Invitation check result:", inviteResult)
    
    if (inviteResult.isSuccess) {
      // Invitation accepted, re-fetch profile directly from database (no cache)
      console.log("Invitation accepted, re-fetching profile from database to confirm organization assignment")
      let updatedProfile = await getProfileById(userId).catch(() => null)
      
      console.log("Updated profile after invitation:", JSON.stringify(updatedProfile, null, 2))
      
      if (updatedProfile && (updatedProfile.agencyId || updatedProfile.supplierId)) {
        console.log("Profile now has organization, redirecting to organization page")
        redirect("/organization")
      }
      
      // If still no organization (shouldn't happen), wait briefly and try again
      console.log("Profile doesn't have organization yet, waiting briefly...")
      await new Promise(resolve => setTimeout(resolve, 1000))
      updatedProfile = await getProfileById(userId).catch(() => null)
      
      if (updatedProfile && (updatedProfile.agencyId || updatedProfile.supplierId)) {
        console.log("Profile now has organization after retry, redirecting")
        redirect("/organization")
      }
      
      console.log("Warning: Invitation accepted but profile still has no organization")
    }
  }

  // No organization and no invitation, go to onboarding
  redirect("/onboard")
}

