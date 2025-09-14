import { pgEnum, pgTable, text, timestamp, uuid, json, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profilesTable } from "./profiles-schema";
import { rfqsTable } from "./rfqs-schema";
import { rfqInvitesTable } from "./invites-schema";
import { quotationsTable } from "./quotations-schema";

export const orgTypeEnum = pgEnum("org_type", ["agency", "supplier"]);
export const orgStatusEnum = pgEnum("org_status", ["active", "inactive", "pending"]);

export const agenciesTable = pgTable("agencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  logoUrl: text("logo_url"),
  website: text("website"),
  location: json("location").$type<{
    city: string;
    province: string;
    country: string;
  }>(),
  interestCategories: json("interest_categories").$type<string[]>(),
  about: text("about"),
  isPublished: boolean("is_published").default(false).notNull(),
  status: orgStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const suppliersTable = pgTable("suppliers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  logoUrl: text("logo_url"),
  brochureUrl: text("brochure_url"),
  idImageUrl: text("id_image_url"),
  location: json("location").$type<{
    city: string;
    province: string;
    country: string;
  }>(),
  serviceCategories: json("service_categories").$type<string[]>(),
  servicesText: text("services_text"),
  isPublished: boolean("is_published").default(false).notNull(),
  status: orgStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const agenciesRelations = relations(agenciesTable, ({ many }) => ({
  users: many(profilesTable),
  rfqs: many(rfqsTable),
}));

export const suppliersRelations = relations(suppliersTable, ({ many }) => ({
  users: many(profilesTable),
  rfqInvites: many(rfqInvitesTable),
  quotations: many(quotationsTable),
}));

export type InsertAgency = typeof agenciesTable.$inferInsert;
export type SelectAgency = typeof agenciesTable.$inferSelect;
export type InsertSupplier = typeof suppliersTable.$inferInsert;
export type SelectSupplier = typeof suppliersTable.$inferSelect;
