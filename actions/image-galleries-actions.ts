"use server";

import { revalidatePath } from "next/cache";
import {
  createImage,
  getImageById,
  getImagesByOrganization,
  updateImage,
  deleteImage,
  getFeaturedImagesByOrganization,
} from "@/db/queries/image-galleries-queries";
import type { NewImage } from "@/db/schema";

// Image Actions
export async function createImageAction(data: NewImage) {
  try {
    // Check if this is the first image for this organization
    const existingImages = await getImagesByOrganization(data.organizationId, data.organizationType);
    const isFirstImage = existingImages.isSuccess && existingImages.data && existingImages.data.length === 0;
    
    // If this is the first image, automatically set it as featured
    const imageData = {
      ...data,
      isFeatured: isFirstImage || data.isFeatured || false
    };
    
    const result = await createImage(imageData);
    if (result.isSuccess) {
      revalidatePath("/admin");
      revalidatePath(`/admin/agencies/${data.organizationId}`);
      revalidatePath(`/admin/suppliers/${data.organizationId}`);
      // Also revalidate public pages
      revalidatePath("/agencies");
      revalidatePath("/suppliers");
    }
    return result;
  } catch (error) {
    console.error("Failed to create image:", error);
    return { isSuccess: false, message: "Failed to create image" };
  }
}

export async function getImageByIdAction(id: string) {
  try {
    return await getImageById(id);
  } catch (error) {
    console.error("Failed to get image:", error);
    return { isSuccess: false, message: "Failed to get image" };
  }
}

export async function getImagesByOrganizationAction(organizationId: string, organizationType: "agency" | "supplier") {
  try {
    return await getImagesByOrganization(organizationId, organizationType);
  } catch (error) {
    console.error("Failed to get images:", error);
    return { isSuccess: false, message: "Failed to get images" };
  }
}

export async function updateImageAction(id: string, data: Partial<NewImage>) {
  try {
    const result = await updateImage(id, data);
    if (result.isSuccess) {
      revalidatePath("/admin");
      // Revalidate the specific organization page
      const image = await getImageById(id);
      if (image.isSuccess && image.data) {
        revalidatePath(`/admin/agencies/${image.data.organizationId}`);
        revalidatePath(`/admin/suppliers/${image.data.organizationId}`);
      }
    }
    return result;
  } catch (error) {
    console.error("Failed to update image:", error);
    return { isSuccess: false, message: "Failed to update image" };
  }
}

export async function deleteImageAction(id: string) {
  try {
    const result = await deleteImage(id);
    if (result.isSuccess) {
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { isSuccess: false, message: "Failed to delete image" };
  }
}

// Get featured images for an organization
export async function getFeaturedImagesByOrganizationAction(organizationId: string, organizationType: "agency" | "supplier") {
  try {
    return await getFeaturedImagesByOrganization(organizationId, organizationType);
  } catch (error) {
    console.error("Failed to get featured images:", error);
    return { isSuccess: false, message: "Failed to get featured images" };
  }
}

// Set an image as featured (and unfeature others)
export async function setFeaturedImageAction(imageId: string) {
  try {
    // First, get the image to find its organization
    const imageResult = await getImageById(imageId);
    if (!imageResult.isSuccess || !imageResult.data) {
      return { isSuccess: false, message: "Image not found" };
    }
    
    const image = imageResult.data;
    
    // Unfeature all other images for this organization
    const allImages = await getImagesByOrganization(image.organizationId, image.organizationType);
    if (allImages.isSuccess && allImages.data) {
      const unfeaturePromises = allImages.data
        .filter(img => img.id !== imageId)
        .map(img => updateImage(img.id, { isFeatured: false }));
      await Promise.all(unfeaturePromises);
    }
    
    // Set this image as featured
    const result = await updateImage(imageId, { isFeatured: true });
    if (result.isSuccess) {
      revalidatePath("/admin");
      revalidatePath(`/admin/agencies/${image.organizationId}`);
      revalidatePath(`/admin/suppliers/${image.organizationId}`);
      // Also revalidate public pages
      revalidatePath("/agencies");
      revalidatePath("/suppliers");
    }
    return result;
  } catch (error) {
    console.error("Failed to set featured image:", error);
    return { isSuccess: false, message: "Failed to set featured image" };
  }
}
