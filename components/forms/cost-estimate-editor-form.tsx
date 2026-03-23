"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateManagementFeeAction, updateVatAction, publishCostEstimateAction, exportCostEstimatePdfAction } from "@/actions/cost-estimates-actions"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

export function CostEstimateEditorForm({ costEstimateId, initialManagementFee, initialVat }: { costEstimateId: string; initialManagementFee: number; initialVat: number }) {
  const [managementFee, setManagementFee] = useState(initialManagementFee)
  const [vat, setVat] = useState(initialVat)
  const [loading, setLoading] = useState(false)

  const saveFees = async () => {
    setLoading(true)
    try {
      const fee = await updateManagementFeeAction(costEstimateId, managementFee)
      const vatRes = await updateVatAction(costEstimateId, vat)
      if (!fee.isSuccess || !vatRes.isSuccess) {
        notifyActionResult(fee, { errorMessage: "Failed to update CE fees", silentSuccess: true })
        notifyActionResult(vatRes, { errorMessage: "Failed to update CE fees", silentSuccess: true })
        return
      }
      notifyActionResult({ isSuccess: true, message: "Cost estimate updated" })
    } catch {
      notifyUnexpectedError("update cost estimate fees")
    } finally {
      setLoading(false)
    }
  }

  const publish = async () => {
    try {
      const res = await publishCostEstimateAction(costEstimateId)
      notifyActionResult(res, {
        successMessage: "Cost estimate published",
        errorMessage: "Failed to publish cost estimate",
      })
    } catch {
      notifyUnexpectedError("publish cost estimate")
    }
  }

  const exportPdf = async (variant: "pdf" | "client_summary_pdf") => {
    try {
      const res = await exportCostEstimatePdfAction(costEstimateId, variant)
      notifyActionResult(res, {
        successMessage: variant === "pdf" ? "PDF export created" : "Client summary export created",
        errorMessage: "Failed to export cost estimate",
      })
    } catch {
      notifyUnexpectedError("export cost estimate")
    }
  }

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Management Fee %</Label>
          <Input type="number" value={managementFee} onChange={(e) => setManagementFee(Number(e.target.value))} />
        </div>
        <div>
          <Label>VAT %</Label>
          <Input type="number" value={vat} onChange={(e) => setVat(Number(e.target.value))} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={saveFees} disabled={loading}>{loading ? "Saving..." : "Save Calculations"}</Button>
        <Button variant="secondary" onClick={publish}>Publish CE</Button>
        <Button variant="outline" onClick={() => exportPdf("pdf")}>Export PDF</Button>
        <Button variant="outline" onClick={() => exportPdf("client_summary_pdf")}>Export Client Summary</Button>
      </div>
    </div>
  )
}
