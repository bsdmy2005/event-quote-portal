"use server"

import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getRfqByIdAction } from "@/actions/rfqs-actions"
import { acceptNdaAction, expressInterestAction, getParticipationAction } from "@/actions/rfq-participations-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function MarketplaceRfqTeaserPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const rfqRes = await getRfqByIdAction(params.id)
  if (!rfqRes.isSuccess || !rfqRes.data) redirect("/rfqs/marketplace")

  const participationRes = await getParticipationAction(params.id)
  const participation = participationRes.isSuccess ? participationRes.data : null

  async function interestAction() {
    "use server"
    await expressInterestAction(params.id)
  }

  async function ndaAction() {
    "use server"
    await acceptNdaAction(params.id)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">{rfqRes.data.title}</h1>
      <Card>
        <CardHeader><CardTitle>Teaser Summary</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 whitespace-pre-wrap">{rfqRes.data.teaserSummary || rfqRes.data.scope}</p>
          <p className="text-sm text-slate-600">NDA Required: {rfqRes.data.ndaRequired ? "Yes" : "No"}</p>
          <div className="flex gap-2">
            <form action={interestAction}><Button variant="outline" type="submit">Express Interest</Button></form>
            {rfqRes.data.ndaRequired && !participation?.ndaAccepted && (
              <form action={ndaAction}><Button type="submit">Accept NDA</Button></form>
            )}
            <Button asChild variant="secondary"><Link href={`/rfqs/marketplace/${params.id}/brief`}>Continue to Brief</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
