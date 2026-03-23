"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getCostEstimateByIdAction } from "@/actions/cost-estimates-actions"
import { CostEstimateEditorForm } from "@/components/forms/cost-estimate-editor-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CostEstimateDetailPage({ params }: { params: { id: string; ceId: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const ceRes = await getCostEstimateByIdAction(params.ceId)
  if (!ceRes.isSuccess || !ceRes.data) redirect(`/rfqs/${params.id}/cost-estimate`)

  const ce = ceRes.data

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">{ce.title}</h1>
      <CostEstimateEditorForm
        costEstimateId={ce.id}
        initialManagementFee={Number(ce.managementFeePercent)}
        initialVat={Number(ce.vatPercent)}
      />

      <Card>
        <CardHeader><CardTitle>Line Items ({ce.items.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {ce.items.map((item: any) => (
            <div key={item.id} className="border rounded p-3 text-sm">
              <div className="font-medium">{item.category} - {item.lineDescription}</div>
              <div className="text-slate-600">
                Supplier: {item.supplierSubtotal} | Markup: {item.markupValue} | Client: {item.clientPrice}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <div>Supplier Net Total: {ce.supplierNetTotal}</div>
          <div>Markup Total: {ce.markupTotal}</div>
          <div>Management Fee: {ce.managementFeeTotal}</div>
          <div>VAT: {ce.vatTotal}</div>
          <div className="font-semibold">Final Client Total: {ce.finalClientTotal}</div>
        </CardContent>
      </Card>
    </div>
  )
}
