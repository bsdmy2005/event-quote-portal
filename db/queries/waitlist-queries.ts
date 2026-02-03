"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { InsertWaitlist, SelectWaitlist, waitlistTable } from "../schema/waitlist-schema";

export const createWaitlistEntry = async (data: InsertWaitlist): Promise<SelectWaitlist> => {
  try {
    const [newEntry] = await db.insert(waitlistTable).values(data).returning();
    return newEntry as SelectWaitlist;
  } catch (error) {
    console.error("Error creating waitlist entry:", error);
    throw new Error("Failed to create waitlist entry");
  }
};

export const getWaitlistEntryByEmail = async (email: string): Promise<SelectWaitlist | null> => {
  try {
    const entry = await db.query.waitlistTable.findFirst({
      where: eq(waitlistTable.email, email)
    });
    return entry as SelectWaitlist || null;
  } catch (error) {
    console.error("Error getting waitlist entry by email:", error);
    throw new Error("Failed to get waitlist entry");
  }
};

export const getAllWaitlistEntries = async (): Promise<SelectWaitlist[]> => {
  try {
    const entries = await db.query.waitlistTable.findMany({
      orderBy: (waitlist, { desc }) => [desc(waitlist.createdAt)]
    });
    return entries as SelectWaitlist[];
  } catch (error) {
    console.error("Error getting all waitlist entries:", error);
    throw new Error("Failed to get waitlist entries");
  }
};

export const deleteWaitlistEntry = async (id: string): Promise<void> => {
  try {
    await db.delete(waitlistTable).where(eq(waitlistTable.id, id));
  } catch (error) {
    console.error("Error deleting waitlist entry:", error);
    throw new Error("Failed to delete waitlist entry");
  }
};
