"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getRfqByIdAction } from "@/actions/rfqs-actions"
import { getSubmissionsByRfqAction } from "@/actions/rfq-submissions-actions"
import { getEvaluationsByRfqAction, getAwardByRfqAction } from "@/actions/rfq-evaluations-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreSubmissionForm } from "@/components/forms/score-submission-form"
import { AwardRfqForm } from "@/components/forms/award-rfq-form"

export default async function RfqEvaluationPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const rfqRes = await getRfqByIdAction(params.id)
  if (!rfqRes.isSuccess || !rfqRes.data) redirect("/rfqs")

  const submissionsRes = await getSubmissionsByRfqAction(params.id)
  const evaluationsRes = await getEvaluationsByRfqAction(params.id)
  const awardRes = await getAwardByRfqAction(params.id)

  const submissions = submissionsRes.isSuccess ? submissionsRes.data || [] : []
  const evaluations = evaluationsRes.isSuccess ? evaluationsRes.data || [] : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Evaluation: {rfqRes.data.title}</h1>

      <Card>
        <CardHeader><CardTitle>Submissions ({submissions.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-slate-600">No submissions received yet.</p>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="space-y-3 border rounded-lg p-4">
                <div className="text-sm text-slate-600">Submission ID: {submission.id}</div>
                <div className="text-sm text-slate-600">Status: {submission.submissionStatus}</div>
                <ScoreSubmissionForm rfqId={params.id} submissionId={submission.id} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Award</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {awardRes.isSuccess && awardRes.data && (
            <div className="text-sm text-green-700">Current winner submission: {awardRes.data.winnerSubmissionId}</div>
          )}
          <AwardRfqForm rfqId={params.id} submissionIds={submissions.map((s) => s.id)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Scoring Records ({evaluations.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {evaluations.map((ev) => (
              <div key={ev.id} className="text-sm text-slate-700 border rounded p-2">
                Submission: {ev.submissionId} | Weighted: {ev.weightedTotal}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
