import { pgEnum, pgTable, text, timestamp, uuid, json, boolean, numeric, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { agenciesTable } from "./organizations-schema";
import { profilesTable } from "./profiles-schema";
import { rfqInvitesTable } from "./invites-schema";

export const rfqStatusEnum = pgEnum("rfq_status", [
  "draft",
  "sent",
  "published",
  "evaluation",
  "closed",
  "awarded",
  "not_awarded",
  "cancelled",
]);
export const issuerTypeEnum = pgEnum("rfq_issuer_type", ["agency", "cost_consultant", "client"]);
export const recipientTypeEnum = pgEnum("rfq_recipient_type", ["supplier", "agency"]);
export const projectTypeEnum = pgEnum("project_type", [
  "physical_event",
  "digital_campaign",
  "brand_activation",
  "conference_expo",
  "hybrid",
  "other",
]);

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
  eventType: text("event_type"),
  projectType: projectTypeEnum("project_type").default("physical_event").notNull(),
  issuerType: issuerTypeEnum("issuer_type").default("agency").notNull(),
  issuerOrgId: uuid("issuer_org_id"),
  recipientType: recipientTypeEnum("recipient_type").default("supplier").notNull(),
  budgetMin: numeric("budget_min", { precision: 14, scale: 2 }),
  budgetMax: numeric("budget_max", { precision: 14, scale: 2 }),
  locationCity: text("location_city"),
  locationProvince: text("location_province"),
  locationCountry: text("location_country"),
  requiredServices: json("required_services").$type<string[]>(),
  submissionTemplate: json("submission_template").$type<Record<string, unknown>>(),
  ndaRequired: boolean("nda_required").default(false).notNull(),
  teaserSummary: text("teaser_summary"),
  fullBriefUrl: text("full_brief_url"),
  audienceCount: integer("audience_count"),
  audienceDescription: text("audience_description"),
  attachmentsUrl: json("attachments_url").$type<string[]>(),
  deadlineAt: timestamp("deadline_at").notNull(),
  status: rfqStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  closedAt: timestamp("closed_at"),
  awardedAt: timestamp("awarded_at"),
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
