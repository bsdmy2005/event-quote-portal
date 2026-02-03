import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const waitlistRoleEnum = pgEnum("waitlist_role", [
  "agency",
  "supplier",
  "cost_consultant",
  "financier",
  "other"
]);

export const waitlistTable = pgTable("waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  companyName: text("company_name"),
  role: waitlistRoleEnum("role").notNull(),
  interests: text("interests").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsertWaitlist = typeof waitlistTable.$inferInsert;
export type SelectWaitlist = typeof waitlistTable.$inferSelect;
