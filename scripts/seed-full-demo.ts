#!/usr/bin/env tsx

import { config } from "dotenv";
import { db } from "../db/db";
import {
  agenciesTable,
  suppliersTable,
  costConsultantsTable,
  categoriesTable,
  profilesTable,
  orgInvitesTable,
  rfqsTable,
  rfqInvitesTable,
  rfqParticipationsTable,
  rfqSubmissionsTable,
  rfqSubmissionDocumentsTable,
  rfqEvaluationTemplatesTable,
  rfqEvaluationsTable,
  rfqAwardsTable,
  costEstimatesTable,
  costEstimateItemsTable,
  costEstimateVersionsTable,
  costEstimateExportsTable,
  supplierPerformanceMetricsTable,
  supplierRankingSnapshotsTable,
  auditEventsTable,
} from "../db/schema";

config({ path: ".env.local" });

type Supplier = typeof suppliersTable.$inferSelect;
type Agency = typeof agenciesTable.$inferSelect;

const RUN_TAG = new Date().toISOString().replace(/[:.]/g, "-");

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickMany<T>(arr: T[], count: number): T[] {
  const clone = [...arr];
  const picked: T[] = [];
  while (clone.length && picked.length < count) {
    picked.push(clone.splice(rand(0, clone.length - 1), 1)[0]);
  }
  return picked;
}

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const requiredCategorySeed = [
  "Audio Visual Equipment",
  "Corporate Catering",
  "Event Decor",
  "Event Security",
  "Live Streaming Services",
  "Event Marketing",
  "Conference Centers",
  "Corporate Entertainment",
];

async function seedCategoriesIfNeeded() {
  await db
    .insert(categoriesTable)
    .values(requiredCategorySeed.map((name) => ({ name })))
    .onConflictDoNothing();
}

async function createAgencies() {
  const payload = Array.from({ length: 3 }).map((_, i) => ({
    name: `Demo Agency ${i + 1} ${RUN_TAG}`,
    contactName: `Agency Contact ${i + 1}`,
    email: `demo.agency.${i + 1}.${RUN_TAG}@quoteportal.local`,
    phone: `+27 11 700 10${i}`,
    website: `https://demo-agency-${i + 1}.local`,
    location: { city: "Johannesburg", province: "Gauteng", country: "South Africa" },
    interestCategories: pickMany(requiredCategorySeed, 4),
    about: `Demo seeded agency ${i + 1} for invite and RFQ flow validation.`,
    status: "active" as const,
    isPublished: true,
  }));
  return db.insert(agenciesTable).values(payload).returning();
}

async function createSuppliers() {
  const cities = ["Johannesburg", "Cape Town", "Durban", "Pretoria"];
  const payload = Array.from({ length: 12 }).map((_, i) => ({
    name: `Demo Supplier ${i + 1} ${RUN_TAG}`,
    contactName: `Supplier Contact ${i + 1}`,
    email: `demo.supplier.${i + 1}.${RUN_TAG}@quoteportal.local`,
    phone: `+27 12 800 20${i}`,
    location: {
      city: cities[i % cities.length],
      province: i % 2 === 0 ? "Gauteng" : "Western Cape",
      country: "South Africa",
    },
    serviceCategories: pickMany(requiredCategorySeed, 3),
    servicesText: `Demo supplier ${i + 1} delivers full event support services.`,
    status: "active" as const,
    isPublished: true,
    brochureUrl: `https://example.com/demo/supplier-${i + 1}/brochure.pdf`,
    idImageUrl: `https://example.com/demo/supplier-${i + 1}/id.jpg`,
    logoUrl: `https://example.com/demo/supplier-${i + 1}/logo.png`,
  }));
  return db.insert(suppliersTable).values(payload).returning();
}

async function createCostConsultants() {
  const payload = Array.from({ length: 2 }).map((_, i) => ({
    name: `Demo Cost Consultant ${i + 1} ${RUN_TAG}`,
    contactName: `Cost Consultant Contact ${i + 1}`,
    email: `demo.cc.${i + 1}.${RUN_TAG}@quoteportal.local`,
    phone: `+27 21 900 30${i}`,
    website: `https://demo-cost-consultant-${i + 1}.local`,
    location: { city: "Cape Town", province: "Western Cape", country: "South Africa" },
    serviceCategories: ["Cost Benchmarking", "Procurement Advisory", "Bid Scoring"],
    about: `Demo cost consultant ${i + 1} for marketplace and estimate workflows.`,
    status: "active" as const,
    isPublished: true,
  }));
  return db.insert(costConsultantsTable).values(payload).returning();
}

