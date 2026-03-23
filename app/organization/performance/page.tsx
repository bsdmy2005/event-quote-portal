"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getSupplierRankingsAction } from "@/actions/supplier-analytics-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function OrganizationPerformancePage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const rankingsRes = await getSupplierRankingsAction()
  const rows = rankingsRes.isSuccess ? rankingsRes.data?.rows || [] : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Supplier Performance & Rankings</h1>

      <Card>
        <CardHeader><CardTitle>Rankings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rows.map((row: any) => (
              <div key={row.supplierId} className="border rounded p-3 text-sm">
                <div>Supplier ID: {row.supplierId}</div>
                <div>Win Rate: {row.winRate} | Shortlist Rate: {row.shortlistRate}</div>
                <div>Wins: {row.winsTotal} | Submissions: {row.submissionsTotal}</div>
              </div>
            ))}
            {rows.length === 0 && <p className="text-slate-600">No supplier metrics available yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
