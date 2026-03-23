"use server";

import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/actions/action-types";
import {
  createCostConsultant,
  deleteCostConsultant,
  getAllCostConsultants,
  getCostConsultantById,
  searchCostConsultants,
  updateCostConsultant,
} from "@/db/queries/cost-consultants-queries";
import { InsertCostConsultant, SelectCostConsultant } from "@/db/schema/organizations-schema";

export async function createCostConsultantAction(
  data: InsertCostConsultant
): Promise<ActionResult<SelectCostConsultant>> {
  try {
    const row = await createCostConsultant(data);
    revalidatePath("/organization");
    return { isSuccess: true, message: "Cost consultant created", data: row };
  } catch (error) {
    return { isSuccess: false, message: error instanceof Error ? error.message : "Failed" };
  }
}

export async function getCostConsultantByIdAction(id: string): Promise<ActionResult<SelectCostConsultant>> {
  try {
    const row = await getCostConsultantById(id);
    return { isSuccess: true, message: "Found", data: row };
  } catch (error) {
    return { isSuccess: false, message: error instanceof Error ? error.message : "Failed" };
  }
}

export async function getAllCostConsultantsAction(): Promise<ActionResult<SelectCostConsultant[]>> {
  try {
    const rows = await getAllCostConsultants();
    return { isSuccess: true, message: "Found", data: rows };
  } catch (error) {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function updateCostConsultantAction(
  id: string,
  data: Partial<InsertCostConsultant>
): Promise<ActionResult<SelectCostConsultant>> {
  try {
    const row = await updateCostConsultant(id, data);
    revalidatePath("/organization");
    return { isSuccess: true, message: "Updated", data: row };
  } catch (error) {
    return { isSuccess: false, message: error instanceof Error ? error.message : "Failed" };
  }
}

export async function deleteCostConsultantAction(id: string): Promise<ActionResult<void>> {
  try {
    await deleteCostConsultant(id);
    revalidatePath("/organization");
    return { isSuccess: true, message: "Deleted", data: undefined };
  } catch (error) {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function searchCostConsultantsAction(query: string): Promise<ActionResult<SelectCostConsultant[]>> {
  try {
    const rows = await searchCostConsultants(query);
    return { isSuccess: true, message: "Search complete", data: rows };
  } catch (error) {
    return { isSuccess: false, message: "Failed" };
  }
}
