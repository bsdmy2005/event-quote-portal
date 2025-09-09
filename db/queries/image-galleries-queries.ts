import { db } from "@/db/db";
import { imagesTable } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import type { NewImage, OrganizationWithImages } from "@/db/schema";

// Image Queries
export async function createImage(data: NewImage) {
  try {
    const [image] = await db.insert(imagesTable).values(data).returning();
    return { isSuccess: true, data: image };
  } catch (error) {
    console.error("Failed to create image:", error);
    return { isSuccess: false, message: "Failed to create image" };
  }
}

export async function getImageById(id: string) {
  try {
    const image = await db.query.imagesTable.findFirst({
      where: eq(imagesTable.id, id),
    });
    return { isSuccess: true, data: image };
  } catch (error) {
    console.error("Failed to get image:", error);
    return { isSuccess: false, message: "Failed to get image" };
  }
}

export async function getImagesByOrganization(organizationId: string, organizationType: "agency" | "supplier") {
  try {
    const images = await db.query.imagesTable.findMany({
      where: and(
        eq(imagesTable.organizationId, organizationId),
        eq(imagesTable.organizationType, organizationType)
      ),
      orderBy: [asc(imagesTable.sortOrder), desc(imagesTable.createdAt)],
    });
    return { isSuccess: true, data: images };
  } catch (error) {
    console.error("Failed to get images:", error);
    return { isSuccess: false, message: "Failed to get images" };
  }
}

export async function updateImage(id: string, data: Partial<NewImage>) {
  try {
    const [image] = await db
      .update(imagesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(imagesTable.id, id))
      .returning();
    return { isSuccess: true, data: image };
  } catch (error) {
    console.error("Failed to update image:", error);
    return { isSuccess: false, message: "Failed to update image" };
  }
}

export async function deleteImage(id: string) {
  try {
    await db.delete(imagesTable).where(eq(imagesTable.id, id));
    return { isSuccess: true };
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { isSuccess: false, message: "Failed to delete image" };
  }
}

// Get featured images for an organization
export async function getFeaturedImagesByOrganization(organizationId: string, organizationType: "agency" | "supplier") {
  try {
    const images = await db.query.imagesTable.findMany({
      where: and(
        eq(imagesTable.organizationId, organizationId),
        eq(imagesTable.organizationType, organizationType),
        eq(imagesTable.isFeatured, true)
      ),
      orderBy: [asc(imagesTable.sortOrder), desc(imagesTable.createdAt)],
    });
    return { isSuccess: true, data: images };
  } catch (error) {
    console.error("Failed to get featured images:", error);
    return { isSuccess: false, message: "Failed to get featured images" };
  }
}
