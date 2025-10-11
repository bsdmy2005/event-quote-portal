"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { orgInvitesTable, rfqInvitesTable, InsertOrgInvite, SelectOrgInvite, InsertRfqInvite, SelectRfqInvite } from "../schema/invites-schema";

export const createOrgInvite = async (data: InsertOrgInvite): Promise<SelectOrgInvite> => {
  try {
    const [newInvite] = await db.insert(orgInvitesTable).values(data).returning();
    return newInvite as SelectOrgInvite;
  } catch (error) {
    console.error("Error creating organization invite:", error);
    throw new Error("Failed to create organization invite");
  }
};

export const getOrgInviteByTokenHash = async (tokenHash: string): Promise<SelectOrgInvite | null> => {
  try {
    const invite = await db.query.orgInvitesTable.findFirst({
      where: eq(orgInvitesTable.tokenHash, tokenHash)
    });
    return invite as SelectOrgInvite || null;
  } catch (error) {
    console.error("Error getting organization invite by token hash:", error);
    throw new Error("Failed to get organization invite");
  }
};

export const updateOrgInvite = async (id: string, data: Partial<InsertOrgInvite>): Promise<SelectOrgInvite> => {
  try {
    const [updatedInvite] = await db.update(orgInvitesTable)
      .set(data)
      .where(eq(orgInvitesTable.id, id))
      .returning();
    
    if (!updatedInvite) {
      throw new Error("Organization invite not found");
    }
    return updatedInvite as SelectOrgInvite;
  } catch (error) {
    console.error("Error updating organization invite:", error);
    throw new Error("Failed to update organization invite");
  }
};

export const getOrgInviteByEmail = async (email: string): Promise<SelectOrgInvite | null> => {
  try {
    const invite = await db.query.orgInvitesTable.findFirst({
      where: eq(orgInvitesTable.email, email)
    });
    return invite as SelectOrgInvite || null;
  } catch (error) {
    console.error("Error getting organization invite by email:", error);
    throw new Error("Failed to get organization invite by email");
  }
};

export const getOrgInvitesByEmail = async (email: string): Promise<SelectOrgInvite[]> => {
  try {
    const invites = await db.query.orgInvitesTable.findMany({
      where: eq(orgInvitesTable.email, email)
    });
    return invites as SelectOrgInvite[];
  } catch (error) {
    console.error("Error getting organization invites by email:", error);
    throw new Error("Failed to get organization invites by email");
  }
};

export const getOrgInvitesByOrganization = async (orgType: "agency" | "supplier", orgId: string): Promise<SelectOrgInvite[]> => {
  try {
    const invites = await db.query.orgInvitesTable.findMany({
      where: eq(orgInvitesTable.orgId, orgId)
    });
    return invites as SelectOrgInvite[];
  } catch (error) {
    console.error("Error getting organization invites by organization:", error);
    throw new Error("Failed to get organization invites by organization");
  }
};

// RFQ Invite functions
export const createRfqInvite = async (data: InsertRfqInvite): Promise<SelectRfqInvite> => {
  try {
    const [newInvite] = await db.insert(rfqInvitesTable).values(data).returning();
    return newInvite as SelectRfqInvite;
  } catch (error) {
    console.error("Error creating RFQ invite:", error);
    throw new Error("Failed to create RFQ invite");
  }
};

export const getRfqInviteById = async (id: string): Promise<SelectRfqInvite | null> => {
  try {
    const invite = await db.query.rfqInvitesTable.findFirst({
      where: eq(rfqInvitesTable.id, id)
    });
    return invite as SelectRfqInvite || null;
  } catch (error) {
    console.error("Error getting RFQ invite by ID:", error);
    throw new Error("Failed to get RFQ invite");
  }
};

export const updateRfqInvite = async (id: string, data: Partial<InsertRfqInvite>): Promise<SelectRfqInvite> => {
  try {
    const [updatedInvite] = await db.update(rfqInvitesTable)
      .set(data)
      .where(eq(rfqInvitesTable.id, id))
      .returning();
    
    if (!updatedInvite) {
      throw new Error("RFQ invite not found");
    }
    return updatedInvite as SelectRfqInvite;
  } catch (error) {
    console.error("Error updating RFQ invite:", error);
    throw new Error("Failed to update RFQ invite");
  }
};
