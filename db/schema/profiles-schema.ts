import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { agenciesTable, suppliersTable } from "./organizations-schema";

export const userRoleEnum = pgEnum("user_role", [
  "admin", 
  "agency_admin", 
  "agency_member", 
  "supplier_admin", 
  "supplier_member"
]);

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").default("agency_member").notNull(),
  agencyId: uuid("agency_id"),
  supplierId: uuid("supplier_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const profilesRelations = relations(profilesTable, ({ one }) => ({
  agency: one(agenciesTable, {
    fields: [profilesTable.agencyId],
    references: [agenciesTable.id],
  }),
  supplier: one(suppliersTable, {
    fields: [profilesTable.supplierId],
    references: [suppliersTable.id],
  }),
}));

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect; 