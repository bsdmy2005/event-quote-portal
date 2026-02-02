// Client-side utilities for file validation and preparation
// Actual uploads are handled by server actions in actions/upload-actions.ts

// Re-export server actions for convenience
export {
  uploadImageAction,
  uploadRfqAttachmentAction,
  uploadQuotationAction,
  deleteImageAction
} from '@/actions/upload-actions';

// Storage folder prefixes (matching previous Supabase bucket structure)
export const STORAGE_FOLDERS = {
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

// Convert File to base64 for server action upload
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Get image dimensions (for metadata) - client-side only
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
  if (!FILE_LIMITS.ALLOWED_TYPES.includes(file.type as typeof FILE_LIMITS.ALLOWED_TYPES[number])) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
  }

  if (file.size > FILE_LIMITS.MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' };
  }

  return { valid: true };
}

// Validate RFQ attachment file
export function validateRfqAttachmentFile(file: File): { valid: boolean; error?: string } {
  if (!FILE_LIMITS.ALLOWED_RFQ_TYPES.includes(file.type as typeof FILE_LIMITS.ALLOWED_RFQ_TYPES[number])) {
    return { valid: false, error: 'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.' };
  }

  if (file.size > FILE_LIMITS.MAX_RFQ_ATTACHMENT_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 20MB.' };
  }

  return { valid: true };
}

// Validate quotation file
export function validateQuotationFile(file: File): { valid: boolean; error?: string } {
  if (!FILE_LIMITS.ALLOWED_QUOTATION_TYPES.includes(file.type as typeof FILE_LIMITS.ALLOWED_QUOTATION_TYPES[number])) {
    return { valid: false, error: 'Invalid file type. Only PDF files are allowed for quotations.' };
  }

  if (file.size > FILE_LIMITS.MAX_QUOTATION_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 20MB.' };
  }

  return { valid: true };
}

// Helper function to upload an image using server action
export async function uploadImage(
  file: File,
  organizationType: 'agency' | 'supplier',
  organizationId: string
): Promise<{ success: boolean; data?: { path: string; url: string; size: number; type: string }; error?: string }> {
  // Validate file first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Convert to base64
  const base64Data = await fileToBase64(file);

  // Import and call server action
  const { uploadImageAction } = await import('@/actions/upload-actions');
  return uploadImageAction(base64Data, file.name, file.type, file.size, organizationType, organizationId);
}

// Helper function to upload an RFQ attachment using server action
export async function uploadRfqAttachment(
  file: File,
  rfqId: string
): Promise<{ success: boolean; data?: { path: string; url: string; size: number; type: string; name: string }; error?: string }> {
  // Validate file first
  const validation = validateRfqAttachmentFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Convert to base64
  const base64Data = await fileToBase64(file);

  // Import and call server action
  const { uploadRfqAttachmentAction } = await import('@/actions/upload-actions');
  return uploadRfqAttachmentAction(base64Data, file.name, file.type, file.size, rfqId);
}

// Helper function to upload a quotation using server action
export async function uploadQuotation(
  file: File,
  rfqInviteId: string
): Promise<{ success: boolean; data?: { path: string; url: string; size: number; type: string; name: string }; error?: string }> {
  // Validate file first
  const validation = validateQuotationFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Convert to base64
  const base64Data = await fileToBase64(file);

  // Import and call server action
  const { uploadQuotationAction } = await import('@/actions/upload-actions');
  return uploadQuotationAction(base64Data, file.name, file.type, file.size, rfqInviteId);
}

// Helper function to delete an image using server action
export async function deleteImage(
  organizationType: 'agency' | 'supplier',
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  const { deleteImageAction } = await import('@/actions/upload-actions');
  return deleteImageAction(organizationType, storagePath);
}

// For backwards compatibility with existing code
export const STORAGE_BUCKETS = STORAGE_FOLDERS;
