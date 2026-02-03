"use server";

import { createWaitlistEntry, getWaitlistEntryByEmail, getAllWaitlistEntries } from "@/db/queries/waitlist-queries";
import { InsertWaitlist, SelectWaitlist } from "@/db/schema/waitlist-schema";
import { ActionResult } from "@/types/actions/action-types";
import { revalidatePath } from "next/cache";

export async function joinWaitlistAction(data: InsertWaitlist): Promise<ActionResult<SelectWaitlist>> {
  try {
    // Check if email already exists
    const existingEntry = await getWaitlistEntryByEmail(data.email);
    if (existingEntry) {
      return { isSuccess: false, message: "This email is already on our waitlist" };
    }

    const newEntry = await createWaitlistEntry(data);
    revalidatePath("/waitlist");
    return { isSuccess: true, message: "Successfully joined the waitlist!", data: newEntry };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return { isSuccess: false, message: "Failed to join waitlist. Please try again." };
  }
}

export async function checkWaitlistEmailAction(email: string): Promise<ActionResult<boolean>> {
  try {
    const existingEntry = await getWaitlistEntryByEmail(email);
    return {
      isSuccess: true,
      message: existingEntry ? "Email already registered" : "Email available",
      data: !!existingEntry
    };
  } catch (error) {
    return { isSuccess: false, message: "Failed to check email" };
  }
}

export async function getWaitlistEntriesAction(): Promise<ActionResult<SelectWaitlist[]>> {
  try {
    const entries = await getAllWaitlistEntries();
    return { isSuccess: true, message: "Waitlist entries retrieved", data: entries };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get waitlist entries" };
  }
}
