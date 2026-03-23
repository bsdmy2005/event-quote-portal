"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/actions/action-types";
import {
  createCostEstimate,
  createCostEstimateExport,
  createCostEstimateVersion,
  getCostEstimateById,
  getCostEstimatesByRfq,
  replaceCostEstimateItems,
  updateCostEstimate,
  updateCostEstimateItem,
} from "@/db/queries/cost-estimates-queries";
import { calculateCostEstimateSummary, calculateItem } from "@/lib/cost-estimate-calculations";

export async function generateCostEstimateAction(data: {
  rfqId: string;
  agencyId?: string;
  title: string;
  items: Array<{
    category: string;
    lineDescription: string;
    supplierId?: string;
    sourceSubmissionId?: string;
    sourceOrgName?: string;
    sourceOrgId?: string;
    unitCost: number;
    quantity: number;
    markupPercent: number;
    isSelected?: boolean;
  }>;
  managementFeePercent?: number;
  vatPercent?: number;
  parentOrgType?: string;
  parentOrgId?: string;
  projectType?: string;
}): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const managementFeePercent = data.managementFeePercent ?? 15;
    const vatPercent = data.vatPercent ?? 15;

    const preparedItems = data.items.map((item, idx) => {
      const calc = calculateItem({
        unitCost: item.unitCost,
        quantity: item.quantity,
        markupPercent: item.markupPercent,
      });

      return {
        category: item.category,
        lineDescription: item.lineDescription,
        supplierId: item.supplierId ?? null,
        sourceSubmissionId: item.sourceSubmissionId ?? null,
        sourceOrgName: item.sourceOrgName,
        sourceOrgId: item.sourceOrgId ?? null,
        unitCost: String(item.unitCost),
        quantity: String(item.quantity),
        supplierSubtotal: String(calc.supplierSubtotal),
        markupPercent: String(item.markupPercent),
        markupValue: String(calc.markupValue),
        clientPrice: String(calc.clientPrice),
        isSelected: item.isSelected ?? true,
        sortOrder: idx,
      };
    });

    const summary = calculateCostEstimateSummary({
      items: preparedItems.map((i) => ({ supplierSubtotal: Number(i.supplierSubtotal), markupValue: Number(i.markupValue) })),
      managementFeePercent,
      vatPercent,
      vatEnabled: true,
    });

    const ce = await createCostEstimate({
      rfqId: data.rfqId,
      agencyId: data.agencyId ?? null,
      createdByUserId: userId,
      title: data.title,
      parentOrgType: data.parentOrgType,
      parentOrgId: data.parentOrgId ?? null,
      projectType: data.projectType,
      supplierNetTotal: String(summary.supplierNetTotal),
      markupTotal: String(summary.markupTotal),
      managementFeePercent: String(managementFeePercent),
      managementFeeTotal: String(summary.managementFeeTotal),
      vatPercent: String(vatPercent),
      vatTotal: String(summary.vatTotal),
      finalClientTotal: String(summary.finalClientTotal),
      status: "draft",
    });

    await replaceCostEstimateItems(
      ce.id,
      preparedItems.map((item) => ({ ...item, costEstimateId: ce.id }))
    );

    await createCostEstimateVersion({
      costEstimateId: ce.id,
      version: 1,
      snapshot: JSON.stringify({ ce, items: preparedItems }),
      createdByUserId: userId,
    });

    revalidatePath(`/rfqs/${data.rfqId}/cost-estimate`);
    return { isSuccess: true, message: "Cost estimate generated", data: ce };
  } catch (error) {
    return { isSuccess: false, message: "Failed to generate cost estimate" };
  }
}

export async function recalculateCostEstimateAction(costEstimateId: string): Promise<ActionResult<any>> {
  try {
    const ce = await getCostEstimateById(costEstimateId);
    if (!ce) return { isSuccess: false, message: "Cost estimate not found" };

    const summary = calculateCostEstimateSummary({
      items: ce.items.map((i) => ({
        supplierSubtotal: Number(i.supplierSubtotal),
        markupValue: Number(i.markupValue),
      })),
      managementFeePercent: Number(ce.managementFeePercent),
      vatPercent: Number(ce.vatPercent),
    });

    const updated = await updateCostEstimate(costEstimateId, {
      supplierNetTotal: String(summary.supplierNetTotal),
      markupTotal: String(summary.markupTotal),
      managementFeeTotal: String(summary.managementFeeTotal),
      vatTotal: String(summary.vatTotal),
      finalClientTotal: String(summary.finalClientTotal),
    });

    return { isSuccess: true, message: "Recalculated", data: updated };
  } catch (error) {
    return { isSuccess: false, message: "Failed to recalculate" };
  }
}

