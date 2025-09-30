"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabase, STORAGE_BUCKETS } from "@/lib/supabase-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Download } from "lucide-react"

export default async function StorageDebugPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  // Get all files from RFQ attachments bucket
  const { data: rfqFiles, error: rfqError } = await supabase.storage
    .from(STORAGE_BUCKETS.RFQ_ATTACHMENTS)
    .list('', {
      limit: 100,
      offset: 0,
    })

  // Get all files from quotations bucket
  const { data: quotationFiles, error: quotationError } = await supabase.storage
    .from(STORAGE_BUCKETS.QUOTATIONS)
    .list('', {
      limit: 100,
      offset: 0,
    })

  // Get all files from agency images bucket
  const { data: agencyFiles, error: agencyError } = await supabase.storage
    .from(STORAGE_BUCKETS.AGENCY_IMAGES)
    .list('', {
      limit: 100,
      offset: 0,
    })

  // Get all files from supplier images bucket
  const { data: supplierFiles, error: supplierError } = await supabase.storage
    .from(STORAGE_BUCKETS.SUPPLIER_IMAGES)
    .list('', {
      limit: 100,
      offset: 0,
    })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Supabase Storage Debug</h1>
        <p className="text-gray-600 mt-2">
          View all files uploaded to Supabase storage buckets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFQ Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">rfq-attachments</Badge>
              RFQ Attachments
            </CardTitle>
            <CardDescription>
              Files uploaded with RFQ forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rfqError ? (
              <p className="text-red-600">Error: {rfqError.message}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {rfqFiles?.length || 0}
                </p>
                {rfqFiles && rfqFiles.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {rfqFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const url = supabase.storage
                                .from(STORAGE_BUCKETS.RFQ_ATTACHMENTS)
                                .getPublicUrl(file.name).data.publicUrl
                              window.open(url, '_blank')
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No files found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quotations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">quotations</Badge>
              Quotations
            </CardTitle>
            <CardDescription>
              Files uploaded with quotations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quotationError ? (
              <p className="text-red-600">Error: {quotationError.message}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {quotationFiles?.length || 0}
                </p>
                {quotationFiles && quotationFiles.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {quotationFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const url = supabase.storage
                                .from(STORAGE_BUCKETS.QUOTATIONS)
                                .getPublicUrl(file.name).data.publicUrl
                              window.open(url, '_blank')
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No files found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agency Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">agency-images</Badge>
              Agency Images
            </CardTitle>
            <CardDescription>
              Profile and gallery images for agencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agencyError ? (
              <p className="text-red-600">Error: {agencyError.message}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {agencyFiles?.length || 0}
                </p>
                {agencyFiles && agencyFiles.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {agencyFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const url = supabase.storage
                                .from(STORAGE_BUCKETS.AGENCY_IMAGES)
                                .getPublicUrl(file.name).data.publicUrl
                              window.open(url, '_blank')
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No files found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supplier Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">supplier-images</Badge>
              Supplier Images
            </CardTitle>
            <CardDescription>
              Profile and gallery images for suppliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {supplierError ? (
              <p className="text-red-600">Error: {supplierError.message}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {supplierFiles?.length || 0}
                </p>
                {supplierFiles && supplierFiles.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {supplierFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const url = supabase.storage
                                .from(STORAGE_BUCKETS.SUPPLIER_IMAGES)
                                .getPublicUrl(file.name).data.publicUrl
                              window.open(url, '_blank')
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No files found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
