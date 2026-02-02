"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { STORAGE_FOLDERS } from "@/lib/r2-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Initialize R2 client for server-side use
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const bucketName = process.env.R2_BUCKET_NAME!
const publicUrl = process.env.R2_PUBLIC_URL!

async function listFiles(prefix: string) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: 100,
    })
    const response = await r2Client.send(command)
    return { data: response.Contents || [], error: null }
  } catch (error) {
    console.error(`Error listing files in ${prefix}:`, error)
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export default async function StorageDebugPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get all files from each folder
  const [rfqResult, quotationResult, agencyResult, supplierResult] = await Promise.all([
    listFiles(STORAGE_FOLDERS.RFQ_ATTACHMENTS),
    listFiles(STORAGE_FOLDERS.QUOTATIONS),
    listFiles(STORAGE_FOLDERS.AGENCY_IMAGES),
    listFiles(STORAGE_FOLDERS.SUPPLIER_IMAGES),
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cloudflare R2 Storage Debug</h1>
        <p className="text-gray-600 mt-2">
          View all files uploaded to Cloudflare R2 storage
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Bucket: {bucketName} | Public URL: {publicUrl}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFQ Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="outline" className="mr-2">{STORAGE_FOLDERS.RFQ_ATTACHMENTS}</Badge>
              RFQ Attachments
            </CardTitle>
            <CardDescription>
              Files uploaded with RFQ forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rfqResult.error ? (
              <p className="text-red-600">Error: {rfqResult.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {rfqResult.data.length}
                </p>
                {rfqResult.data.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {rfqResult.data.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.Key}</p>
                          <p className="text-xs text-gray-500">
                            {file.Size ? `${(file.Size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <a
                          href={`${publicUrl}/${file.Key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
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
              <Badge variant="outline" className="mr-2">{STORAGE_FOLDERS.QUOTATIONS}</Badge>
              Quotations
            </CardTitle>
            <CardDescription>
              Files uploaded with quotations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quotationResult.error ? (
              <p className="text-red-600">Error: {quotationResult.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {quotationResult.data.length}
                </p>
                {quotationResult.data.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {quotationResult.data.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.Key}</p>
                          <p className="text-xs text-gray-500">
                            {file.Size ? `${(file.Size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <a
                          href={`${publicUrl}/${file.Key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
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
              <Badge variant="outline" className="mr-2">{STORAGE_FOLDERS.AGENCY_IMAGES}</Badge>
              Agency Images
            </CardTitle>
            <CardDescription>
              Profile and gallery images for agencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agencyResult.error ? (
              <p className="text-red-600">Error: {agencyResult.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {agencyResult.data.length}
                </p>
                {agencyResult.data.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {agencyResult.data.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.Key}</p>
                          <p className="text-xs text-gray-500">
                            {file.Size ? `${(file.Size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <a
                          href={`${publicUrl}/${file.Key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
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
              <Badge variant="outline" className="mr-2">{STORAGE_FOLDERS.SUPPLIER_IMAGES}</Badge>
              Supplier Images
            </CardTitle>
            <CardDescription>
              Profile and gallery images for suppliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {supplierResult.error ? (
              <p className="text-red-600">Error: {supplierResult.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total files: {supplierResult.data.length}
                </p>
                {supplierResult.data.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {supplierResult.data.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.Key}</p>
                          <p className="text-xs text-gray-500">
                            {file.Size ? `${(file.Size / 1024).toFixed(1)} KB` : 'Unknown size'}
                          </p>
                        </div>
                        <a
                          href={`${publicUrl}/${file.Key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
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
