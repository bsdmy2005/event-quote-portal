"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateCostEstimateAction } from "@/actions/cost-estimates-actions"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

export function GenerateCostEstimateForm({ rfqId }: { rfqId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState("AI Cost Estimate")
  const [category, setCategory] = useState("General")
  const [lineDescription, setLineDescription] = useState("")
  const [unitCost, setUnitCost] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [markupPercent, setMarkupPercent] = useState(12)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await generateCostEstimateAction({
        rfqId,
        title,
        items: [
          {
            category,
            lineDescription,
            unitCost,
            quantity,
            markupPercent,
          },
        ],
      })

      if (
        notifyActionResult(res, {
          successMessage: "Cost estimate generated",
          errorMessage: "Failed to generate cost estimate",
        }) &&
        res.data
      ) {
        router.push(`/rfqs/${rfqId}/cost-estimate/${res.data.id}`)
      }
    } catch {
      notifyUnexpectedError("generate cost estimate")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border rounded-lg p-4">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} /></div>
        <div><Label>Line Description</Label><Input value={lineDescription} onChange={(e) => setLineDescription(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Unit Cost</Label><Input type="number" value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} /></div>
        <div><Label>Quantity</Label><Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></div>
        <div><Label>Markup %</Label><Input type="number" value={markupPercent} onChange={(e) => setMarkupPercent(Number(e.target.value))} /></div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Cost Estimate"}</Button>
    </form>
  )
}
