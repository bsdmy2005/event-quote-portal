import { pgTable, uuid, text, timestamp, numeric, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rfqsTable } from "./rfqs-schema";
import { agenciesTable, suppliersTable } from "./organizations-schema";
import { rfqSubmissionsTable } from "./rfq-submissions-schema";

export const costEstimateStatusEnum = pgEnum("cost_estimate_status", [
  "draft",
  "ready_for_review",
  "approved",
  "published",
]);

export const costEstimateExportTypeEnum = pgEnum("cost_estimate_export_type", ["pdf", "client_summary_pdf"]);

export const costEstimatesTable = pgTable("cost_estimates", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfqId: uuid("rfq_id").notNull(),
  agencyId: uuid("agency_id"),
  parentOrgType: text("parent_org_type"),
  parentOrgId: uuid("parent_org_id"),
  projectType: text("project_type"),
  createdByUserId: text("created_by_user_id").notNull(),
  status: costEstimateStatusEnum("status").default("draft").notNull(),
  title: text("title").notNull(),
  currency: text("currency").default("ZAR").notNull(),
  supplierNetTotal: numeric("supplier_net_total", { precision: 14, scale: 2 }).default("0").notNull(),
  markupTotal: numeric("markup_total", { precision: 14, scale: 2 }).default("0").notNull(),
  managementFeePercent: numeric("management_fee_percent", { precision: 5, scale: 2 }).default("15.00").notNull(),
  managementFeeTotal: numeric("management_fee_total", { precision: 14, scale: 2 }).default("0").notNull(),
  vatPercent: numeric("vat_percent", { precision: 5, scale: 2 }).default("15.00").notNull(),
  vatTotal: numeric("vat_total", { precision: 14, scale: 2 }).default("0").notNull(),
  finalClientTotal: numeric("final_client_total", { precision: 14, scale: 2 }).default("0").notNull(),
  version: integer("version").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const costEstimateItemsTable = pgTable("cost_estimate_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  costEstimateId: uuid("cost_estimate_id").notNull(),
  category: text("category").notNull(),
  supplierId: uuid("supplier_id"),
  sourceSubmissionId: uuid("source_submission_id"),
  sourceOrgName: text("source_org_name"),
  sourceOrgId: uuid("source_org_id"),
  lineDescription: text("line_description").notNull(),
  unitCost: numeric("unit_cost", { precision: 14, scale: 2 }).notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
  supplierSubtotal: numeric("supplier_subtotal", { precision: 14, scale: 2 }).notNull(),
  markupPercent: numeric("markup_percent", { precision: 5, scale: 2 }).default("0").notNull(),
  markupValue: numeric("markup_value", { precision: 14, scale: 2 }).default("0").notNull(),
  clientPrice: numeric("client_price", { precision: 14, scale: 2 }).notNull(),
  isSelected: boolean("is_selected").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const costEstimateVersionsTable = pgTable("cost_estimate_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  costEstimateId: uuid("cost_estimate_id").notNull(),
  version: integer("version").notNull(),
  snapshot: text("snapshot").notNull(),
  createdByUserId: text("created_by_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const costEstimateExportsTable = pgTable("cost_estimate_exports", {
  id: uuid("id").primaryKey().defaultRandom(),
  costEstimateId: uuid("cost_estimate_id").notNull(),
  exportType: costEstimateExportTypeEnum("export_type").notNull(),
  fileUrl: text("file_url").notNull(),
  createdByUserId: text("created_by_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const costEstimatesRelations = relations(costEstimatesTable, ({ one, many }) => ({
  rfq: one(rfqsTable, {
    fields: [costEstimatesTable.rfqId],
    references: [rfqsTable.id],
  }),
  agency: one(agenciesTable, {
    fields: [costEstimatesTable.agencyId],
    references: [agenciesTable.id],
  }),
  items: many(costEstimateItemsTable),
  versions: many(costEstimateVersionsTable),
  exports: many(costEstimateExportsTable),
}));

export const costEstimateItemsRelations = relations(costEstimateItemsTable, ({ one }) => ({
  costEstimate: one(costEstimatesTable, {
    fields: [costEstimateItemsTable.costEstimateId],
    references: [costEstimatesTable.id],
  }),
  supplier: one(suppliersTable, {
    fields: [costEstimateItemsTable.supplierId],
    references: [suppliersTable.id],
  }),
  sourceSubmission: one(rfqSubmissionsTable, {
    fields: [costEstimateItemsTable.sourceSubmissionId],
    references: [rfqSubmissionsTable.id],
  }),
}));

export const costEstimateVersionsRelations = relations(costEstimateVersionsTable, ({ one }) => ({
  costEstimate: one(costEstimatesTable, {
    fields: [costEstimateVersionsTable.costEstimateId],
    references: [costEstimatesTable.id],
  }),
}));

export const costEstimateExportsRelations = relations(costEstimateExportsTable, ({ one }) => ({
  costEstimate: one(costEstimatesTable, {
    fields: [costEstimateExportsTable.costEstimateId],
    references: [costEstimatesTable.id],
  }),
}));

export type InsertCostEstimate = typeof costEstimatesTable.$inferInsert;
export type SelectCostEstimate = typeof costEstimatesTable.$inferSelect;
export type InsertCostEstimateItem = typeof costEstimateItemsTable.$inferInsert;
export type SelectCostEstimateItem = typeof costEstimateItemsTable.$inferSelect;
