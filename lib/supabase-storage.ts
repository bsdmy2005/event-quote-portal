import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
  AGENCY_IMAGES: 'agency-images',
  SUPPLIER_IMAGES: 'supplier-images',
  RFQ_ATTACHMENTS: 'rfq-attachments',
  QUOTATIONS: 'quotations',
} as const;

// File size limits (in bytes)
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_RFQ_ATTACHMENT_SIZE: 20 * 1024 * 1024, // 20MB for RFQ attachments
  MAX_QUOTATION_SIZE: 20 * 1024 * 1024, // 20MB for quotations
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_RFQ_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_QUOTATION_TYPES: ['application/pdf'],
} as const;

// Generate storage path for images
export function generateImagePath(
  organizationType: 'agency' | 'supplier',
  organizationId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${organizationType}/${organizationId}/${timestamp}_${sanitizedFileName}`;
}

// Type guard to check if file type is allowed
function isAllowedFileType(fileType: string): fileType is "image/jpeg" | "image/jpg" | "image/png" | "image/webp" {
  return FILE_LIMITS.ALLOWED_TYPES.includes(fileType as any);
}

// Upload image to Supabase storage
export async function uploadImage(
  file: File,
  organizationType: 'agency' | 'supplier',
  organizationId: string
): Promise<{ success: boolean; data?: { path: string; url: string; size: number; type: string }; error?: string }> {
  try {
    // Validate file
    if (!isAllowedFileType(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > FILE_LIMITS.MAX_FILE_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 10MB.' };
    }

    // Generate storage path
    const storagePath = generateImagePath(organizationType, organizationId, file.name);
    const bucketName = organizationType === 'agency' ? STORAGE_BUCKETS.AGENCY_IMAGES : STORAGE_BUCKETS.SUPPLIER_IMAGES;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    return {
      success: true,
      data: {
        path: storagePath,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
      },
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}

// Delete image from Supabase storage
export async function deleteImage(
  organizationType: 'agency' | 'supplier',
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const bucketName = organizationType === 'agency' ? STORAGE_BUCKETS.AGENCY_IMAGES : STORAGE_BUCKETS.SUPPLIER_IMAGES;

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([storagePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}

// Get image dimensions (for metadata)
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!FILE_LIMITS.ALLOWED_TYPES.includes(file.type as any)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
  }

  if (file.size > FILE_LIMITS.MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' };
  }

  return { valid: true };
}

// Generate storage path for RFQ attachments
export function generateRfqAttachmentPath(
  rfqId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `rfq/${rfqId}/${timestamp}_${sanitizedFileName}`;
}

// Generate storage path for quotations
export function generateQuotationPath(
  rfqInviteId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `quotations/${rfqInviteId}/${timestamp}_${sanitizedFileName}`;
}

// Type guard to check if RFQ attachment file type is allowed
function isAllowedRfqFileType(fileType: string): boolean {
  return FILE_LIMITS.ALLOWED_RFQ_TYPES.includes(fileType as any);
}

// Type guard to check if quotation file type is allowed
function isAllowedQuotationFileType(fileType: string): boolean {
  return FILE_LIMITS.ALLOWED_QUOTATION_TYPES.includes(fileType as any);
}

// Upload RFQ attachment to Supabase storage
export async function uploadRfqAttachment(
  file: File,
  rfqId: string
): Promise<{ success: boolean; data?: { path: string; url: string; size: number; type: string; name: string }; error?: string }> {
  try {
    // Validate file
    if (!isAllowedRfqFileType(file.type)) {
      return { success: false, error: 'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.' };
    }

    if (file.size > FILE_LIMITS.MAX_RFQ_ATTACHMENT_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 20MB.' };
    }

    // Generate storage path
    const storagePath = generateRfqAttachmentPath(rfqId, file.name);

    // Upload file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.RFQ_ATTACHMENTS)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('RFQ attachment upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS.RFQ_ATTACHMENTS)
      .getPublicUrl(storagePath);

    return {
      success: true,
      data: {
        path: storagePath,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        name: file.name,
      },
    };
  } catch (error) {
    console.error('RFQ attachment upload error:', error);
    return { success: false, error: 'Failed to upload RFQ attachment' };
  }
}

// Upload quotation to Supabase storage
export async function uploadQuotation(
  file: File,
  rfqInviteId: string
): Promise<{ success: boolean; data?: { path: string; url: string; size: number; type: string; name: string }; error?: string }> {
  try {
    // Validate file
    if (!isAllowedQuotationFileType(file.type)) {
      return { success: false, error: 'Invalid file type. Only PDF files are allowed for quotations.' };
    }

    if (file.size > FILE_LIMITS.MAX_QUOTATION_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 20MB.' };
    }

    // Generate storage path
    const storagePath = generateQuotationPath(rfqInviteId, file.name);

    // Upload file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.QUOTATIONS)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Quotation upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS.QUOTATIONS)
      .getPublicUrl(storagePath);

    return {
      success: true,
      data: {
        path: storagePath,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        name: file.name,
      },
    };
  } catch (error) {
    console.error('Quotation upload error:', error);
    return { success: false, error: 'Failed to upload quotation' };
  }
}

// Delete RFQ attachment from Supabase storage
export async function deleteRfqAttachment(
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.RFQ_ATTACHMENTS)
      .remove([storagePath]);

    if (error) {
      console.error('RFQ attachment delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('RFQ attachment delete error:', error);
    return { success: false, error: 'Failed to delete RFQ attachment' };
  }
}

// Delete quotation from Supabase storage
export async function deleteQuotation(
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.QUOTATIONS)
      .remove([storagePath]);

    if (error) {
      console.error('Quotation delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Quotation delete error:', error);
    return { success: false, error: 'Failed to delete quotation' };
  }
}

// Validate RFQ attachment file
export function validateRfqAttachmentFile(file: File): { valid: boolean; error?: string } {
  if (!FILE_LIMITS.ALLOWED_RFQ_TYPES.includes(file.type as any)) {
    return { valid: false, error: 'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.' };
  }

  if (file.size > FILE_LIMITS.MAX_RFQ_ATTACHMENT_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 20MB.' };
  }

  return { valid: true };
}

// Validate quotation file
export function validateQuotationFile(file: File): { valid: boolean; error?: string } {
  if (!FILE_LIMITS.ALLOWED_QUOTATION_TYPES.includes(file.type as any)) {
    return { valid: false, error: 'Invalid file type. Only PDF files are allowed for quotations.' };
  }

  if (file.size > FILE_LIMITS.MAX_QUOTATION_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 20MB.' };
  }

  return { valid: true };
}
