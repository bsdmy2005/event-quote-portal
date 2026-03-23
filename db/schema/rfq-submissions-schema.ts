import { pgTable, uuid, timestamp, text, integer, pgEnum, bigint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rfqsTable } from "./rfqs-schema";
import { suppliersTable } from "./organizations-schema";
import { rfqInvitesTable } from "./invites-schema";
import { rfqParticipationsTable } from "./rfq-participations-schema";

export const submissionStatusEnum = pgEnum("submission_status", [
  "submitted",
  "under_review",
  "shortlisted",
  "awarded",
  "not_successful",
]);

export const submitterOrgTypeEnum = pgEnum("submitter_org_type", ["supplier", "agency"]);

export const rfqSubmissionsTable = pgTable("rfq_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfqId: uuid("rfq_id").notNull(),
  supplierId: uuid("supplier_id"),
  rfqInviteId: uuid("rfq_invite_id"),
  participationId: uuid("participation_id"),
  submitterOrgType: submitterOrgTypeEnum("submitter_org_type").default("supplier").notNull(),
  submitterOrgId: uuid("submitter_org_id"),
  submissionStatus: submissionStatusEnum("submission_status").default("submitted").notNull(),
  proposalTitle: text("proposal_title"),
  proposalNotes: text("proposal_notes"),
  submissionVersion: integer("submission_version").default(1).notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  lastStatusChangedAt: timestamp("last_status_changed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rfqSubmissionDocTypeEnum = pgEnum("rfq_submission_doc_type", [
  "proposal",
  "cost_estimate",
  "credentials",
  "compliance",
  "other",
]);

export const rfqSubmissionDocumentsTable = pgTable("rfq_submission_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull(),
  docType: rfqSubmissionDocTypeEnum("doc_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: bigint("file_size", { mode: "number" }),
  mimeType: text("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const rfqSubmissionsRelations = relations(rfqSubmissionsTable, ({ one, many }) => ({
  rfq: one(rfqsTable, {
    fields: [rfqSubmissionsTable.rfqId],
    references: [rfqsTable.id],
  }),
  supplier: one(suppliersTable, {
    fields: [rfqSubmissionsTable.supplierId],
    references: [suppliersTable.id],
  }),
  invite: one(rfqInvitesTable, {
    fields: [rfqSubmissionsTable.rfqInviteId],
    references: [rfqInvitesTable.id],
  }),
  participation: one(rfqParticipationsTable, {
    fields: [rfqSubmissionsTable.participationId],
    references: [rfqParticipationsTable.id],
  }),
  documents: many(rfqSubmissionDocumentsTable),
}));

export const rfqSubmissionDocumentsRelations = relations(rfqSubmissionDocumentsTable, ({ one }) => ({
  submission: one(rfqSubmissionsTable, {
    fields: [rfqSubmissionDocumentsTable.submissionId],
    references: [rfqSubmissionsTable.id],
  }),
}));

export type InsertRfqSubmission = typeof rfqSubmissionsTable.$inferInsert;
export type SelectRfqSubmission = typeof rfqSubmissionsTable.$inferSelect;
export type InsertRfqSubmissionDocument = typeof rfqSubmissionDocumentsTable.$inferInsert;
export type SelectRfqSubmissionDocument = typeof rfqSubmissionDocumentsTable.$inferSelect;
