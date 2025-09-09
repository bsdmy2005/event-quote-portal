"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { orgInvitesTable, InsertOrgInvite, SelectOrgInvite } from "../schema/invites-schema";

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
      .set({ ...data, updatedAt: new Date() })
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
