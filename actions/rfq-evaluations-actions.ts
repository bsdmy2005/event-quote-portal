"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/actions/action-types";
import {
  getAwardByRfq,
  getEvaluationTemplatesByAgency,
  getEvaluationsByRfq,
  upsertEvaluationTemplate,
  upsertRfqAward,
  upsertRfqEvaluation,
} from "@/db/queries/rfq-evaluations-queries";
import { getProfileById } from "@/db/queries/profiles-queries";
import { updateSubmissionStatusAction } from "./rfq-submissions-actions";

function computeWeightedTotal(scores: Record<string, number>, criteria: Array<{ name: string; weight: number }>): number {
  return Number(
    criteria.reduce((acc, c) => acc + ((scores[c.name] || 0) * c.weight) / 100, 0).toFixed(2)
  );
}

export async function upsertEvaluationTemplateAction(data: {
  agencyId: string;
  name: string;
  criteria: Array<{ name: string; weight: number; description?: string }>;
  isDefault?: boolean;
}): Promise<ActionResult<any>> {
  try {
    const row = await upsertEvaluationTemplate(data);
    return { isSuccess: true, message: "Template saved", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed to save template" };
  }
}

export async function scoreSubmissionAction(data: {
  rfqId: string;
  submissionId: string;
  scores: Record<string, number>;
  comments?: string;
  criteria: Array<{ name: string; weight: number }>;
}): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const weightedTotal = computeWeightedTotal(data.scores, data.criteria);
    const row = await upsertRfqEvaluation({
      rfqId: data.rfqId,
      submissionId: data.submissionId,
      evaluatorUserId: userId,
      scores: data.scores,
      weightedTotal: String(weightedTotal),
      comments: data.comments,
    });

    revalidatePath(`/rfqs/${data.rfqId}/evaluation`);
    return { isSuccess: true, message: "Scored", data: row };
  } catch (error) {
    return { isSuccess: false, message: "Failed to score" };
  }
}

export async function shortlistSubmissionAction(submissionId: string): Promise<ActionResult<any>> {
  return updateSubmissionStatusAction(submissionId, "shortlisted");
}

export async function awardSubmissionAction(data: {
  rfqId: string;
  winnerSubmissionId: string;
  runnerUpSubmissionId?: string;
  awardReason?: string;
  contractValue?: number;
  awardedBudget?: number;
}): Promise<ActionResult<any>> {
  try {
    const { userId } = await auth();
    if (!userId) return { isSuccess: false, message: "User not authenticated" };

    const award = await upsertRfqAward({
      rfqId: data.rfqId,
      winnerSubmissionId: data.winnerSubmissionId,
      runnerUpSubmissionId: data.runnerUpSubmissionId,
      awardReason: data.awardReason,
      contractValue: data.contractValue ? String(data.contractValue) : null,
      awardedBudget: data.awardedBudget ? String(data.awardedBudget) : null,
      awardedByUserId: userId,
      awardedAt: new Date(),
    });

    await updateSubmissionStatusAction(data.winnerSubmissionId, "awarded");
    if (data.runnerUpSubmissionId) {
      await updateSubmissionStatusAction(data.runnerUpSubmissionId, "shortlisted");
    }

    revalidatePath(`/rfqs/${data.rfqId}/evaluation`);
    return { isSuccess: true, message: "Award recorded", data: award };
  } catch (error) {
    return { isSuccess: false, message: "Failed to record award" };
  }
}

export async function setNotSuccessfulAction(submissionId: string): Promise<ActionResult<any>> {
  return updateSubmissionStatusAction(submissionId, "not_successful");
}

export async function getEvaluationsByRfqAction(rfqId: string): Promise<ActionResult<any[]>> {
  try {
    const rows = await getEvaluationsByRfq(rfqId);
    return { isSuccess: true, message: "Evaluations fetched", data: rows };
  } catch {
    return { isSuccess: false, message: "Failed", data: [] };
  }
}

export async function getAwardByRfqAction(rfqId: string): Promise<ActionResult<any>> {
  try {
    const row = await getAwardByRfq(rfqId);
    return { isSuccess: true, message: "Award fetched", data: row };
  } catch {
    return { isSuccess: false, message: "Failed" };
  }
}

export async function getEvaluationTemplatesByAgencyAction(agencyId: string): Promise<ActionResult<any[]>> {
  try {
    const rows = await getEvaluationTemplatesByAgency(agencyId);
    return { isSuccess: true, message: "Templates fetched", data: rows };
  } catch {
    return { isSuccess: false, message: "Failed", data: [] };
  }
}
