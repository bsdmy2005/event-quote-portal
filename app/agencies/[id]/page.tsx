"use server"

import { Suspense } from "react"
import { getAgencyByIdWithImagesAction } from "@/actions/organizations-actions"
import { AgencyDetail } from "./_components/agency-detail"
import { AgencyDetailSkeleton } from "./_components/agency-detail-skeleton"
import { notFound } from "next/navigation"

interface AgencyPageProps {
  params: {
    id: string
  }
}

export default async function AgencyPage({ params }: AgencyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Suspense fallback={<AgencyDetailSkeleton />}>
        <AgencyDetailFetcher agencyId={params.id} />
      </Suspense>
    </div>
  )
}

async function AgencyDetailFetcher({ agencyId }: { agencyId: string }) {
  const result = await getAgencyByIdWithImagesAction(agencyId)
  
  if (!result.isSuccess || !result.data) {
    notFound()
  }

  return <AgencyDetail agency={result.data} />
}
