"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserOrganizationAction } from "@/actions/onboarding-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Wrench, MapPin, Mail, Phone, Globe, Users, Settings, ImageIcon } from "lucide-react"
import Link from "next/link"
import OrganizationClient from "./_components/organization-client"

export default async function OrganizationPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  const orgResult = await getUserOrganizationAction()
  
  if (!orgResult.isSuccess || !orgResult.data) {
    redirect("/onboard")
  }

  const { organization, userRole, orgType } = orgResult.data
  const isAdmin = userRole.includes("_admin")

  return (
    <OrganizationClient 
      organization={organization}
      userRole={userRole}
      orgType={orgType}
      isAdmin={isAdmin}
    />
  )
}
