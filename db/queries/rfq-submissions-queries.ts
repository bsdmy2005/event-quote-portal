"use server";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  InsertRfqSubmission,
  InsertRfqSubmissionDocument,
  rfqSubmissionDocumentsTable,
  rfqSubmissionsTable,
} from "@/db/schema/rfq-submissions-schema";

export async function createRfqSubmission(data: InsertRfqSubmission) {
  const [row] = await db.insert(rfqSubmissionsTable).values(data).returning();
  return row;
}

export async function updateRfqSubmission(id: string, data: Partial<InsertRfqSubmission>) {
  const [row] = await db
    .update(rfqSubmissionsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(rfqSubmissionsTable.id, id))
    .returning();
  return row;
}

export async function getSubmissionById(id: string) {
  return db.query.rfqSubmissionsTable.findFirst({
    where: eq(rfqSubmissionsTable.id, id),
    with: { documents: true },
  });
}

export async function getSubmissionsByRfq(rfqId: string) {
  return db.query.rfqSubmissionsTable.findMany({
    where: eq(rfqSubmissionsTable.rfqId, rfqId),
    with: { documents: true },
    orderBy: [desc(rfqSubmissionsTable.submittedAt)],
  });
}

export async function getSubmissionsBySupplier(supplierId: string) {
  return db.query.rfqSubmissionsTable.findMany({
    where: eq(rfqSubmissionsTable.supplierId, supplierId),
    with: { documents: true },
    orderBy: [desc(rfqSubmissionsTable.submittedAt)],
  });
}

export async function getLatestSubmissionBySupplier(rfqId: string, supplierId: string) {
  return db.query.rfqSubmissionsTable.findFirst({
    where: and(eq(rfqSubmissionsTable.rfqId, rfqId), eq(rfqSubmissionsTable.supplierId, supplierId)),
    orderBy: [desc(rfqSubmissionsTable.submissionVersion)],
    with: { documents: true },
  });
}

export async function createSubmissionDocument(data: InsertRfqSubmissionDocument) {
  const [row] = await db.insert(rfqSubmissionDocumentsTable).values(data).returning();
  return row;
}
