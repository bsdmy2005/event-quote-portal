import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
  AGENCY_IMAGES: 'agency-images',
  SUPPLIER_IMAGES: 'supplier-images',
} as const;

// File size limits (in bytes)
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
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
