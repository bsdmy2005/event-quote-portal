"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X, Download, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  path?: string
}

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  onFileUpload: (file: File) => Promise<{ success: boolean; data?: UploadedFile; error?: string }>
  onFileDelete?: (fileId: string) => Promise<{ success: boolean; error?: string }>
  accept?: string
  maxSize?: number
  maxFiles?: number
  allowedTypes?: string[]
  className?: string
  disabled?: boolean
  label?: string
  description?: string
}

export function FileUpload({
  files,
  onFilesChange,
  onFileUpload,
  onFileDelete,
  accept = "*/*",
  maxSize = 20 * 1024 * 1024, // 20MB default
  maxFiles = 10,
  allowedTypes = [],
  className,
  disabled = false,
  label = "Upload Files",
  description = "Click to upload files or drag and drop"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { valid: false, error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` }
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB` }
    }

    if (files.length >= maxFiles) {
      return { valid: false, error: `Maximum ${maxFiles} files allowed` }
    }

    return { valid: true }
  }

  const handleFileSelect = async (selectedFiles: File[]) => {
    if (disabled) return

    const validFiles: File[] = []
    const invalidFiles: string[] = []

    selectedFiles.forEach(file => {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        invalidFiles.push(`${file.name}: ${validation.error}`)
      }
    })

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`)
    }

    if (validFiles.length === 0) return

    setIsUploading(true)

    try {
      for (const file of validFiles) {
        const result = await onFileUpload(file)
        
        if (result.success && result.data) {
          onFilesChange([...files, result.data])
        } else {
          toast.error(`Failed to upload ${file.name}: ${result.error}`)
        }
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    handleFileSelect(selectedFiles)
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileSelect(droppedFiles)
  }

  const handleRemoveFile = async (fileId: string) => {
    if (disabled) return

    if (onFileDelete) {
      const result = await onFileDelete(fileId)
      if (result.success) {
        onFilesChange(files.filter(file => file.id !== fileId))
        toast.success("File removed successfully")
      } else {
        toast.error(`Failed to remove file: ${result.error}`)
      }
    } else {
      onFilesChange(files.filter(file => file.id !== fileId))
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word') || type.includes('document')) return '📝'
    return '📎'
  }

  return (
    <div className={cn("space-y-4", className)}>
      {label && <Label>{label}</Label>}
      
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium text-gray-600 mb-1">
          {isUploading ? "Uploading..." : description}
        </p>
        <p className="text-xs text-gray-500">
          {allowedTypes.length > 0 && `Allowed: ${allowedTypes.join(', ')}`}
          {maxSize && ` • Max ${(maxSize / 1024 / 1024).toFixed(0)}MB per file`}
          {maxFiles && ` • Max ${maxFiles} files`}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Files ({files.length})</Label>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.size > 0 ? formatFileSize(file.size) : 'Existing file'} • {file.type}
                          {file.url && <span className="ml-2 text-blue-600">• Existing</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                          disabled={disabled}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(file.id)}
                        disabled={disabled}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Uploading files...</span>
        </div>
      )}
    </div>
  )
}
