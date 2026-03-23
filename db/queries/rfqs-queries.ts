import { db } from "../db";
import { rfqsTable, rfqInvitesTable, quotationsTable, suppliersTable } from "../schema";
import { eq, and, desc, asc, gte, or, ilike } from "drizzle-orm";
import { InsertRfq } from "../schema/rfqs-schema";

// RFQ queries
export async function getAllRfqs() {
  return await db.select().from(rfqsTable).orderBy(desc(rfqsTable.createdAt));
}

export async function getRfqById(id: string) {
  const result = await db
    .select()
    .from(rfqsTable)
    .where(eq(rfqsTable.id, id))
    .limit(1);
  return result[0];
}

export async function getRfqsByAgency(agencyId: string) {
  return await db
    .select()
    .from(rfqsTable)
    .where(eq(rfqsTable.agencyId, agencyId))
    .orderBy(desc(rfqsTable.createdAt));
}

export async function getPublishedRfqsForSupplier(filters?: {
  query?: string;
  projectType?: string;
}) {
  if (filters?.query) {
    return await db
      .select()
      .from(rfqsTable)
      .where(
        and(
          or(eq(rfqsTable.status, "published"), eq(rfqsTable.status, "sent")),
          gte(rfqsTable.deadlineAt, new Date()),
          ilike(rfqsTable.title, `%${filters.query}%`)
        )
      )
      .orderBy(asc(rfqsTable.deadlineAt));
  }

  return await db
    .select()
    .from(rfqsTable)
    .where(
      and(
        or(eq(rfqsTable.status, "published"), eq(rfqsTable.status, "sent")),
        gte(rfqsTable.deadlineAt, new Date())
      )
    )
    .orderBy(asc(rfqsTable.deadlineAt));
}

export async function getRfqsByCreator(userId: string) {
  return await db
    .select()
    .from(rfqsTable)
    .where(eq(rfqsTable.createdByUserId, userId))
    .orderBy(desc(rfqsTable.createdAt));
}

// RFQ Invite queries
export async function getRfqInvitesByRfq(rfqId: string) {
  return await db
    .select({
      id: rfqInvitesTable.id,
      rfqId: rfqInvitesTable.rfqId,
      supplierId: rfqInvitesTable.supplierId,
      inviteStatus: rfqInvitesTable.inviteStatus,
      lastActivityAt: rfqInvitesTable.lastActivityAt,
      createdAt: rfqInvitesTable.createdAt,
      supplierName: suppliersTable.name,
      supplierEmail: suppliersTable.email,
      supplierContactName: suppliersTable.contactName,
    })
    .from(rfqInvitesTable)
    .leftJoin(suppliersTable, eq(rfqInvitesTable.supplierId, suppliersTable.id))
    .where(eq(rfqInvitesTable.rfqId, rfqId))
    .orderBy(asc(rfqInvitesTable.createdAt));
}

export async function getRfqInvitesBySupplier(supplierId: string) {
  return await db
    .select()
    .from(rfqInvitesTable)
    .where(eq(rfqInvitesTable.supplierId, supplierId))
    .orderBy(desc(rfqInvitesTable.createdAt));
}

export async function getRfqInviteById(id: string) {
  const result = await db
    .select()
    .from(rfqInvitesTable)
    .where(eq(rfqInvitesTable.id, id))
    .limit(1);
  return result[0];
}

// Quotation queries
export async function getQuotationsByRfqInvite(rfqInviteId: string) {
  return await db
    .select()
    .from(quotationsTable)
    .where(eq(quotationsTable.rfqInviteId, rfqInviteId))
    .orderBy(desc(quotationsTable.submittedAt));
}

export async function getLatestQuotationByRfqInvite(rfqInviteId: string) {
  const result = await db
    .select()
    .from(quotationsTable)
    .where(eq(quotationsTable.rfqInviteId, rfqInviteId))
    .orderBy(desc(quotationsTable.submittedAt))
    .limit(1);
  return result[0];
}

export async function getQuotationsBySupplier(supplierId: string) {
  return await db
    .select()
    .from(quotationsTable)
    .where(eq(quotationsTable.supplierId, supplierId))
    .orderBy(desc(quotationsTable.submittedAt));
}

// CRUD operations for RFQs
export async function createRfq(data: InsertRfq) {
  const [newRfq] = await db.insert(rfqsTable).values(data).returning();
  return newRfq;
}

export async function updateRfq(id: string, data: Partial<InsertRfq>) {
  const [updatedRfq] = await db
    .update(rfqsTable)
    .set(data)
    .where(eq(rfqsTable.id, id))
    .returning();
  return updatedRfq;
}

export async function publishRfq(id: string) {
  return updateRfq(id, {
    status: "published" as any,
    publishedAt: new Date(),
  });
}

export async function moveRfqToEvaluation(id: string) {
  return updateRfq(id, {
    status: "evaluation" as any,
  });
}

export async function awardRfq(id: string) {
  return updateRfq(id, {
    status: "awarded",
    awardedAt: new Date(),
  });
}

export async function closeRfq(id: string) {
  return updateRfq(id, {
    status: "closed",
    closedAt: new Date(),
  });
}

export async function deleteRfq(id: string) {
  await db.delete(rfqsTable).where(eq(rfqsTable.id, id));
}
