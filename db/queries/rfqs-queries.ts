import { db } from "../db";
import { rfqsTable, rfqInvitesTable, quotationsTable } from "../schema";
import { eq, and, desc, asc } from "drizzle-orm";

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
    .select()
    .from(rfqInvitesTable)
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