async function createProfiles(agencies: Agency[], suppliers: Supplier[], costConsultants: Array<typeof costConsultantsTable.$inferSelect>) {
  const profileRows = [
    ...agencies.flatMap((agency, i) => [
      {
        userId: `seed-${RUN_TAG}-agency-admin-${i + 1}`,
        firstName: "Agency",
        lastName: `Admin${i + 1}`,
        email: `agency.admin.${i + 1}.${RUN_TAG}@quoteportal.local`,
        role: "agency_admin" as const,
        agencyId: agency.id,
      },
      {
        userId: `seed-${RUN_TAG}-agency-member-${i + 1}`,
        firstName: "Agency",
        lastName: `Evaluator${i + 1}`,
        email: `agency.evaluator.${i + 1}.${RUN_TAG}@quoteportal.local`,
        role: "agency_member" as const,
        agencyId: agency.id,
      },
    ]),
    ...suppliers.slice(0, 8).map((supplier, i) => ({
      userId: `seed-${RUN_TAG}-supplier-admin-${i + 1}`,
      firstName: "Supplier",
      lastName: `Admin${i + 1}`,
      email: `supplier.admin.${i + 1}.${RUN_TAG}@quoteportal.local`,
      role: "supplier_admin" as const,
      supplierId: supplier.id,
    })),
    ...costConsultants.map((cc, i) => ({
      userId: `seed-${RUN_TAG}-cc-admin-${i + 1}`,
      firstName: "Cost",
      lastName: `Consultant${i + 1}`,
      email: `cc.admin.${i + 1}.${RUN_TAG}@quoteportal.local`,
      role: "cost_consultant_admin" as const,
      costConsultantId: cc.id,
    })),
  ];

  return db.insert(profilesTable).values(profileRows).returning();
}

async function createOrgInvites(agencies: Agency[], suppliers: Supplier[], costConsultants: Array<typeof costConsultantsTable.$inferSelect>) {
  const rows = [
    ...agencies.flatMap((a, i) =>
      [1, 2, 3].map((j) => ({
        orgType: "agency" as const,
        orgId: a.id,
        email: `agency.invite.${i + 1}.${j}.${RUN_TAG}@quoteportal.local`,
        role: j === 1 ? "agency_admin" : "agency_member",
        tokenHash: `tok-agency-${RUN_TAG}-${i + 1}-${j}`,
        expiresAt: dateOffset(7 + j),
      })),
    ),
    ...suppliers.slice(0, 8).flatMap((s, i) =>
      [1, 2].map((j) => ({
        orgType: "supplier" as const,
        orgId: s.id,
        email: `supplier.invite.${i + 1}.${j}.${RUN_TAG}@quoteportal.local`,
        role: j === 1 ? "supplier_admin" : "supplier_member",
        tokenHash: `tok-supplier-${RUN_TAG}-${i + 1}-${j}`,
        expiresAt: dateOffset(10 + j),
      })),
    ),
    ...costConsultants.flatMap((cc, i) =>
      [1, 2].map((j) => ({
        orgType: "cost_consultant" as const,
        orgId: cc.id,
        email: `cc.invite.${i + 1}.${j}.${RUN_TAG}@quoteportal.local`,
        role: j === 1 ? "cost_consultant_admin" : "cost_consultant_member",
        tokenHash: `tok-cc-${RUN_TAG}-${i + 1}-${j}`,
        expiresAt: dateOffset(14 + j),
      })),
    ),
  ];
  return db.insert(orgInvitesTable).values(rows).returning();
}

