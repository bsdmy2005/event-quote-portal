 import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rfqsTable } from "./rfqs-schema";
import { suppliersTable, agenciesTable } from "./organizations-schema";
import { quotationsTable } from "./quotations-schema";

export const inviteStatusEnum = pgEnum("invite_status", ["invited", "opened", "submitted", "closed"]);
export const orgInviteTypeEnum = pgEnum("org_invite_type", ["agency", "supplier"]);

export const rfqInvitesTable = pgTable("rfq_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfqId: uuid("rfq_id").notNull(),
  supplierId: uuid("supplier_id").notNull(),
  inviteStatus: inviteStatusEnum("invite_status").default("invited").notNull(),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orgInvitesTable = pgTable("org_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgType: orgInviteTypeEnum("org_type").notNull(),
  orgId: uuid("org_id").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const rfqInvitesRelations = relations(rfqInvitesTable, ({ one, many }) => ({
  rfq: one(rfqsTable, {
    fields: [rfqInvitesTable.rfqId],
    references: [rfqsTable.id],
  }),
  supplier: one(suppliersTable, {
    fields: [rfqInvitesTable.supplierId],
    references: [suppliersTable.id],
  }),
  quotations: many(quotationsTable),
}));

export const orgInvitesRelations = relations(orgInvitesTable, ({ one }) => ({
  agency: one(agenciesTable, {
    fields: [orgInvitesTable.orgId],
    references: [agenciesTable.id],
  }),
  supplier: one(suppliersTable, {
    fields: [orgInvitesTable.orgId],
    references: [suppliersTable.id],
  }),
}));

export type InsertRfqInvite = typeof rfqInvitesTable.$inferInsert;
export type SelectRfqInvite = typeof rfqInvitesTable.$inferSelect;
export type InsertOrgInvite = typeof orgInvitesTable.$inferInsert;
export type SelectOrgInvite = typeof orgInvitesTable.$inferSelect;
