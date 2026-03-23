"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  supplierPerformanceMetricsTable,
  supplierRankingSnapshotsTable,
} from "@/db/schema/supplier-analytics-schema";

export async function getSupplierPerformanceMetric(supplierId: string) {
  return db.query.supplierPerformanceMetricsTable.findFirst({
    where: eq(supplierPerformanceMetricsTable.supplierId, supplierId),
  });
}

export async function upsertSupplierPerformanceMetric(
  supplierId: string,
  data: Partial<typeof supplierPerformanceMetricsTable.$inferInsert>
) {
  const existing = await db.query.supplierPerformanceMetricsTable.findFirst({
    where: eq(supplierPerformanceMetricsTable.supplierId, supplierId),
  });

  if (existing) {
    const [updated] = await db
      .update(supplierPerformanceMetricsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(supplierPerformanceMetricsTable.supplierId, supplierId))
      .returning();
    return updated;
  }

  const [inserted] = await db
    .insert(supplierPerformanceMetricsTable)
    .values({ supplierId, ...data })
    .returning();
  return inserted;
}

export async function listSupplierPerformanceMetrics() {
  return db
    .select()
    .from(supplierPerformanceMetricsTable)
    .orderBy(desc(supplierPerformanceMetricsTable.winRate));
}

export async function createSupplierRankingSnapshot(snapshot: Record<string, unknown>, category?: string) {
  const [row] = await db.insert(supplierRankingSnapshotsTable).values({
    snapshot,
    category,
  }).returning();
  return row;
}

export async function getLatestSupplierRankingSnapshot(category?: string) {
  const rows = await db.query.supplierRankingSnapshotsTable.findMany({
    where: category ? eq(supplierRankingSnapshotsTable.category, category) : undefined,
    orderBy: [desc(supplierRankingSnapshotsTable.generatedAt)],
    limit: 1,
  });
  return rows[0] ?? null;
}