async function createRfqs(agencies: Agency[], suppliers: Supplier[], profiles: Array<typeof profilesTable.$inferSelect>, costConsultants: Array<typeof costConsultantsTable.$inferSelect>) {
  const agencyAdminByAgency = new Map(
    profiles
      .filter((p) => p.role === "agency_admin" && p.agencyId)
      .map((p) => [p.agencyId as string, p]),
  );

  const rfqRows: Array<typeof rfqsTable.$inferInsert> = agencies.flatMap((agency, idx) =>
    Array.from({ length: 3 }).map((_, i) => {
      const createdBy = agencyAdminByAgency.get(agency.id)!;
      const isMarketplace = i === 2;
      const projectType = (["physical_event", "brand_activation", "conference_expo"] as const)[i % 3];
      const status = (["published", "evaluation", "awarded"] as const)[i % 3];
      const issuerType: typeof rfqsTable.$inferInsert["issuerType"] = isMarketplace ? "cost_consultant" : "agency";
      const cc = costConsultants[(idx + i) % costConsultants.length];
      return {
        agencyId: agency.id,
        createdByUserId: createdBy.userId,
        title: `${agency.name} RFQ ${i + 1} ${RUN_TAG}`,
        clientName: `Client ${idx + 1}-${i + 1}`,
        eventDates: {
          start: dateOffset(20 + idx * 5 + i).toISOString(),
          end: dateOffset(22 + idx * 5 + i).toISOString(),
        },
        venue: isMarketplace ? "TBD (NDA required)" : "Sandton Convention Centre",
        scope: "End-to-end event production, AV, staging, catering, staffing, and reporting.",
        eventType: i % 2 === 0 ? "Conference" : "Product Launch",
        projectType,
        issuerType,
        issuerOrgId: isMarketplace ? cc.id : agency.id,
        recipientType: "supplier" as const,
        budgetMin: `${200000 + i * 50000}`,
        budgetMax: `${800000 + i * 100000}`,
        locationCity: idx % 2 === 0 ? "Johannesburg" : "Cape Town",
        locationProvince: idx % 2 === 0 ? "Gauteng" : "Western Cape",
        locationCountry: "South Africa",
        requiredServices: pickMany(requiredCategorySeed, 4),
        submissionTemplate: {
          sections: ["Approach", "Commercials", "Timeline", "Team", "Compliance"],
          requiredAttachments: ["Company Profile", "SARS PIN", "CSD", "B-BBEE Certificate"],
        },
        ndaRequired: isMarketplace,
        teaserSummary: "Large enterprise client request. Full brief unlocked after intent + NDA.",
        fullBriefUrl: `https://example.com/rfqs/full-brief-${RUN_TAG}-${idx + 1}-${i + 1}.pdf`,
        audienceCount: 150 + i * 120,
        audienceDescription: i % 2 === 0 ? "Corporate leadership and partners" : "Distributors and media",
        attachmentsUrl: [
          `https://example.com/rfqs/attachments/${RUN_TAG}-${idx + 1}-${i + 1}-01.pdf`,
          `https://example.com/rfqs/attachments/${RUN_TAG}-${idx + 1}-${i + 1}-02.pdf`,
        ],
        deadlineAt: dateOffset(12 + i + idx),
        status,
        publishedAt: dateOffset(-3),
        awardedAt: status === "awarded" ? dateOffset(-1) : null,
      };
    }),
  );

  const rfqs = await db.insert(rfqsTable).values(rfqRows).returning();

  const inviteRows = rfqs.flatMap((rfq, i) => {
    const sampleSuppliers = pickMany(suppliers, 5 + (i % 2));
    return sampleSuppliers.map((supplier, j) => ({
      rfqId: rfq.id,
      supplierId: supplier.id,
      inviteStatus: (["invited", "opened", "submitted"] as const)[j % 3],
      lastActivityAt: dateOffset(-(j % 4)),
    }));
  });
  const rfqInvites = await db.insert(rfqInvitesTable).values(inviteRows).returning();

  return { rfqs, rfqInvites };
}

