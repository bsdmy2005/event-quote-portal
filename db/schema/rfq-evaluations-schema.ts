import { pgTable, uuid, text, timestamp, json, boolean, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { agenciesTable } from "./organizations-schema";
import { rfqsTable } from "./rfqs-schema";
import { profilesTable } from "./profiles-schema";
import { rfqSubmissionsTable } from "./rfq-submissions-schema";

export const rfqEvaluationTemplatesTable = pgTable("rfq_evaluation_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  agencyId: uuid("agency_id").notNull(),
  name: text("name").notNull(),
  criteria: json("criteria").$type<Array<{ name: string; weight: number; description?: string }>>().notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rfqEvaluationsTable = pgTable("rfq_evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfqId: uuid("rfq_id").notNull(),
  submissionId: uuid("submission_id").notNull(),
  evaluatorUserId: text("evaluator_user_id").notNull(),
  scores: json("scores").$type<Record<string, number>>().notNull(),
  weightedTotal: numeric("weighted_total", { precision: 6, scale: 2 }).notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rfqAwardsTable = pgTable("rfq_awards", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfqId: uuid("rfq_id").notNull(),
  winnerSubmissionId: uuid("winner_submission_id").notNull(),
  runnerUpSubmissionId: uuid("runner_up_submission_id"),
  awardReason: text("award_reason"),
  contractValue: numeric("contract_value", { precision: 14, scale: 2 }),
  awardedBudget: numeric("awarded_budget", { precision: 14, scale: 2 }),
  awardedByUserId: text("awarded_by_user_id"),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rfqEvaluationTemplatesRelations = relations(rfqEvaluationTemplatesTable, ({ one }) => ({
  agency: one(agenciesTable, {
    fields: [rfqEvaluationTemplatesTable.agencyId],
    references: [agenciesTable.id],
  }),
}));

export const rfqEvaluationsRelations = relations(rfqEvaluationsTable, ({ one }) => ({
  rfq: one(rfqsTable, {
    fields: [rfqEvaluationsTable.rfqId],
    references: [rfqsTable.id],
  }),
  submission: one(rfqSubmissionsTable, {
    fields: [rfqEvaluationsTable.submissionId],
    references: [rfqSubmissionsTable.id],
  }),
  evaluator: one(profilesTable, {
    fields: [rfqEvaluationsTable.evaluatorUserId],
    references: [profilesTable.userId],
  }),
}));

export const rfqAwardsRelations = relations(rfqAwardsTable, ({ one }) => ({
  rfq: one(rfqsTable, {
    fields: [rfqAwardsTable.rfqId],
    references: [rfqsTable.id],
  }),
  winner: one(rfqSubmissionsTable, {
    fields: [rfqAwardsTable.winnerSubmissionId],
    references: [rfqSubmissionsTable.id],
  }),
  runnerUp: one(rfqSubmissionsTable, {
    fields: [rfqAwardsTable.runnerUpSubmissionId],
    references: [rfqSubmissionsTable.id],
  }),
}));

export type InsertRfqEvaluationTemplate = typeof rfqEvaluationTemplatesTable.$inferInsert;
export type SelectRfqEvaluationTemplate = typeof rfqEvaluationTemplatesTable.$inferSelect;
export type InsertRfqEvaluation = typeof rfqEvaluationsTable.$inferInsert;
export type SelectRfqEvaluation = typeof rfqEvaluationsTable.$inferSelect;
export type InsertRfqAward = typeof rfqAwardsTable.$inferInsert;
export type SelectRfqAward = typeof rfqAwardsTable.$inferSelect;
