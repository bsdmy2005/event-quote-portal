"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getRfqInviteByIdAction } from "@/actions/rfq-invites-actions"
import { getRfqByIdAction } from "@/actions/rfqs-actions"
import { SubmitProposalForm } from "@/components/forms/submit-proposal-form"

export default async function RespondToRfqPage({ params }: { params: { inviteId: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const inviteRes = await getRfqInviteByIdAction(params.inviteId)
  if (!inviteRes.isSuccess || !inviteRes.data) redirect("/rfqs/received")

  const rfqRes = await getRfqByIdAction(inviteRes.data.rfqId)
  if (!rfqRes.isSuccess || !rfqRes.data) redirect("/rfqs/received")

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Respond to RFQ</h1>
      <p className="text-slate-600">{rfqRes.data.title}</p>
      <SubmitProposalForm rfqId={rfqRes.data.id} inviteId={params.inviteId} />
    </div>
  )
}
