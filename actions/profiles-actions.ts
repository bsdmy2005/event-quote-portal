"use server";

import { auth } from "@clerk/nextjs/server";
import { createProfile, deleteProfile, getAllProfiles, getProfileById, updateProfile } from "@/db/queries/profiles-queries";
import { InsertProfile, SelectProfile } from "@/db/schema/profiles-schema";
import { ActionResult } from "@/types/actions/action-types";
import { revalidatePath } from "next/cache";

export async function createProfileAction(data: InsertProfile): Promise<ActionResult<SelectProfile>> {
  try {
    const newProfile = await createProfile(data);
    revalidatePath("/");
    return { isSuccess: true, message: "Profile created successfully", data: newProfile };
  } catch (error) {
    return { isSuccess: false, message: "Failed to create profile" };
  }
}

export async function getProfileByIdAction(userId: string): Promise<ActionResult<SelectProfile | null>> {
  try {
    const profile = await getProfileById(userId);
    return { isSuccess: true, message: "Profile retrieved successfully", data: profile };
  } catch (error) {
    // If profile not found, return success with null data instead of error
    return { isSuccess: true, message: "Profile not found", data: null };
  }
}

export async function getAllProfilesAction(): Promise<ActionResult<SelectProfile[]>> {
  try {
    const profiles = await getAllProfiles();
    return { isSuccess: true, message: "Profiles retrieved successfully", data: profiles };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get profiles" };
  }
}

export async function updateProfileAction(userId: string, data: Partial<InsertProfile>): Promise<ActionResult<SelectProfile>> {
  try {
    const updatedProfile = await updateProfile(userId, data);
    revalidatePath("/");
    return { isSuccess: true, message: "Profile updated successfully", data: updatedProfile };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update profile" };
  }
}

export async function deleteProfileAction(userId: string): Promise<ActionResult<void>> {
  try {
    await deleteProfile(userId);
    revalidatePath("/");
    return { isSuccess: true, message: "Profile deleted successfully" };
  } catch (error) {
    return { isSuccess: false, message: "Failed to delete profile" };
  }
}

export async function getProfileByUserIdAction(userId: string): Promise<ActionResult<SelectProfile | null>> {
  try {
    const profile = await getProfileById(userId);
    return { isSuccess: true, message: "Profile retrieved successfully", data: profile };
  } catch (error) {
    return { isSuccess: true, message: "Profile not found", data: null };
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const profile = await getProfileById(userId);
    return profile.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function getUserProfileAction(): Promise<ActionResult<SelectProfile | null>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { isSuccess: false, message: "User not authenticated" };
    }
    
    const profile = await getProfileById(userId);
    return { isSuccess: true, message: "Profile retrieved successfully", data: profile };
  } catch (error) {
    // If profile not found, return success with null data instead of error
    return { isSuccess: true, message: "Profile not found", data: null };
  }
} 