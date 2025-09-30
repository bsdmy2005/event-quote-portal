"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SupplierSelectionForm } from "@/components/forms/supplier-selection-form"
import { sendRfqAction } from "@/actions/rfqs-actions"
import { getAllSuppliersAction } from "@/actions/organizations-actions"
import { Building2, Calendar, Clock, FileText, Users, Mail, Send } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { SelectRfq } from "@/db/schema/rfqs-schema"

interface SendRfqFormProps {
  rfq: SelectRfq
  className?: string
}

export function SendRfqForm({ rfq, className }: SendRfqFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      const result = await getAllSuppliersAction()
      if (result.isSuccess && result.data) {
        setSuppliers(result.data)
      }
    } catch (error) {
      console.error("Error loading suppliers:", error)
    }
  }

  const handleSupplierSelection = (supplierIds: string[]) => {
    setSelectedSuppliers(supplierIds)
  }

  const handleSendRfq = async () => {
    if (selectedSuppliers.length === 0) {
      toast.error("Please select at least one supplier")
      return
    }

    setIsLoading(true)

    try {
      // Send RFQ to selected suppliers
      const result = await sendRfqAction(rfq.id, selectedSuppliers)
      
      if (result.isSuccess) {
        toast.success(`RFQ sent to ${selectedSuppliers.length} supplier(s) successfully`)
        router.push(`/rfqs/${rfq.id}`)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error sending RFQ:", error)
      toast.error("Failed to send RFQ")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedSuppliersData = suppliers.filter(s => selectedSuppliers.includes(s.id))

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RFQ Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                RFQ Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{rfq.title}</h3>
                <p className="text-sm text-gray-600">Client: {rfq.clientName}</p>
              </div>

              {rfq.eventDates && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(rfq.eventDates.start).toLocaleDateString()} - {new Date(rfq.eventDates.end).toLocaleDateString()}
                  </span>
                </div>
              )}

              {rfq.venue && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{rfq.venue}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Deadline: {format(new Date(rfq.deadlineAt), "PPP 'at' p")}</span>
              </div>

              {rfq.attachmentsUrl && rfq.attachmentsUrl.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{rfq.attachmentsUrl.length} attachment(s)</span>
                </div>
              )}

              <Separator />

              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-2">Project Scope:</p>
                <p className="text-gray-600 line-clamp-4">{rfq.scope}</p>
              </div>
            </CardContent>
          </Card>

          {/* Selected Suppliers Summary */}
          {selectedSuppliersData.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Selected Suppliers ({selectedSuppliersData.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSuppliersData.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{supplier.name}</p>
                        <p className="text-xs text-gray-500">{supplier.contactName}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {supplier.serviceCategories?.length || 0} services
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Supplier Selection */}
        <div className="lg:col-span-2">
          <SupplierSelectionForm
            selectedSuppliers={selectedSuppliers}
            onSelectionChange={handleSupplierSelection}
          />

          {/* Send Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSendRfq}
              disabled={isLoading || selectedSuppliers.length === 0}
              size="lg"
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send to {selectedSuppliers.length} Supplier{selectedSuppliers.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
