"use server"

import { Suspense } from "react"
import { getSupplierByIdWithImagesAction } from "@/actions/organizations-actions"
import { SupplierDetail } from "./_components/supplier-detail"
import { SupplierDetailSkeleton } from "./_components/supplier-detail-skeleton"
import { notFound } from "next/navigation"

interface SupplierPageProps {
  params: {
    id: string
  }
}

export default async function SupplierPage({ params }: SupplierPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Suspense fallback={<SupplierDetailSkeleton />}>
        <SupplierDetailFetcher supplierId={params.id} />
      </Suspense>
    </div>
  )
}

async function SupplierDetailFetcher({ supplierId }: { supplierId: string }) {
  const result = await getSupplierByIdWithImagesAction(supplierId)
  
  if (!result.isSuccess || !result.data) {
    notFound()
  }

  return <SupplierDetail supplier={result.data} />
}
