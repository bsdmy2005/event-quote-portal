"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getRfqByIdAction } from "@/actions/rfqs-actions"
import { getCostEstimatesByRfqAction } from "@/actions/cost-estimates-actions"
import { GenerateCostEstimateForm } from "@/components/forms/generate-cost-estimate-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function RfqCostEstimatePage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const rfqRes = await getRfqByIdAction(params.id)
  if (!rfqRes.isSuccess || !rfqRes.data) redirect("/rfqs")

  const ceRes = await getCostEstimatesByRfqAction(params.id)
  const costEstimates = ceRes.isSuccess ? ceRes.data || [] : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Cost Estimates: {rfqRes.data.title}</h1>
      <GenerateCostEstimateForm rfqId={params.id} />

      <Card>
        <CardHeader><CardTitle>Existing Cost Estimates ({costEstimates.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {costEstimates.map((ce) => (
            <div key={ce.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{ce.title}</div>
                <div className="text-sm text-slate-600">Status: {ce.status} | Final Total: {ce.finalClientTotal}</div>
              </div>
              <Button asChild variant="outline"><Link href={`/rfqs/${params.id}/cost-estimate/${ce.id}`}>Open</Link></Button>
            </div>
          ))}
          {costEstimates.length === 0 && <p className="text-slate-600">No cost estimates yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
