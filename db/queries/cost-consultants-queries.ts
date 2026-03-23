"use server";

import { eq, ilike } from "drizzle-orm";
import { db } from "@/db/db";
import {
  costConsultantsTable,
  InsertCostConsultant,
  SelectCostConsultant,
} from "@/db/schema/organizations-schema";

export async function createCostConsultant(data: InsertCostConsultant): Promise<SelectCostConsultant> {
  const [row] = await db.insert(costConsultantsTable).values(data).returning();
  return row;
}

export async function getCostConsultantById(id: string): Promise<SelectCostConsultant> {
  const row = await db.query.costConsultantsTable.findFirst({
    where: eq(costConsultantsTable.id, id),
  });
  if (!row) throw new Error("Cost consultant not found");
  return row;
}

export async function getAllCostConsultants(): Promise<SelectCostConsultant[]> {
  return db.select().from(costConsultantsTable);
}

export async function updateCostConsultant(
  id: string,
  data: Partial<InsertCostConsultant>
): Promise<SelectCostConsultant> {
  const [row] = await db
    .update(costConsultantsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(costConsultantsTable.id, id))
    .returning();
  if (!row) throw new Error("Cost consultant not found");
  return row;
}

export async function deleteCostConsultant(id: string): Promise<void> {
  await db.delete(costConsultantsTable).where(eq(costConsultantsTable.id, id));
}

export async function searchCostConsultants(query: string): Promise<SelectCostConsultant[]> {
  return db
    .select()
    .from(costConsultantsTable)
    .where(ilike(costConsultantsTable.name, `%${query}%`));
}
