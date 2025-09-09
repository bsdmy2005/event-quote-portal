import { pgEnum, pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rfqInvitesTable } from "./invites-schema";
import { suppliersTable } from "./organizations-schema";

export const quotationStatusEnum = pgEnum("quotation_status", ["submitted", "replaced"]);

export const quotationsTable = pgTable("quotations", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfqInviteId: uuid("rfq_invite_id").notNull(),
  supplierId: uuid("supplier_id").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: quotationStatusEnum("status").default("submitted").notNull(),
  version: integer("version").default(1).notNull(),
});

// Relations
export const quotationsRelations = relations(quotationsTable, ({ one }) => ({
  rfqInvite: one(rfqInvitesTable, {
    fields: [quotationsTable.rfqInviteId],
    references: [rfqInvitesTable.id],
  }),
  supplier: one(suppliersTable, {
    fields: [quotationsTable.supplierId],
    references: [suppliersTable.id],
  }),
}));

export type InsertQuotation = typeof quotationsTable.$inferInsert;
export type SelectQuotation = typeof quotationsTable.$inferSelect;
