import { pgTable, uuid, integer, numeric, timestamp, json, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { suppliersTable } from "./organizations-schema";

export const supplierPerformanceMetricsTable = pgTable("supplier_performance_metrics", {
  supplierId: uuid("supplier_id").primaryKey(),
  pitchesViewed: integer("pitches_viewed").default(0).notNull(),
  ndasSigned: integer("ndas_signed").default(0).notNull(),
  submissionsTotal: integer("submissions_total").default(0).notNull(),
  shortlistedTotal: integer("shortlisted_total").default(0).notNull(),
  winsTotal: integer("wins_total").default(0).notNull(),
  winRate: numeric("win_rate", { precision: 6, scale: 3 }).default("0").notNull(),
  shortlistRate: numeric("shortlist_rate", { precision: 6, scale: 3 }).default("0").notNull(),
  complianceAvg: numeric("compliance_avg", { precision: 6, scale: 3 }).default("0").notNull(),
  consistencyAvg: numeric("consistency_avg", { precision: 6, scale: 3 }).default("0").notNull(),
  contractValueTotal: numeric("contract_value_total", { precision: 14, scale: 2 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supplierRankingSnapshotsTable = pgTable("supplier_ranking_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  category: text("category"),
  snapshot: json("snapshot").$type<Record<string, unknown>>().notNull(),
});

export const supplierPerformanceMetricsRelations = relations(supplierPerformanceMetricsTable, ({ one }) => ({
  supplier: one(suppliersTable, {
    fields: [supplierPerformanceMetricsTable.supplierId],
    references: [suppliersTable.id],
  }),
}));

export type InsertSupplierPerformanceMetric = typeof supplierPerformanceMetricsTable.$inferInsert;
export type SelectSupplierPerformanceMetric = typeof supplierPerformanceMetricsTable.$inferSelect;