async function createParticipationsAndSubmissions(
  rfqs: Array<typeof rfqsTable.$inferSelect>,
  rfqInvites: Array<typeof rfqInvitesTable.$inferSelect>,
  suppliers: Supplier[],
) {
  const participationRows = rfqInvites
    .filter((_, i) => i % 5 !== 0)
    .map((inv, i) => {
      const rfq = rfqs.find((r) => r.id === inv.rfqId)!;
      const ndaAccepted = !rfq.ndaRequired || i % 4 !== 0;
      return {
        rfqId: inv.rfqId,
        supplierId: inv.supplierId,
        expressedInterestAt: dateOffset(-5 + (i % 4)),
        ndaRequired: rfq.ndaRequired,
        ndaAccepted,
        ndaAcceptedAt: ndaAccepted ? dateOffset(-4 + (i % 3)) : null,
        ndaIp: ndaAccepted ? `102.65.44.${50 + (i % 100)}` : null,
        ndaUserAgent: ndaAccepted ? "SeedBot/1.0 (QuotePortal Demo Seeder)" : null,
        briefUnlockedAt: ndaAccepted ? dateOffset(-3 + (i % 2)) : null,
      };
    });

  const participations = await db.insert(rfqParticipationsTable).values(participationRows).returning();

  const participationByRfqSupplier = new Map(
    participations.map((p) => [`${p.rfqId}-${p.supplierId}`, p]),
  );

  const submissionRows = rfqInvites
    .filter((_, i) => i % 3 !== 0)
    .map((inv, i) => {
      const p = participationByRfqSupplier.get(`${inv.rfqId}-${inv.supplierId}`) || null;
      const status = (["submitted", "under_review", "shortlisted"] as const)[i % 3];
      return {
        rfqId: inv.rfqId,
        supplierId: inv.supplierId,
        rfqInviteId: inv.id,
        participationId: p?.id,
        submitterOrgType: "supplier" as const,
        submitterOrgId: inv.supplierId,
        submissionStatus: status,
        proposalTitle: `Proposal ${i + 1} for RFQ`,
        proposalNotes: "Detailed approach, delivery plan, and pricing assumptions included.",
        submissionVersion: 1,
        submittedAt: dateOffset(-2 + (i % 2)),
        lastStatusChangedAt: dateOffset(-1),
      };
    });

  const submissions = await db.insert(rfqSubmissionsTable).values(submissionRows).returning();

  const docRows = submissions.flatMap((s, i) => [
    {
      submissionId: s.id,
      docType: "proposal" as const,
      fileUrl: `https://example.com/submissions/${RUN_TAG}/${s.id}/proposal.pdf`,
      fileName: `proposal-${i + 1}.pdf`,
      fileSize: 550000 + i * 1000,
      mimeType: "application/pdf",
    },
    {
      submissionId: s.id,
      docType: "credentials" as const,
      fileUrl: `https://example.com/submissions/${RUN_TAG}/${s.id}/credentials.pdf`,
      fileName: `credentials-${i + 1}.pdf`,
      fileSize: 220000 + i * 800,
      mimeType: "application/pdf",
    },
  ]);
  await db.insert(rfqSubmissionDocumentsTable).values(docRows);

  const supplierById = new Map(suppliers.map((s) => [s.id, s]));
  return { participations, submissions, supplierById };
}

async function createEvaluationAndAwards(
  agencies: Agency[],
  rfqs: Array<typeof rfqsTable.$inferSelect>,
  submissions: Array<typeof rfqSubmissionsTable.$inferSelect>,
  profiles: Array<typeof profilesTable.$inferSelect>,
) {
  const evaluatorProfiles = profiles.filter((p) => p.role === "agency_member" && p.agencyId);
  const evaluatorsByAgency = new Map<string, Array<typeof profilesTable.$inferSelect>>();
  for (const evalProfile of evaluatorProfiles) {
    const agencyId = evalProfile.agencyId as string;
    evaluatorsByAgency.set(agencyId, [...(evaluatorsByAgency.get(agencyId) || []), evalProfile]);
  }

  const templateRows = agencies.map((a, i) => ({
    agencyId: a.id,
    name: `Default Weighted Template ${i + 1} ${RUN_TAG}`,
    criteria: [
      { name: "Commercial", weight: 35, description: "Pricing and value for money" },
      { name: "Technical", weight: 30, description: "Execution feasibility and quality" },
      { name: "Experience", weight: 20, description: "Relevant case studies and team" },
      { name: "Compliance", weight: 15, description: "Documentation and governance" },
    ],
    isDefault: true,
  }));
  await db.insert(rfqEvaluationTemplatesTable).values(templateRows);

  const submissionsByRfq = new Map<string, Array<typeof rfqSubmissionsTable.$inferSelect>>();
  for (const s of submissions) {
    submissionsByRfq.set(s.rfqId, [...(submissionsByRfq.get(s.rfqId) || []), s]);
  }

  const evaluationRows: Array<typeof rfqEvaluationsTable.$inferInsert> = [];
  const awardRows: Array<typeof rfqAwardsTable.$inferInsert> = [];

  for (const rfq of rfqs.filter((r) => r.status === "evaluation" || r.status === "awarded")) {
    const evals = evaluatorsByAgency.get(rfq.agencyId) || [];
    const chosenEvals = evals.length ? pickMany(evals, Math.min(2, evals.length)) : [];
    const rfqSubs = submissionsByRfq.get(rfq.id) || [];

    for (const sub of rfqSubs) {
      for (const evaluator of chosenEvals) {
        const scores = {
          Commercial: rand(65, 95),
          Technical: rand(60, 96),
          Experience: rand(55, 97),
          Compliance: rand(70, 100),
        };
        const weightedTotal =
          scores.Commercial * 0.35 +
          scores.Technical * 0.3 +
          scores.Experience * 0.2 +
          scores.Compliance * 0.15;

        evaluationRows.push({
          rfqId: rfq.id,
          submissionId: sub.id,
          evaluatorUserId: evaluator.userId,
          scores,
          weightedTotal: weightedTotal.toFixed(2),
          comments: "Solid submission with strong execution readiness.",
        });
      }
    }

    if (rfq.status === "awarded" && rfqSubs.length >= 1) {
      const winner = rfqSubs[0];
      const runnerUp = rfqSubs[1] || null;
      awardRows.push({
        rfqId: rfq.id,
        winnerSubmissionId: winner.id,
        runnerUpSubmissionId: runnerUp?.id ?? null,
        awardReason: "Best weighted score and strong compliance package.",
        contractValue: `${rand(350000, 980000)}`,
        awardedBudget: `${rand(320000, 900000)}`,
        awardedByUserId: chosenEvals[0]?.userId || null,
      });
    }
  }

  const evaluations = evaluationRows.length
    ? await db.insert(rfqEvaluationsTable).values(evaluationRows).returning()
    : [];
  const awards = awardRows.length
    ? await db.insert(rfqAwardsTable).values(awardRows).returning()
    : [];

  return { evaluations, awards };
}

