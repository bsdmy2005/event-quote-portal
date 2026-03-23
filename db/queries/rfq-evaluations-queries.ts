"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  InsertRfqAward,
  InsertRfqEvaluation,
  InsertRfqEvaluationTemplate,
  rfqAwardsTable,
  rfqEvaluationsTable,
  rfqEvaluationTemplatesTable,
} from "@/db/schema/rfq-evaluations-schema";

export async function upsertEvaluationTemplate(data: InsertRfqEvaluationTemplate) {
  const [row] = await db.insert(rfqEvaluationTemplatesTable).values(data).returning();
  return row;
}

export async function getEvaluationTemplatesByAgency(agencyId: string) {
  return db.query.rfqEvaluationTemplatesTable.findMany({
    where: eq(rfqEvaluationTemplatesTable.agencyId, agencyId),
  });
}

export async function upsertRfqEvaluation(data: InsertRfqEvaluation) {
  const existing = await db.query.rfqEvaluationsTable.findFirst({
    where: and(
      eq(rfqEvaluationsTable.rfqId, data.rfqId as string),
      eq(rfqEvaluationsTable.submissionId, data.submissionId as string),
      eq(rfqEvaluationsTable.evaluatorUserId, data.evaluatorUserId as string)
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(rfqEvaluationsTable)
      .set(data)
      .where(eq(rfqEvaluationsTable.id, existing.id))
      .returning();
    return updated;
  }

  const [inserted] = await db.insert(rfqEvaluationsTable).values(data).returning();
  return inserted;
}

export async function getEvaluationsByRfq(rfqId: string) {
  return db.query.rfqEvaluationsTable.findMany({
    where: eq(rfqEvaluationsTable.rfqId, rfqId),
  });
}

export async function upsertRfqAward(data: InsertRfqAward) {
  const existing = await db.query.rfqAwardsTable.findFirst({
    where: eq(rfqAwardsTable.rfqId, data.rfqId as string),
  });

  if (existing) {
    const [updated] = await db
      .update(rfqAwardsTable)
      .set(data)
      .where(eq(rfqAwardsTable.id, existing.id))
      .returning();
    return updated;
  }

  const [inserted] = await db.insert(rfqAwardsTable).values(data).returning();
  return inserted;
}

export async function getAwardByRfq(rfqId: string) {
  return db.query.rfqAwardsTable.findFirst({
    where: eq(rfqAwardsTable.rfqId, rfqId),
  });
}
