"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client on the server-side only
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.R2_BUCKET_NAME!;
const publicUrl = process.env.R2_PUBLIC_URL!;

// Storage folder prefixes
const STORAGE_FOLDERS = {
  AGENCY_IMAGES: 'agency-images',
  SUPPLIER_IMAGES: 'supplier-images',
  RFQ_ATTACHMENTS: 'rfq-attachments',
  QUOTATIONS: 'quotations',
} as const;

// File size limits (in bytes)
const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_RFQ_ATTACHMENT_SIZE: 20 * 1024 * 1024, // 20MB
  MAX_QUOTATION_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_RFQ_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_QUOTATION_TYPES: ['application/pdf'],
} as const;

function generateImagePath(
  organizationType: 'agency' | 'supplier',
  organizationId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${organizationType}/${organizationId}/${timestamp}_${sanitizedFileName}`;
}

function getStorageKey(folder: string, path: string): string {
  return `${folder}/${path}`;
}

function getPublicUrl(folder: string, path: string): string {
  return `${publicUrl}/${folder}/${path}`;
}

interface UploadResult {
  success: boolean;
  data?: {
    path: string;
    url: string;
    size: number;
    type: string;
  };
  error?: string;
}

/**
 * Server action to upload an image to R2 storage
 * Receives file data as base64 string from client
 */
export async function uploadImageAction(
  base64Data: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  organizationType: 'agency' | 'supplier',
  organizationId: string
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!FILE_LIMITS.ALLOWED_TYPES.includes(fileType as typeof FILE_LIMITS.ALLOWED_TYPES[number])) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    // Validate file size
    if (fileSize > FILE_LIMITS.MAX_FILE_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 10MB.' };
    }

    // Convert base64 to buffer
    const base64Content = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    // Generate storage path
    const storagePath = generateImagePath(organizationType, organizationId, fileName);
    const folder = organizationType === 'agency' ? STORAGE_FOLDERS.AGENCY_IMAGES : STORAGE_FOLDERS.SUPPLIER_IMAGES;
    const key = getStorageKey(folder, storagePath);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: fileType,
      CacheControl: 'public, max-age=3600',
    });

    await r2Client.send(command);

    return {
      success: true,
      data: {
        path: storagePath,
        url: getPublicUrl(folder, storagePath),
        size: fileSize,
        type: fileType,
      },
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}

/**
 * Server action to upload an RFQ attachment to R2 storage
 */
export async function uploadRfqAttachmentAction(
  base64Data: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  rfqId: string
): Promise<UploadResult & { data?: { name: string } & UploadResult['data'] }> {
  try {
    // Validate file type
    if (!FILE_LIMITS.ALLOWED_RFQ_TYPES.includes(fileType as typeof FILE_LIMITS.ALLOWED_RFQ_TYPES[number])) {
      return { success: false, error: 'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.' };
    }

    // Validate file size
    if (fileSize > FILE_LIMITS.MAX_RFQ_ATTACHMENT_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 20MB.' };
    }

    // Convert base64 to buffer
    const base64Content = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    // Generate storage path
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `rfq/${rfqId}/${timestamp}_${sanitizedFileName}`;
    const key = getStorageKey(STORAGE_FOLDERS.RFQ_ATTACHMENTS, storagePath);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: fileType,
      CacheControl: 'public, max-age=3600',
    });

    await r2Client.send(command);

    return {
      success: true,
      data: {
        path: storagePath,
        url: getPublicUrl(STORAGE_FOLDERS.RFQ_ATTACHMENTS, storagePath),
        size: fileSize,
        type: fileType,
        name: fileName,
      },
    };
  } catch (error) {
    console.error('RFQ attachment upload error:', error);
    return { success: false, error: 'Failed to upload RFQ attachment' };
  }
}

/**
 * Server action to upload a quotation to R2 storage
 */
export async function uploadQuotationAction(
  base64Data: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  rfqInviteId: string
): Promise<UploadResult & { data?: { name: string } & UploadResult['data'] }> {
  try {
    // Validate file type
    if (!FILE_LIMITS.ALLOWED_QUOTATION_TYPES.includes(fileType as typeof FILE_LIMITS.ALLOWED_QUOTATION_TYPES[number])) {
      return { success: false, error: 'Invalid file type. Only PDF files are allowed for quotations.' };
    }

    // Validate file size
    if (fileSize > FILE_LIMITS.MAX_QUOTATION_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 20MB.' };
    }

    // Convert base64 to buffer
    const base64Content = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    // Generate storage path
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `quotations/${rfqInviteId}/${timestamp}_${sanitizedFileName}`;
    const key = getStorageKey(STORAGE_FOLDERS.QUOTATIONS, storagePath);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: fileType,
      CacheControl: 'public, max-age=3600',
    });

    await r2Client.send(command);

    return {
      success: true,
      data: {
        path: storagePath,
        url: getPublicUrl(STORAGE_FOLDERS.QUOTATIONS, storagePath),
        size: fileSize,
        type: fileType,
        name: fileName,
      },
    };
  } catch (error) {
    console.error('Quotation upload error:', error);
    return { success: false, error: 'Failed to upload quotation' };
  }
}

/**
 * Server action to delete an image from R2 storage
 */
export async function deleteImageAction(
  organizationType: 'agency' | 'supplier',
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const folder = organizationType === 'agency' ? STORAGE_FOLDERS.AGENCY_IMAGES : STORAGE_FOLDERS.SUPPLIER_IMAGES;
    const key = getStorageKey(folder, storagePath);

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2Client.send(command);

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}
