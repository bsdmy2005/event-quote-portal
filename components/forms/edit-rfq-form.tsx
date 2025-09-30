"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileUpload } from "@/components/ui/file-upload"
import { CalendarIcon, Plus, X, Upload, FileText } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { updateRfqAction, updateRfqAttachmentsAction } from "@/actions/rfqs-actions"
import { uploadRfqAttachment, validateRfqAttachmentFile } from "@/lib/supabase-storage"
import { toast } from "sonner"
import { SelectRfq } from "@/db/schema/rfqs-schema"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  path?: string
  file?: File // Store the actual File object for uploads
}

interface EditRfqFormProps {
  rfq: SelectRfq
  className?: string
}

export function EditRfqForm({ rfq, className }: EditRfqFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [eventDates, setEventDates] = useState<{
    start: string
    end: string
  } | null>(rfq.eventDates || null)
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date(rfq.deadlineAt))
  const [formData, setFormData] = useState({
    title: rfq.title,
    clientName: rfq.clientName,
    venue: rfq.venue || "",
    scope: rfq.scope
  })

  // Initialize uploaded files from existing attachments
  useEffect(() => {
    if (rfq.attachmentsUrl && rfq.attachmentsUrl.length > 0) {
      const existingFiles: UploadedFile[] = rfq.attachmentsUrl.map((url, index) => {
        // Extract filename from URL if possible
        const urlParts = url.split('/')
        const filename = urlParts[urlParts.length - 1] || `Attachment ${index + 1}`
        
        // Try to determine file type from URL
        let fileType = "application/pdf" // Default
        if (filename.includes('.jpg') || filename.includes('.jpeg')) {
          fileType = "image/jpeg"
        } else if (filename.includes('.png')) {
          fileType = "image/png"
        } else if (filename.includes('.doc')) {
          fileType = "application/msword"
        } else if (filename.includes('.docx')) {
          fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }

        return {
          id: `existing-${index}`,
          name: filename,
          size: 0, // We don't have size info for existing files
          type: fileType,
          url: url
        }
      })
      setUploadedFiles(existingFiles)
    }
  }, [rfq.attachmentsUrl])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = async (file: File): Promise<{ success: boolean; data?: UploadedFile; error?: string }> => {
    try {
      // Validate file first
      const validation = validateRfqAttachmentFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Create a temporary file object with the actual File object
      const tempFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file // Store the actual File object for later upload
      }
      
      return { success: true, data: tempFile }
    } catch (error) {
      return { success: false, error: 'Failed to process file' }
    }
  }

  const handleFileDelete = async (fileId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Find the file to delete
      const fileToDelete = uploadedFiles.find(f => f.id === fileId)
      if (!fileToDelete) {
        return { success: false, error: 'File not found' }
      }

      // If it's an existing file (has URL), we need to handle it differently
      if (fileToDelete.url) {
        // For existing files, we'll just remove them from the list
        // The actual deletion from storage will happen when the form is submitted
        return { success: true }
      }

      // For new files, just remove from the list
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete file' }
    }
  }

  const handleEventDateChange = (field: "start" | "end", value: string) => {
    setEventDates(prev => {
      if (!prev) {
        return field === "start" ? { start: value, end: "" } : { start: "", end: value }
      }
      return {
        ...prev,
        [field]: value
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.clientName || !formData.scope || !deadlineDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Update RFQ with basic information
      const result = await updateRfqAction(rfq.id, {
        title: formData.title,
        clientName: formData.clientName,
        eventDates: eventDates || undefined,
        venue: formData.venue || undefined,
        scope: formData.scope,
        deadlineAt: deadlineDate.toISOString()
      })

      if (!result.isSuccess) {
        toast.error(result.message)
        return
      }

      // Handle file management
      const existingFiles = uploadedFiles.filter(file => file.url) // Files with URLs are existing
      const newFiles = uploadedFiles.filter(file => !file.url) // Files without URLs are new
      const attachmentsUrl: string[] = []

      // Keep existing files that are still in the list
      existingFiles.forEach(file => {
        if (file.url) {
          attachmentsUrl.push(file.url)
        }
      })

      // Upload new files if any
      if (newFiles.length > 0) {
        toast.info("Uploading new files...")
        
        for (const uploadedFile of newFiles) {
          // Use the actual File object stored during upload
          if (!uploadedFile.file) {
            toast.error(`No file data for ${uploadedFile.name}`)
            continue
          }
          
          const uploadResult = await uploadRfqAttachment(uploadedFile.file, rfq.id)
          
          if (uploadResult.success && uploadResult.data) {
            attachmentsUrl.push(uploadResult.data.url)
          } else {
            toast.error(`Failed to upload ${uploadedFile.name}: ${uploadResult.error}`)
          }
        }
      }

      // Update RFQ with all attachment URLs (existing + new)
      if (attachmentsUrl.length !== (rfq.attachmentsUrl?.length || 0) || newFiles.length > 0) {
        const updateResult = await updateRfqAttachmentsAction(rfq.id, attachmentsUrl)
        if (updateResult.isSuccess) {
          if (newFiles.length > 0) {
            toast.success(`${newFiles.length} new file(s) uploaded successfully`)
          }
          if (existingFiles.length !== (rfq.attachmentsUrl?.length || 0)) {
            toast.success("File list updated successfully")
          }
        } else {
          toast.error(`Failed to update RFQ with attachments: ${updateResult.message}`)
        }
      }

      toast.success("RFQ updated successfully")
      router.push(`/rfqs/${rfq.id}`)
    } catch (error) {
      console.error("Error updating RFQ:", error)
      toast.error("Failed to update RFQ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>Edit RFQ</CardTitle>
        <CardDescription>
          Update your Request for Quote details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">RFQ Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Corporate Event Catering"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="e.g., ABC Corporation"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Event Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventStart">Event Start Date</Label>
                <Input
                  id="eventStart"
                  type="date"
                  value={eventDates?.start || ""}
                  onChange={(e) => handleEventDateChange("start", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventEnd">Event End Date</Label>
                <Input
                  id="eventEnd"
                  type="date"
                  value={eventDates?.end || ""}
                  onChange={(e) => handleEventDateChange("end", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue/Location</Label>
              <Input
                id="venue"
                placeholder="e.g., Convention Center, Downtown"
                value={formData.venue}
                onChange={(e) => handleInputChange("venue", e.target.value)}
              />
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label htmlFor="scope">Project Scope *</Label>
            <Textarea
              id="scope"
              placeholder="Describe the project requirements, specifications, and any special requests..."
              value={formData.scope}
              onChange={(e) => handleInputChange("scope", e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Attachments</h3>
            
            {/* Upload Status Debug Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Status</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Total Files:</strong> {uploadedFiles.length}</p>
                <p><strong>Existing Files:</strong> {uploadedFiles.filter(f => f.url).length}</p>
                <p><strong>New Files:</strong> {uploadedFiles.filter(f => !f.url).length}</p>
                <p><strong>Storage Location:</strong> Supabase bucket: <code className="bg-gray-200 px-1 rounded">rfq-attachments</code></p>
                <p><strong>Storage Path:</strong> <code className="bg-gray-200 px-1 rounded">rfq/{rfq.id}/</code></p>
              </div>
            </div>
            
            <FileUpload
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
              onFileUpload={handleFileUpload}
              onFileDelete={handleFileDelete}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={20 * 1024 * 1024} // 20MB
              maxFiles={10}
              allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']}
              label="Reference Documents"
              description="Upload reference documents, specifications, or images"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Response Deadline *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadlineDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadlineDate ? format(deadlineDate, "PPP") : "Select deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadlineDate}
                  onSelect={(date) => date && setDeadlineDate(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update RFQ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