export async function updateCostEstimateItemAction(
  itemId: string,
  patch: {
    unitCost?: number;
    quantity?: number;
    markupPercent?: number;
    isSelected?: boolean;
  }
): Promise<ActionResult<any>> {
  try {
    const unitCost = patch.unitCost ?? 0;
    const quantity = patch.quantity ?? 0;
    const markupPercent = patch.markupPercent ?? 0;
    const calc = calculateItem({ unitCost, quantity, markupPercent });

    const updated = await updateCostEstimateItem(itemId, {
      unitCost: patch.unitCost !== undefined ? String(patch.unitCost) : undefined,
      quantity: patch.quantity !== undefined ? String(patch.quantity) : undefined,
      markupPercent: patch.markupPercent !== undefined ? String(patch.markupPercent) : undefined,
      supplierSubtotal: String(calc.supplierSubtotal),
      markupValue: String(calc.markupValue),
      clientPrice: String(calc.clientPrice),
      isSelected: patch.isSelected,
    });

    return { isSuccess: true, message: "Item updated", data: updated };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update item" };
  }
}

export async function setDefaultMarkupAction(
  costEstimateId: string,
  markupPercent: number
): Promise<ActionResult<any>> {
  try {
    const ce = await getCostEstimateById(costEstimateId);
    if (!ce) return { isSuccess: false, message: "Not found" };

    const items = ce.items.map((i) => {
      const calc = calculateItem({
        unitCost: Number(i.unitCost),
        quantity: Number(i.quantity),
        markupPercent,
      });

      return {
        costEstimateId,
        category: i.category,
        supplierId: i.supplierId,
        sourceSubmissionId: i.sourceSubmissionId,
        sourceOrgName: i.sourceOrgName,
        sourceOrgId: i.sourceOrgId,
        lineDescription: i.lineDescription,
        unitCost: i.unitCost,
        quantity: i.quantity,
        supplierSubtotal: String(calc.supplierSubtotal),
        markupPercent: String(markupPercent),
        markupValue: String(calc.markupValue),
        clientPrice: String(calc.clientPrice),
        isSelected: i.isSelected,
        sortOrder: i.sortOrder,
      };
    });

    await replaceCostEstimateItems(costEstimateId, items);
    await recalculateCostEstimateAction(costEstimateId);

    return { isSuccess: true, message: "Default markup applied", data: null };
  } catch {
    return { isSuccess: false, message: "Failed to apply default markup" };
  }
}

export async function updateManagementFeeAction(
  costEstimateId: string,
  percent: number
): Promise<ActionResult<any>> {
  try {
    await updateCostEstimate(costEstimateId, { managementFeePercent: String(percent) });
    return recalculateCostEstimateAction(costEstimateId);
  } catch {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function updateVatAction(costEstimateId: string, percent: number): Promise<ActionResult<any>> {
  try {
    await updateCostEstimate(costEstimateId, { vatPercent: String(percent) });
    return recalculateCostEstimateAction(costEstimateId);
  } catch {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function publishCostEstimateAction(costEstimateId: string): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const ce = await getCostEstimateById(costEstimateId);
    if (!ce) return { isSuccess: false, message: "Not found" };

    const updated = await updateCostEstimate(costEstimateId, {
      status: "published",
      version: ce.version + 1,
    });

    await createCostEstimateVersion({
      costEstimateId,
      version: ce.version + 1,
      snapshot: JSON.stringify(updated),
      createdByUserId: userId,
    });

    return { isSuccess: true, message: "Published", data: updated };
  } catch {
    return { isSuccess: false, message: "Failed to publish" };
  }
}

export async function exportCostEstimatePdfAction(
  costEstimateId: string,
  variant: "pdf" | "client_summary_pdf"
): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const fakeUrl = `/exports/cost-estimates/${costEstimateId}/${variant}-${Date.now()}.pdf`;
    const row = await createCostEstimateExport({
      costEstimateId,
      exportType: variant,
      fileUrl: fakeUrl,
      createdByUserId: userId,
    });

    return { isSuccess: true, message: "Export created", data: row };
  } catch {
    return { isSuccess: false, message: "Failed to export" };
  }
}

export async function generateConsolidatedCeAction(rfqId: string): Promise<ActionResult<any>> {
  const list = await getCostEstimatesByRfq(rfqId);
  if (list.length === 0) return { isSuccess: false, message: "No cost estimates found for this RFQ" };

  const source = list[0];
  return generateCostEstimateAction({
    rfqId,
    title: `Consolidated CE - ${new Date().toLocaleDateString()}`,
    agencyId: source.agencyId ?? undefined,
    parentOrgType: "cost_consultant",
    parentOrgId: source.parentOrgId ?? undefined,
    items: [],
  });
}

export async function getCostEstimatesByRfqAction(rfqId: string): Promise<ActionResult<any[]>> {
  try {
    const rows = await getCostEstimatesByRfq(rfqId);
    return { isSuccess: true, message: "Cost estimates fetched", data: rows };
  } catch {
    return { isSuccess: false, message: "Failed", data: [] };
  }
}

export async function getCostEstimateByIdAction(id: string): Promise<ActionResult<any>> {
  try {
    const row = await getCostEstimateById(id);
    if (!row) return { isSuccess: false, message: "Not found" };
    return { isSuccess: true, message: "Fetched", data: row };
  } catch {
    return { isSuccess: false, message: "Failed" };
  }
}
