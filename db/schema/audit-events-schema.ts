import { pgTable, uuid, text, timestamp, json, pgEnum } from "drizzle-orm/pg-core";

export const auditOrgTypeEnum = pgEnum("audit_org_type", ["agency", "supplier", "cost_consultant", "admin"]);

export const auditEventsTable = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: text("actor_user_id"),
  orgType: auditOrgTypeEnum("org_type"),
  orgId: uuid("org_id"),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  eventType: text("event_type").notNull(),
  oldValue: json("old_value").$type<Record<string, unknown>>(),
  newValue: json("new_value").$type<Record<string, unknown>>(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertAuditEvent = typeof auditEventsTable.$inferInsert;
export type SelectAuditEvent = typeof auditEventsTable.$inferSelect;
