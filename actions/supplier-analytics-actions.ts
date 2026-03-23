"use server";

import { auth } from "@clerk/nextjs/server";
import { ActionResult } from "@/types/actions/action-types";
import {
  createSupplierRankingSnapshot,
  getLatestSupplierRankingSnapshot,
  getSupplierPerformanceMetric,
  listSupplierPerformanceMetrics,
  upsertSupplierPerformanceMetric,
} from "@/db/queries/supplier-analytics-queries";
import { getProfileById } from "@/db/queries/profiles-queries";

export async function refreshSupplierMetricsAction(): Promise<ActionResult<any>> {
  try {
    const rows = await listSupplierPerformanceMetrics();
    const snapshot = await createSupplierRankingSnapshot({
      generatedAt: new Date().toISOString(),
      rows,
    });
    return { isSuccess: true, message: "Metrics refreshed", data: snapshot };
  } catch {
    return { isSuccess: false, message: "Failed to refresh metrics" };
  }
}

export async function getSupplierDashboardMetricsAction(
  supplierId?: string
): Promise<ActionResult<any>> {
  try {
    let resolvedSupplierId = supplierId;
    if (!resolvedSupplierId) {
      const { userId } = await auth();
      if (!userId) return { isSuccess: false, message: "User not authenticated" };
      const profile = await getProfileById(userId);
      if (!profile?.supplierId) return { isSuccess: false, message: "Supplier membership required" };
      resolvedSupplierId = profile.supplierId;
    }

    const row = await getSupplierPerformanceMetric(resolvedSupplierId);
    return { isSuccess: true, message: "Metrics fetched", data: row };
  } catch {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function getSupplierRankingsAction(filters?: {
  category?: string;
}): Promise<ActionResult<any>> {
  try {
    const snap = await getLatestSupplierRankingSnapshot(filters?.category);
    const rows = await listSupplierPerformanceMetrics();
    return {
      isSuccess: true,
      message: "Rankings fetched",
      data: {
        snapshot: snap,
        rows,
      },
    };
  } catch {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function seedSupplierMetricAction(data: {
  supplierId: string;
  submissionsTotal?: number;
  shortlistedTotal?: number;
  winsTotal?: number;
  pitchesViewed?: number;
  ndasSigned?: number;
  contractValueTotal?: number;
}): Promise<ActionResult<any>> {
  try {
    const row = await upsertSupplierPerformanceMetric(data.supplierId, {
      submissionsTotal: data.submissionsTotal,
      shortlistedTotal: data.shortlistedTotal,
      winsTotal: data.winsTotal,
      pitchesViewed: data.pitchesViewed,
      ndasSigned: data.ndasSigned,
      contractValueTotal: data.contractValueTotal ? String(data.contractValueTotal) : undefined,
    });
    return { isSuccess: true, message: "Metric updated", data: row };
  } catch {
    return { isSuccess: false, message: "Failed" };
  }
}
