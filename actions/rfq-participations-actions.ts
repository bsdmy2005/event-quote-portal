"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/actions/action-types";
import {
  getParticipationByRfqAndSupplier,
  getParticipationsByRfq,
  upsertRfqParticipation,
} from "@/db/queries/rfq-participations-queries";
import { getProfileById } from "@/db/queries/profiles-queries";

export async function expressInterestAction(rfqId: string): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const profile = await getProfileById(userId);
    if (!profile?.supplierId) {
      return { isSuccess: false, message: "Supplier membership required" };
    }

    const row = await upsertRfqParticipation({
      rfqId,
      supplierId: profile.supplierId,
      expressedInterestAt: new Date(),
      ndaRequired: true,
    });

    revalidatePath(`/rfqs/marketplace/${rfqId}`);
    return { isSuccess: true, message: "Interest recorded", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed to express interest" };
  }
}

export async function acceptNdaAction(
  rfqId: string,
  metadata?: { ip?: string; userAgent?: string }
): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const profile = await getProfileById(userId);
    if (!profile?.supplierId) {
      return { isSuccess: false, message: "Supplier membership required" };
    }

    const row = await upsertRfqParticipation({
      rfqId,
      supplierId: profile.supplierId,
      ndaRequired: true,
      ndaAccepted: true,
      ndaAcceptedAt: new Date(),
      ndaIp: metadata?.ip,
      ndaUserAgent: metadata?.userAgent,
      briefUnlockedAt: new Date(),
    });

    revalidatePath(`/rfqs/marketplace/${rfqId}`);
    revalidatePath(`/rfqs/marketplace/${rfqId}/brief`);
    return { isSuccess: true, message: "NDA accepted", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed to accept NDA" };
  }
}

export async function getParticipationAction(rfqId: string): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const profile = await getProfileById(userId);
    if (!profile?.supplierId) return { isSuccess: false, message: "Supplier membership required" };

    const row = await getParticipationByRfqAndSupplier(rfqId, profile.supplierId);
    return { isSuccess: true, message: "Participation fetched", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function getParticipationsByRfqAction(rfqId: string): Promise<ActionResult<any[]>> {
  try {
    const rows = await getParticipationsByRfq(rfqId);
    return { isSuccess: true, message: "Participations fetched", data: rows };
  } catch (error) {
    return { isSuccess: false, message: "Failed", data: [] };
  }
}
