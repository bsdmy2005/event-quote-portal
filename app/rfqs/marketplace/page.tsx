"use server"

import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getPublishedRfqsForSupplierAction } from "@/actions/rfqs-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function MarketplacePage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const result = await getPublishedRfqsForSupplierAction()
  const rfqs = result.isSuccess ? result.data || [] : []

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">RFQ Marketplace</h1>
        <p className="text-slate-600">Published opportunities with NDA-gated brief access.</p>

        {rfqs.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-slate-600">No published RFQs available.</CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {rfqs.map((rfq) => (
              <Card key={rfq.id}>
                <CardHeader>
                  <CardTitle>{rfq.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-slate-600">Client: {rfq.clientName}</div>
                  <div className="text-sm text-slate-600">Deadline: {new Date(rfq.deadlineAt).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href={`/rfqs/marketplace/${rfq.id}`}>View Teaser</Link></Button>
                    <Button asChild><Link href={`/rfqs/marketplace/${rfq.id}/brief`}>Open Brief</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
