"use server"

import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getRfqByIdAction } from "@/actions/rfqs-actions"
import { getParticipationAction } from "@/actions/rfq-participations-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function MarketplaceRfqBriefPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const rfqRes = await getRfqByIdAction(params.id)
  if (!rfqRes.isSuccess || !rfqRes.data) redirect("/rfqs/marketplace")

  const participationRes = await getParticipationAction(params.id)
  const participation = participationRes.isSuccess ? participationRes.data : null

  const blocked = rfqRes.data.ndaRequired && !participation?.ndaAccepted

  if (blocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader><CardTitle>Brief Locked</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">You must accept NDA before accessing this brief.</p>
            <Button asChild><Link href={`/rfqs/marketplace/${params.id}`}>Back to Teaser</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">{rfqRes.data.title}</h1>
      <Card>
        <CardHeader><CardTitle>Full Brief</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 whitespace-pre-wrap">{rfqRes.data.scope}</p>
          <div className="flex gap-2">
            <Button asChild><Link href="/rfqs/received">Go to Received RFQs</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
