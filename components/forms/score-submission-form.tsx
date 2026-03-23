"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { scoreSubmissionAction } from "@/actions/rfq-evaluations-actions"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

export function ScoreSubmissionForm({ rfqId, submissionId }: { rfqId: string; submissionId: string }) {
  const [price, setPrice] = useState(0)
  const [concept, setConcept] = useState(0)
  const [compliance, setCompliance] = useState(0)
  const [experience, setExperience] = useState(0)
  const [fit, setFit] = useState(0)
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await scoreSubmissionAction({
        rfqId,
        submissionId,
        comments,
        scores: {
          pricing: price,
          concept,
          compliance,
          experience,
          fit,
        },
        criteria: [
          { name: "pricing", weight: 30 },
          { name: "concept", weight: 25 },
          { name: "compliance", weight: 20 },
          { name: "experience", weight: 15 },
          { name: "fit", weight: 10 },
        ],
      })
      notifyActionResult(result, {
        successMessage: "Submission scored",
        errorMessage: "Failed to score submission",
      })
    } catch {
      notifyUnexpectedError("score submission")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 border rounded-lg p-4">
      <h3 className="font-semibold">Score Submission</h3>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Pricing</Label><Input type="number" min={0} max={10} value={price} onChange={(e) => setPrice(Number(e.target.value))} /></div>
        <div><Label>Concept</Label><Input type="number" min={0} max={10} value={concept} onChange={(e) => setConcept(Number(e.target.value))} /></div>
        <div><Label>Compliance</Label><Input type="number" min={0} max={10} value={compliance} onChange={(e) => setCompliance(Number(e.target.value))} /></div>
        <div><Label>Experience</Label><Input type="number" min={0} max={10} value={experience} onChange={(e) => setExperience(Number(e.target.value))} /></div>
        <div><Label>Fit</Label><Input type="number" min={0} max={10} value={fit} onChange={(e) => setFit(Number(e.target.value))} /></div>
      </div>
      <div>
        <Label>Comments</Label>
        <Textarea value={comments} onChange={(e) => setComments(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Score"}</Button>
    </form>
  )
}