async function createCostEstimates(
  rfqs: Array<typeof rfqsTable.$inferSelect>,
  submissions: Array<typeof rfqSubmissionsTable.$inferSelect>,
  supplierById: Map<string, Supplier>,
) {
  const estimateRows = rfqs
    .filter((rfq) => rfq.status === "evaluation" || rfq.status === "awarded")
    .map((rfq, i) => {
      const net = rand(280000, 700000);
      const markup = Math.round(net * 0.1);
      const managementFee = Math.round((net + markup) * 0.15);
      const vat = Math.round((net + markup + managementFee) * 0.15);
      const finalTotal = net + markup + managementFee + vat;
      return {
        rfqId: rfq.id,
        agencyId: rfq.agencyId,
        parentOrgType: "agency",
        parentOrgId: rfq.agencyId,
        projectType: rfq.projectType,
        createdByUserId: rfq.createdByUserId,
        status: (["draft", "ready_for_review", "approved", "published"] as const)[i % 4],
        title: `Client Cost Estimate - ${rfq.title}`,
        currency: "ZAR",
        supplierNetTotal: `${net}`,
        markupTotal: `${markup}`,
        managementFeePercent: "15.00",
        managementFeeTotal: `${managementFee}`,
        vatPercent: "15.00",
        vatTotal: `${vat}`,
        finalClientTotal: `${finalTotal}`,
        version: 1,
      };
    });
  const estimates = await db.insert(costEstimatesTable).values(estimateRows).returning();

  const submissionsByRfq = new Map<string, Array<typeof rfqSubmissionsTable.$inferSelect>>();
  for (const s of submissions) {
    submissionsByRfq.set(s.rfqId, [...(submissionsByRfq.get(s.rfqId) || []), s]);
  }

  const itemRows: Array<typeof costEstimateItemsTable.$inferInsert> = [];
  const versionRows: Array<typeof costEstimateVersionsTable.$inferInsert> = [];
  const exportRows: Array<typeof costEstimateExportsTable.$inferInsert> = [];

  for (const estimate of estimates) {
    const rfqSubs = (submissionsByRfq.get(estimate.rfqId) || []).slice(0, 4);
    const lineCount = Math.max(3, rfqSubs.length);

    for (let i = 0; i < lineCount; i++) {
      const sourceSubmission = rfqSubs[i % Math.max(1, rfqSubs.length)];
      const supplier = sourceSubmission?.supplierId ? supplierById.get(sourceSubmission.supplierId) : null;
      const unitCost = rand(12000, 85000);
      const qty = rand(1, 4);
      const subtotal = unitCost * qty;
      const markupPct = rand(5, 18);
      const markupValue = Math.round((subtotal * markupPct) / 100);
      const clientPrice = subtotal + markupValue;

      itemRows.push({
        costEstimateId: estimate.id,
        category: requiredCategorySeed[i % requiredCategorySeed.length],
        supplierId: sourceSubmission?.supplierId ?? null,
        sourceSubmissionId: sourceSubmission?.id ?? null,
        sourceOrgName: supplier?.name || "Open Market Supplier",
        sourceOrgId: sourceSubmission?.supplierId ?? null,
        lineDescription: `${requiredCategorySeed[i % requiredCategorySeed.length]} package`,
        unitCost: `${unitCost}`,
        quantity: `${qty}`,
        supplierSubtotal: `${subtotal}`,
        markupPercent: `${markupPct}.00`,
        markupValue: `${markupValue}`,
        clientPrice: `${clientPrice}`,
        isSelected: i % 4 !== 0,
        sortOrder: i,
      });
    }

    versionRows.push({
      costEstimateId: estimate.id,
      version: 1,
      snapshot: JSON.stringify({
        generatedAt: new Date().toISOString(),
        estimateId: estimate.id,
        title: estimate.title,
        status: estimate.status,
      }),
      createdByUserId: estimate.createdByUserId,
    });

    exportRows.push({
      costEstimateId: estimate.id,
      exportType: "pdf",
      fileUrl: `https://example.com/cost-estimates/${RUN_TAG}/${estimate.id}.pdf`,
      createdByUserId: estimate.createdByUserId,
    });
  }

  if (itemRows.length) await db.insert(costEstimateItemsTable).values(itemRows);
  if (versionRows.length) await db.insert(costEstimateVersionsTable).values(versionRows);
  if (exportRows.length) await db.insert(costEstimateExportsTable).values(exportRows);

  return estimates;
}

