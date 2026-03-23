"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { awardSubmissionAction } from "@/actions/rfq-evaluations-actions"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

export function AwardRfqForm({ rfqId, submissionIds }: { rfqId: string; submissionIds: string[] }) {
  const [winner, setWinner] = useState(submissionIds[0] || "")
  const [runnerUp, setRunnerUp] = useState("")
  const [contractValue, setContractValue] = useState(0)
  const [awardedBudget, setAwardedBudget] = useState(0)
  const [awardReason, setAwardReason] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await awardSubmissionAction({
        rfqId,
        winnerSubmissionId: winner,
        runnerUpSubmissionId: runnerUp || undefined,
        contractValue,
        awardedBudget,
        awardReason,
      })
      notifyActionResult(res, {
        successMessage: "Award recorded",
        errorMessage: "Failed to record award",
      })
    } catch {
      notifyUnexpectedError("record award")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 border rounded-lg p-4">
      <h3 className="font-semibold">Award Decision</h3>
      <div>
        <Label>Winner Submission ID</Label>
        <Input value={winner} onChange={(e) => setWinner(e.target.value)} required />
      </div>
      <div>
        <Label>Runner-Up Submission ID</Label>
        <Input value={runnerUp} onChange={(e) => setRunnerUp(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Contract Value</Label><Input type="number" value={contractValue} onChange={(e) => setContractValue(Number(e.target.value))} /></div>
        <div><Label>Awarded Budget</Label><Input type="number" value={awardedBudget} onChange={(e) => setAwardedBudget(Number(e.target.value))} /></div>
      </div>
      <div>
        <Label>Reason</Label>
        <Textarea value={awardReason} onChange={(e) => setAwardReason(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Award"}</Button>
    </form>
  )
}
