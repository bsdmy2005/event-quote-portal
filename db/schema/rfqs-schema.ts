import { pgEnum, pgTable, text, timestamp, uuid, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { agenciesTable } from "./organizations-schema";
import { profilesTable } from "./profiles-schema";
import { rfqInvitesTable } from "./invites-schema";

export const rfqStatusEnum = pgEnum("rfq_status", ["draft", "sent", "closed", "awarded", "not_awarded"]);

export const rfqsTable = pgTable("rfqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  agencyId: uuid("agency_id").notNull(),
  createdByUserId: text("created_by_user_id").notNull(),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  eventDates: json("event_dates").$type<{
    start: string;
    end: string;
  }>(),
  venue: text("venue"),
  scope: text("scope").notNull(),
  attachmentsUrl: json("attachments_url").$type<string[]>(),
  deadlineAt: timestamp("deadline_at").notNull(),
  status: rfqStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const rfqsRelations = relations(rfqsTable, ({ one, many }) => ({
  agency: one(agenciesTable, {
    fields: [rfqsTable.agencyId],
    references: [agenciesTable.id],
  }),
  createdByUser: one(profilesTable, {
    fields: [rfqsTable.createdByUserId],
    references: [profilesTable.userId],
  }),
  invites: many(rfqInvitesTable),
}));

export type InsertRfq = typeof rfqsTable.$inferInsert;
export type SelectRfq = typeof rfqsTable.$inferSelect;
