"use server";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/actions/profiles-actions";

/**
 * Require authentication - throws error if user is not authenticated
 * @returns userId of authenticated user
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  return userId;
}

/**
 * Require admin role - throws error if user is not admin
 * @returns userId of authenticated admin user
 */
export async function requireAdmin(): Promise<string> {
  const userId = await requireAuth();
  
  const userIsAdmin = await isAdmin(userId);
  
  if (!userIsAdmin) {
    throw new Error("Forbidden: Admin access required");
  }
  
  return userId;
}

/**
 * Check if current user is authenticated
 * @returns userId if authenticated, null otherwise
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Check if current user is admin
 * @returns true if user is admin, false otherwise
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;
    return await isAdmin(userId);
  } catch {
    return false;
  }
}

/**
 * Create an unauthorized response for API routes
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Create a forbidden response for API routes
 */
export function forbiddenResponse(message: string = "Forbidden: Admin access required") {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

