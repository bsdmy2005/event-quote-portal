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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createRfqAction, updateRfqAttachmentsAction } from "@/actions/rfqs-actions"
import { getAllCategoriesAction } from "@/actions/categories-actions"
import { uploadRfqAttachment, validateRfqAttachmentFile } from "@/lib/r2-storage"
import { toast } from "sonner"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

interface CreateRfqFormProps {
  className?: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  path?: string
  file?: File // Store the actual File object for uploads
}

export function CreateRfqForm({ className }: CreateRfqFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [eventDates, setEventDates] = useState<{
    start: string
    end: string
  } | null>(null)
  const [deadlineDate, setDeadlineDate] = useState<Date>()
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [categorySearch, setCategorySearch] = useState("")
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    venue: "",
    scope: "",
    projectType: "physical_event",
    ndaRequired: false,
    teaserSummary: "",
  })

  useEffect(() => {
    async function fetchCategories() {
      setCategoriesLoading(true)
      const result = await getAllCategoriesAction()
      if (result.isSuccess && result.data) {
        setCategories(result.data.map(c => ({ id: c.id, name: c.name })))
      }
      setCategoriesLoading(false)
    }
    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const toggleService = (name: string) => {
    setSelectedServices(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDateForInput = (date?: Date) => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const parseDeadlineDate = (value: string) => {
    if (!value) {
      setDeadlineDate(undefined)
      return
    }
    // Noon local time avoids edge-case timezone rollover on midnight.
    const parsed = new Date(`${value}T12:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      setDeadlineDate(parsed)
    }
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
      // First create the RFQ to get the ID
      const result = await createRfqAction({
        title: formData.title,
        clientName: formData.clientName,
        eventDates: eventDates || undefined,
        venue: formData.venue || undefined,
        scope: formData.scope,
        projectType: formData.projectType as any,
        ndaRequired: formData.ndaRequired,
        teaserSummary: formData.teaserSummary || undefined,
        requiredServices: selectedServices.length > 0 ? selectedServices : undefined,
        attachmentsUrl: [], // Will be updated after file uploads
        deadlineAt: deadlineDate.toISOString()
      })

      if (
        !notifyActionResult(result, {
          successMessage: "RFQ created successfully",
          errorMessage: "Failed to create RFQ",
          silentSuccess: true,
        }) ||
        !result.data
      ) {
        return
      }

      const rfqId = result.data.id
      const attachmentsUrl: string[] = []

      // Upload files if any
      if (uploadedFiles.length > 0) {
        toast.info("Uploading files...")
        
        for (const uploadedFile of uploadedFiles) {
          // Use the actual File object stored during upload
          if (!uploadedFile.file) {
            toast.error(`No file data for ${uploadedFile.name}`)
            continue
          }
          
          const uploadResult = await uploadRfqAttachment(uploadedFile.file, rfqId)
          
          if (uploadResult.success && uploadResult.data) {
            attachmentsUrl.push(uploadResult.data.url)
          } else {
            toast.error(`Failed to upload ${uploadedFile.name}: ${uploadResult.error}`)
          }
        }

        // Update RFQ with attachment URLs if any were uploaded
        if (attachmentsUrl.length > 0) {
          const updateResult = await updateRfqAttachmentsAction(rfqId, attachmentsUrl)
          notifyActionResult(updateResult, {
            successMessage: `${attachmentsUrl.length} file(s) uploaded successfully`,
            errorMessage: `Failed to update RFQ with attachments: ${updateResult.message || "unknown error"}`,
          })
        }
      }

      try {
        localStorage.setItem("rfqCreationSuccess", JSON.stringify({
          rfqId,
          title: formData.title,
          at: new Date().toISOString()
        }))
      } catch (e) {
        // Non-blocking: local storage may be unavailable in some contexts.
      }

      notifyActionResult({ isSuccess: true, message: "RFQ created successfully" })
      router.push(`/rfqs/${rfqId}`)
    } catch (error) {
      console.error("Error creating RFQ:", error)
      notifyUnexpectedError("create RFQ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>Create New RFQ</CardTitle>
        <CardDescription>
          Create a new Request for Quote to send to suppliers
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => handleInputChange("projectType", e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="physical_event">Physical Event</option>
                <option value="digital_campaign">Digital Campaign</option>
                <option value="brand_activation">Brand Activation</option>
                <option value="conference_expo">Conference/Expo</option>
                <option value="hybrid">Hybrid</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Required Services */}
          <div className="space-y-2">
            <Label>Required Services</Label>
            <Input
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-2 border rounded-md">
              {categoriesLoading ? (
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              ) : filteredCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories found</p>
              ) : (
                filteredCategories.map(cat => (
                  <Badge
                    key={cat.id}
                    variant={selectedServices.includes(cat.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleService(cat.name)}
                  >
                    {cat.name}
                  </Badge>
                ))
              )}
            </div>
            <p className="text-sm text-muted-foreground">{selectedServices.length} categories selected</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teaserSummary">Teaser Summary (for marketplace)</Label>
            <Textarea
              id="teaserSummary"
              placeholder="Short public summary shown before NDA acceptance"
              value={formData.teaserSummary}
              onChange={(e) => handleInputChange("teaserSummary", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="ndaRequired"
              type="checkbox"
              checked={formData.ndaRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, ndaRequired: e.target.checked }))}
            />
            <Label htmlFor="ndaRequired">Require NDA before full brief access</Label>
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Attachments</h3>
            
            {/* Upload Status Debug Info */}
            <div className="bg-slate-100 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Upload Status</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Selected Files:</strong> {uploadedFiles.length}</p>
                <p><strong>Storage Location:</strong> Supabase bucket: <code className="bg-slate-200 px-1 rounded">rfq-attachments</code></p>
                <p><strong>Storage Path:</strong> <code className="bg-slate-200 px-1 rounded">rfq/[rfq-id]/</code></p>
                <p><strong>File Types:</strong> PDF, DOC, DOCX, JPG, PNG (max 20MB each)</p>
              </div>
            </div>
            
            <FileUpload
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
              onFileUpload={handleFileUpload}
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
            <Input
              id="deadline-date-input"
              type="date"
              min={formatDateForInput(new Date())}
              value={formatDateForInput(deadlineDate)}
              onChange={(e) => parseDeadlineDate(e.target.value)}
            />
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
                  onSelect={(date) => setDeadlineDate(date)}
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
              {isLoading ? "Creating..." : "Create RFQ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
