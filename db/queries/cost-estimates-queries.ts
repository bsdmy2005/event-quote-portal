"use server";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  InsertCostEstimate,
  InsertCostEstimateItem,
  costEstimateExportsTable,
  costEstimateItemsTable,
  costEstimateVersionsTable,
  costEstimatesTable,
} from "@/db/schema/cost-estimates-schema";

export async function createCostEstimate(data: InsertCostEstimate) {
  const [row] = await db.insert(costEstimatesTable).values(data).returning();
  return row;
}

export async function getCostEstimateById(id: string) {
  return db.query.costEstimatesTable.findFirst({
    where: eq(costEstimatesTable.id, id),
    with: {
      items: true,
      versions: true,
      exports: true,
    },
  });
}

export async function getCostEstimatesByRfq(rfqId: string) {
  return db.query.costEstimatesTable.findMany({
    where: eq(costEstimatesTable.rfqId, rfqId),
    orderBy: [desc(costEstimatesTable.createdAt)],
  });
}

export async function updateCostEstimate(id: string, data: Partial<InsertCostEstimate>) {
  const [row] = await db
    .update(costEstimatesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(costEstimatesTable.id, id))
    .returning();
  return row;
}

export async function replaceCostEstimateItems(costEstimateId: string, items: InsertCostEstimateItem[]) {
  await db.delete(costEstimateItemsTable).where(eq(costEstimateItemsTable.costEstimateId, costEstimateId));
  if (items.length === 0) return [];
  return db.insert(costEstimateItemsTable).values(items).returning();
}

export async function updateCostEstimateItem(itemId: string, data: Partial<InsertCostEstimateItem>) {
  const [row] = await db
    .update(costEstimateItemsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(costEstimateItemsTable.id, itemId))
    .returning();
  return row;
}

export async function createCostEstimateVersion(data: {
  costEstimateId: string;
  version: number;
  snapshot: string;
  createdByUserId: string;
}) {
  const [row] = await db.insert(costEstimateVersionsTable).values(data).returning();
  return row;
}

export async function createCostEstimateExport(data: {
  costEstimateId: string;
  exportType: "pdf" | "client_summary_pdf";
  fileUrl: string;
  createdByUserId: string;
}) {
  const [row] = await db.insert(costEstimateExportsTable).values(data).returning();
  return row;
}

export async function getLatestAgencyCostEstimate(rfqId: string, agencyId: string) {
  return db.query.costEstimatesTable.findFirst({
    where: and(eq(costEstimatesTable.rfqId, rfqId), eq(costEstimatesTable.agencyId, agencyId)),
    orderBy: [desc(costEstimatesTable.version)],
    with: { items: true },
  });
}
