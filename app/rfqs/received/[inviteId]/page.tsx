"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getRfqInviteByIdAction, updateRfqInviteStatusAction } from "@/actions/rfq-invites-actions"
import { getRfqByIdAction } from "@/actions/rfqs-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function ReceivedRfqDetailPage({ params }: { params: { inviteId: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const inviteRes = await getRfqInviteByIdAction(params.inviteId)
  if (!inviteRes.isSuccess || !inviteRes.data) redirect("/rfqs/received")

  const rfqRes = await getRfqByIdAction(inviteRes.data.rfqId)
  if (!rfqRes.isSuccess || !rfqRes.data) redirect("/rfqs/received")

  if (inviteRes.data.inviteStatus === "invited") {
    await updateRfqInviteStatusAction(params.inviteId, "opened")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">{rfqRes.data.title}</h1>
      <Card>
        <CardHeader><CardTitle>RFQ Brief</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">Client: {rfqRes.data.clientName}</p>
          <p className="text-sm text-slate-600">Deadline: {new Date(rfqRes.data.deadlineAt).toLocaleString()}</p>
          <p className="whitespace-pre-wrap text-slate-700">{rfqRes.data.scope}</p>
          <div className="flex gap-2">
            <Button asChild><Link href={`/rfqs/received/${params.inviteId}/respond`}>Submit Proposal</Link></Button>
            <Button asChild variant="outline"><Link href="/rfqs/received">Back</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
