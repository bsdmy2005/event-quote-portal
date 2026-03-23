import { pgTable, uuid, timestamp, boolean, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rfqsTable } from "./rfqs-schema";
import { suppliersTable } from "./organizations-schema";

export const rfqParticipationsTable = pgTable("rfq_participations", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfqId: uuid("rfq_id").notNull(),
  supplierId: uuid("supplier_id").notNull(),
  expressedInterestAt: timestamp("expressed_interest_at"),
  ndaRequired: boolean("nda_required").default(false).notNull(),
  ndaAccepted: boolean("nda_accepted").default(false).notNull(),
  ndaAcceptedAt: timestamp("nda_accepted_at"),
  ndaIp: text("nda_ip"),
  ndaUserAgent: text("nda_user_agent"),
  briefUnlockedAt: timestamp("brief_unlocked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rfqParticipationsRelations = relations(rfqParticipationsTable, ({ one }) => ({
  rfq: one(rfqsTable, {
    fields: [rfqParticipationsTable.rfqId],
    references: [rfqsTable.id],
  }),
  supplier: one(suppliersTable, {
    fields: [rfqParticipationsTable.supplierId],
    references: [suppliersTable.id],
  }),
}));

export type InsertRfqParticipation = typeof rfqParticipationsTable.$inferInsert;
export type SelectRfqParticipation = typeof rfqParticipationsTable.$inferSelect;