async function createSupplierAnalytics(suppliers: Supplier[], submissions: Array<typeof rfqSubmissionsTable.$inferSelect>, awards: Array<typeof rfqAwardsTable.$inferSelect>) {
  const submissionCounts = new Map<string, number>();
  for (const s of submissions) {
    if (!s.supplierId) continue;
    submissionCounts.set(s.supplierId, (submissionCounts.get(s.supplierId) || 0) + 1);
  }

  const winCounts = new Map<string, number>();
  for (const a of awards) {
    const winSubmission = submissions.find((s) => s.id === a.winnerSubmissionId);
    if (winSubmission?.supplierId) {
      winCounts.set(winSubmission.supplierId, (winCounts.get(winSubmission.supplierId) || 0) + 1);
    }
  }

  const metricRows = suppliers.map((s) => {
    const submissionsTotal = submissionCounts.get(s.id) || 0;
    const winsTotal = winCounts.get(s.id) || 0;
    const shortlistedTotal = Math.min(submissionsTotal, Math.max(0, winsTotal + rand(0, 2)));
    const pitchesViewed = submissionsTotal + rand(1, 7);
    const ndasSigned = rand(0, submissionsTotal + 2);
    const winRate = submissionsTotal ? winsTotal / submissionsTotal : 0;
    const shortlistRate = submissionsTotal ? shortlistedTotal / submissionsTotal : 0;

    return {
      supplierId: s.id,
      pitchesViewed,
      ndasSigned,
      submissionsTotal,
      shortlistedTotal,
      winsTotal,
      winRate: winRate.toFixed(3),
      shortlistRate: shortlistRate.toFixed(3),
      complianceAvg: (0.75 + Math.random() * 0.23).toFixed(3),
      consistencyAvg: (0.70 + Math.random() * 0.25).toFixed(3),
      contractValueTotal: `${rand(150000, 1800000)}`,
    };
  });

  await db.insert(supplierPerformanceMetricsTable).values(metricRows);

  const topByWins = [...metricRows]
    .sort((a, b) => b.winsTotal - a.winsTotal)
    .slice(0, 10)
    .map((m, idx) => ({
      rank: idx + 1,
      supplierId: m.supplierId,
      wins: m.winsTotal,
      submissions: m.submissionsTotal,
      winRate: m.winRate,
    }));

  await db.insert(supplierRankingSnapshotsTable).values([
    {
      category: "overall",
      snapshot: { generatedBy: "seed-full-demo", runTag: RUN_TAG, ranking: topByWins },
    },
    {
      category: "audio-visual",
      snapshot: { generatedBy: "seed-full-demo", runTag: RUN_TAG, ranking: topByWins.slice(0, 5) },
    },
  ]);
}

