"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { InsertProfile, SelectProfile, profilesTable } from "../schema/profiles-schema";

export const createProfile = async (data: InsertProfile): Promise<SelectProfile> => {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning();
    return newProfile as SelectProfile;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw new Error("Failed to create profile");
  }
};

export const getProfileById = async (userId: string): Promise<SelectProfile> => {
  try {
    const profile = await db.query.profilesTable.findFirst({
      where: eq(profilesTable.userId, userId)
    });
    if (!profile) {
      throw new Error("Profile not found");
    }
    return profile as SelectProfile;
  } catch (error) {
    console.error("Error getting profile by ID:", error);
    throw new Error("Failed to get profile");
  }
};

export const getAllProfiles = async (): Promise<SelectProfile[]> => {
  const profiles = await db.query.profilesTable.findMany();
  return profiles as SelectProfile[];
};

export const updateProfile = async (userId: string, data: Partial<InsertProfile>): Promise<SelectProfile> => {
  try {
    const [updatedProfile] = await db.update(profilesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profilesTable.userId, userId))
      .returning();
    return updatedProfile as SelectProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
};

export const deleteProfile = async (userId: string): Promise<void> => {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId));
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw new Error("Failed to delete profile");
  }
};

export const getProfileByEmail = async (email: string): Promise<SelectProfile | null> => {
  try {
    const profile = await db.query.profilesTable.findFirst({
      where: eq(profilesTable.email, email)
    });
    return profile as SelectProfile || null;
  } catch (error) {
    console.error("Error getting profile by email:", error);
    throw new Error("Failed to get profile by email");
  }
};

export const getProfileWithOrganization = async (userId: string) => {
  try {
    const profile = await db.query.profilesTable.findFirst({
      where: eq(profilesTable.userId, userId),
      with: {
        agency: true,
        supplier: true,
        costConsultant: true,
      }
    });
    return profile;
  } catch (error) {
    console.error("Error getting profile with organization:", error);
    throw new Error("Failed to get profile with organization");
  }
};

export const getProfilesByOrganization = async (
  orgType: "agency" | "supplier" | "cost_consultant",
  orgId: string
) => {
  try {
    const whereClause =
      orgType === "agency"
        ? eq(profilesTable.agencyId, orgId)
        : orgType === "supplier"
          ? eq(profilesTable.supplierId, orgId)
          : eq(profilesTable.costConsultantId, orgId);

    const profiles = await db.query.profilesTable.findMany({
      where: whereClause
    });
    return profiles;
  } catch (error) {
    console.error("Error getting profiles by organization:", error);
    throw new Error("Failed to get profiles by organization");
  }
}; 
