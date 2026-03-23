"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import { InsertAuditEvent, auditEventsTable } from "@/db/schema/audit-events-schema";

export async function createAuditEvent(data: InsertAuditEvent) {
  const [row] = await db.insert(auditEventsTable).values(data).returning();
  return row;
}

export async function getAuditEventsByEntity(entityType: string, entityId: string) {
  return db.query.auditEventsTable.findMany({
    where: eq(auditEventsTable.entityType, entityType),
    orderBy: [desc(auditEventsTable.createdAt)],
  }).then(rows => rows.filter(r => r.entityId === entityId));
}