async function createAuditEvents(
  rfqs: Array<typeof rfqsTable.$inferSelect>,
  rfqInvites: Array<typeof rfqInvitesTable.$inferSelect>,
  submissions: Array<typeof rfqSubmissionsTable.$inferSelect>,
  awards: Array<typeof rfqAwardsTable.$inferSelect>,
) {
  const rows: Array<typeof auditEventsTable.$inferInsert> = [];

  for (const rfq of rfqs) {
    rows.push({
      actorUserId: rfq.createdByUserId,
      orgType: "agency",
      orgId: rfq.agencyId,
      entityType: "rfq",
      entityId: rfq.id,
      eventType: "rfq.created",
      newValue: { title: rfq.title, status: rfq.status, ndaRequired: rfq.ndaRequired },
      ip: "102.65.44.10",
      userAgent: "SeedBot/1.0",
    });
    if (rfq.status === "published" || rfq.status === "evaluation" || rfq.status === "awarded") {
      rows.push({
        actorUserId: rfq.createdByUserId,
        orgType: "agency",
        orgId: rfq.agencyId,
        entityType: "rfq",
        entityId: rfq.id,
        eventType: "rfq.published",
        oldValue: { status: "draft" },
        newValue: { status: rfq.status },
      });
    }
  }

  for (const inv of rfqInvites.slice(0, 80)) {
    rows.push({
      orgType: "supplier",
      orgId: inv.supplierId,
      entityType: "rfq_invite",
      entityId: inv.id,
      eventType: `invite.${inv.inviteStatus}`,
      newValue: { rfqId: inv.rfqId, supplierId: inv.supplierId, status: inv.inviteStatus },
    });
  }

  for (const sub of submissions.slice(0, 120)) {
    rows.push({
      orgType: "supplier",
      orgId: sub.supplierId || null,
      entityType: "rfq_submission",
      entityId: sub.id,
      eventType: "submission.created",
      newValue: { rfqId: sub.rfqId, status: sub.submissionStatus },
    });
  }

  for (const award of awards) {
    rows.push({
      actorUserId: award.awardedByUserId || null,
      orgType: "agency",
      entityType: "rfq_award",
      entityId: award.id,
      eventType: "award.created",
      newValue: { rfqId: award.rfqId, winnerSubmissionId: award.winnerSubmissionId },
    });
  }

  if (rows.length) {
    await db.insert(auditEventsTable).values(rows);
  }
}

async function seed() {
  console.log(`🌱 Starting full demo seed (${RUN_TAG})`);
  await seedCategoriesIfNeeded();

  const agencies = await createAgencies();
  const suppliers = await createSuppliers();
  const costConsultants = await createCostConsultants();
  const profiles = await createProfiles(agencies, suppliers, costConsultants);

  const orgInvites = await createOrgInvites(agencies, suppliers, costConsultants);
  const { rfqs, rfqInvites } = await createRfqs(agencies, suppliers, profiles, costConsultants);
  const { participations, submissions, supplierById } = await createParticipationsAndSubmissions(
    rfqs,
    rfqInvites,
    suppliers,
  );
  const { evaluations, awards } = await createEvaluationAndAwards(
    agencies,
    rfqs,
    submissions,
    profiles,
  );
  const estimates = await createCostEstimates(rfqs, submissions, supplierById);
  await createSupplierAnalytics(suppliers, submissions, awards);
  await createAuditEvents(rfqs, rfqInvites, submissions, awards);

  console.log("✅ Full demo seed completed.");
  console.log(
    [
      `Inserted agencies: ${agencies.length}`,
      `Inserted suppliers: ${suppliers.length}`,
      `Inserted cost consultants: ${costConsultants.length}`,
      `Inserted profiles: ${profiles.length}`,
      `Inserted org invites: ${orgInvites.length}`,
      `Inserted rfqs: ${rfqs.length}`,
      `Inserted rfq invites: ${rfqInvites.length}`,
      `Inserted participations: ${participations.length}`,
      `Inserted submissions: ${submissions.length}`,
      `Inserted evaluations: ${evaluations.length}`,
      `Inserted awards: ${awards.length}`,
      `Inserted cost estimates: ${estimates.length}`,
    ].join("\n"),
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Full demo seed failed:", error);
    process.exit(1);
  });
