"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createSubmissionDraftAction, submitProposalAction, uploadSubmissionDocumentAction } from "@/actions/rfq-submissions-actions"
import { fileToBase64 } from "@/lib/r2-storage"
import { toast } from "sonner"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

export function SubmitProposalForm({ rfqId, inviteId }: { rfqId: string; inviteId?: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error("Please upload a proposal document")
      return
    }

    setIsSubmitting(true)
    try {
      const draft = await createSubmissionDraftAction(rfqId, inviteId)
      if (!notifyActionResult(draft, { errorMessage: "Failed to create submission draft" }) || !draft.data) {
        return
      }

      const base64Data = await fileToBase64(file)
      const doc = await uploadSubmissionDocumentAction({
        submissionId: draft.data.id,
        docType: "proposal",
        base64Data,
        fileName: file.name,
        fileType: file.type || "application/pdf",
        fileSize: file.size,
      })

      if (!notifyActionResult(doc, { errorMessage: "Failed to upload proposal document", silentSuccess: true })) {
        return
      }

      const submit = await submitProposalAction(draft.data.id, notes)
      if (!notifyActionResult(submit, { successMessage: "Proposal submitted", errorMessage: "Failed to submit proposal" })) {
        return
      }
      router.push("/rfqs/received")
    } catch (error) {
      notifyUnexpectedError("submit proposal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Submit Proposal</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proposal-file">Proposal File (PDF recommended)</Label>
            <input
              id="proposal-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for agency/procurement team"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
