import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Images table - stores metadata about each image
export const imagesTable = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(), // References agency or supplier
  organizationType: text("organization_type", { enum: ["agency", "supplier"] }).notNull(), // Distinguishes between agency and supplier
  fileName: text("file_name").notNull(), // Original filename
  filePath: text("file_path").notNull(), // Supabase storage path
  fileUrl: text("file_url").notNull(), // Public URL for the image
  fileSize: integer("file_size"), // File size in bytes
  mimeType: text("mime_type").notNull(), // Image MIME type
  width: integer("width"), // Image width in pixels
  height: integer("height"), // Image height in pixels
  altText: text("alt_text"), // Alt text for accessibility
  caption: text("caption"), // Optional caption
  isFeatured: boolean("is_featured").default(false), // Whether this is a featured image
  sortOrder: integer("sort_order").default(0), // For ordering images
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertImageSchema = createInsertSchema(imagesTable);
export const selectImageSchema = createSelectSchema(imagesTable);

// TypeScript types using Drizzle's built-in inference
export type Image = typeof imagesTable.$inferSelect;
export type NewImage = typeof imagesTable.$inferInsert;

// Extended types for API responses
export type OrganizationWithImages = {
  id: string;
  name: string;
  images: Image[];
};
