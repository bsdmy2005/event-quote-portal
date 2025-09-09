"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X,
  Loader2,
  ImageIcon
} from "lucide-react";
import { validateImageFile } from "@/lib/supabase-storage";

interface ImageUploadProps {
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export function ImageUpload({ 
  selectedFiles, 
  onFilesChange, 
  disabled = false,
  maxFiles = 10 
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(", "));
    } else {
      setError(null);
    }

    // Check if adding these files would exceed the limit
    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You're trying to add ${validFiles.length} files but already have ${selectedFiles.length}.`);
      return;
    }

    if (validFiles.length > 0) {
      onFilesChange([...selectedFiles, ...validFiles]);
    }
  }, [selectedFiles, onFilesChange, maxFiles]);

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload" className="text-sm font-medium text-gray-700">
          Upload Images (Optional)
        </Label>
        <Input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: JPEG, PNG, WebP. Max size: 10MB per file. Max {maxFiles} files.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Selected Images ({selectedFiles.length}/{maxFiles})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {file.name}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
