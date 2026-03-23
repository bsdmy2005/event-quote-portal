"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateCostConsultantForm } from "@/components/forms/create-cost-consultant-form"

export default async function CostConsultantOnboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Cost Consultant Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCostConsultantForm />
        </CardContent>
      </Card>
    </div>
  )
}
