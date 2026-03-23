"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/actions/action-types";
import { getProfileById } from "@/db/queries/profiles-queries";
import {
  createRfqSubmission,
  createSubmissionDocument,
  getLatestSubmissionBySupplier,
  getSubmissionById,
  getSubmissionsByRfq,
  getSubmissionsBySupplier,
  updateRfqSubmission,
} from "@/db/queries/rfq-submissions-queries";
import { updateRfqInvite } from "@/db/queries/invites-queries";
import { uploadQuotationAction } from "./upload-actions";

export async function createSubmissionDraftAction(rfqId: string, rfqInviteId?: string): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };
    const profile = await getProfileById(userId);

    if (!profile?.supplierId && !profile?.agencyId) {
      return { isSuccess: false, message: "Organization membership required" };
    }

    const existing = profile.supplierId
      ? await getLatestSubmissionBySupplier(rfqId, profile.supplierId)
      : null;

    const version = existing ? existing.submissionVersion + 1 : 1;

    const row = await createRfqSubmission({
      rfqId,
      supplierId: profile.supplierId ?? null,
      rfqInviteId: rfqInviteId ?? null,
      submitterOrgType: profile.supplierId ? "supplier" : "agency",
      submitterOrgId: profile.supplierId ?? profile.agencyId,
      proposalTitle: `Submission v${version}`,
      submissionVersion: version,
      submissionStatus: "submitted",
    });

    revalidatePath(`/rfqs/received`);
    return { isSuccess: true, message: "Submission draft created", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed to create submission" };
  }
}

export async function uploadSubmissionDocumentAction(data: {
  submissionId: string;
  docType: "proposal" | "cost_estimate" | "credentials" | "compliance" | "other";
  base64Data: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const submission = await getSubmissionById(data.submissionId);
    if (!submission) return { isSuccess: false, message: "Submission not found" };

    const upload = await uploadQuotationAction(
      data.base64Data,
      data.fileName,
      data.fileType,
      data.fileSize,
      submission.rfqInviteId || submission.id
    );

    if (!upload.success || !upload.data) {
      return { isSuccess: false, message: upload.error || "Upload failed" };
    }

    const doc = await createSubmissionDocument({
      submissionId: submission.id,
      docType: data.docType,
      fileUrl: upload.data.url,
      fileName: upload.data.name,
      fileSize: upload.data.size,
      mimeType: upload.data.type,
    });

    revalidatePath(`/rfqs/received`);
    return { isSuccess: true, message: "Document uploaded", data: doc };
  } catch (error) {
    return { isSuccess: false, message: "Failed to upload document" };
  }
}

export async function submitProposalAction(submissionId: string, notes?: string): Promise<ActionResult<any>> {
  try {
    const row = await updateRfqSubmission(submissionId, {
      proposalNotes: notes,
      submissionStatus: "submitted",
      lastStatusChangedAt: new Date(),
      submittedAt: new Date(),
    });

    if (row?.rfqInviteId) {
      await updateRfqInvite(row.rfqInviteId, {
        inviteStatus: "submitted",
        lastActivityAt: new Date(),
      });
    }

    revalidatePath(`/rfqs/received`);
    return { isSuccess: true, message: "Proposal submitted", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed to submit proposal" };
  }
}

export async function replaceProposalAction(submissionId: string, notes?: string): Promise<ActionResult<any>> {
  return submitProposalAction(submissionId, notes);
}

export async function updateSubmissionStatusAction(
  submissionId: string,
  status: "submitted" | "under_review" | "shortlisted" | "awarded" | "not_successful"
): Promise<ActionResult<any>> {
  try {
    const row = await updateRfqSubmission(submissionId, {
      submissionStatus: status,
      lastStatusChangedAt: new Date(),
    });

    revalidatePath(`/rfqs`);
    return { isSuccess: true, message: "Submission status updated", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update status" };
  }
}

export async function getSubmissionsByRfqAction(rfqId: string): Promise<ActionResult<any[]>> {
  try {
    const rows = await getSubmissionsByRfq(rfqId);
    return { isSuccess: true, message: "Submissions fetched", data: rows };
  } catch (error) {
    return { isSuccess: false, message: "Failed", data: [] };
  }
}

export async function getMySubmissionsAction(): Promise<ActionResult<any[]>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated", data: [] };
    const profile = await getProfileById(userId);
    if (!profile?.supplierId) return { isSuccess: false, message: "Supplier membership required", data: [] };

    const rows = await getSubmissionsBySupplier(profile.supplierId);
    return { isSuccess: true, message: "My submissions fetched", data: rows };
  } catch {
    return { isSuccess: false, message: "Failed", data: [] };
  }
}
