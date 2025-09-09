"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { getUserProfileAction } from "@/actions/profiles-actions"

export default function OnboardingRedirect() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isLoaded || !user) return

      try {
        const profileResult = await getUserProfileAction()
        
        if (profileResult.isSuccess && profileResult.data) {
          const profile = profileResult.data
          
          // If user doesn't belong to any organization, redirect to onboarding
          if (!profile.agencyId && !profile.supplierId) {
            router.push("/onboard")
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      }
    }

    checkOnboardingStatus()
  }, [isLoaded, user, router])

  return null
}
