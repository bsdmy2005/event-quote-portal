"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  InsertRfqParticipation,
  SelectRfqParticipation,
  rfqParticipationsTable,
} from "@/db/schema/rfq-participations-schema";

export async function upsertRfqParticipation(
  data: InsertRfqParticipation
): Promise<SelectRfqParticipation> {
  const existing = await db.query.rfqParticipationsTable.findFirst({
    where: and(
      eq(rfqParticipationsTable.rfqId, data.rfqId as string),
      eq(rfqParticipationsTable.supplierId, data.supplierId as string)
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(rfqParticipationsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(rfqParticipationsTable.id, existing.id))
      .returning();
    return updated;
  }

  const [inserted] = await db.insert(rfqParticipationsTable).values(data).returning();
  return inserted;
}

export async function getParticipationByRfqAndSupplier(rfqId: string, supplierId: string) {
  return db.query.rfqParticipationsTable.findFirst({
    where: and(eq(rfqParticipationsTable.rfqId, rfqId), eq(rfqParticipationsTable.supplierId, supplierId)),
  });
}

export async function getParticipationsByRfq(rfqId: string) {
  return db.query.rfqParticipationsTable.findMany({
    where: eq(rfqParticipationsTable.rfqId, rfqId),
  });
}
