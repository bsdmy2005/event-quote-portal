ALTER TYPE "org_type" ADD VALUE IF NOT EXISTS 'cost_consultant';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'cost_consultant_admin';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'cost_consultant_member';
ALTER TYPE "org_invite_type" ADD VALUE IF NOT EXISTS 'cost_consultant';
ALTER TYPE "rfq_status" ADD VALUE IF NOT EXISTS 'published';
ALTER TYPE "rfq_status" ADD VALUE IF NOT EXISTS 'evaluation';
ALTER TYPE "rfq_status" ADD VALUE IF NOT EXISTS 'cancelled';

CREATE TYPE IF NOT EXISTS "rfq_issuer_type" AS ENUM('agency', 'cost_consultant', 'client');
CREATE TYPE IF NOT EXISTS "rfq_recipient_type" AS ENUM('supplier', 'agency');
CREATE TYPE IF NOT EXISTS "project_type" AS ENUM('physical_event', 'digital_campaign', 'brand_activation', 'conference_expo', 'hybrid', 'other');
CREATE TYPE IF NOT EXISTS "submission_status" AS ENUM('submitted', 'under_review', 'shortlisted', 'awarded', 'not_successful');
CREATE TYPE IF NOT EXISTS "submitter_org_type" AS ENUM('supplier', 'agency');
CREATE TYPE IF NOT EXISTS "rfq_submission_doc_type" AS ENUM('proposal', 'cost_estimate', 'credentials', 'compliance', 'other');
CREATE TYPE IF NOT EXISTS "cost_estimate_status" AS ENUM('draft', 'ready_for_review', 'approved', 'published');
CREATE TYPE IF NOT EXISTS "cost_estimate_export_type" AS ENUM('pdf', 'client_summary_pdf');
CREATE TYPE IF NOT EXISTS "audit_org_type" AS ENUM('agency', 'supplier', 'cost_consultant', 'admin');

CREATE TABLE IF NOT EXISTS "cost_consultants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "contact_name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "phone" text,
  "logo_url" text,
  "website" text,
  "location" json,
  "service_categories" json,
  "about" text,
  "is_published" boolean DEFAULT false NOT NULL,
  "status" "org_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "cost_consultant_id" uuid;

ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "event_type" text;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "project_type" "project_type" DEFAULT 'physical_event' NOT NULL;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "issuer_type" "rfq_issuer_type" DEFAULT 'agency' NOT NULL;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "issuer_org_id" uuid;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "recipient_type" "rfq_recipient_type" DEFAULT 'supplier' NOT NULL;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "budget_min" numeric(14,2);
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "budget_max" numeric(14,2);
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "location_city" text;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "location_province" text;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "location_country" text;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "required_services" json;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "submission_template" json;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "nda_required" boolean DEFAULT false NOT NULL;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "teaser_summary" text;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "full_brief_url" text;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "published_at" timestamp;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "closed_at" timestamp;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "awarded_at" timestamp;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "audience_count" integer;
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "audience_description" text;

CREATE TABLE IF NOT EXISTS "rfq_participations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "rfq_id" uuid NOT NULL,
  "supplier_id" uuid NOT NULL,
  "expressed_interest_at" timestamp,
  "nda_required" boolean DEFAULT false NOT NULL,
  "nda_accepted" boolean DEFAULT false NOT NULL,
  "nda_accepted_at" timestamp,
  "nda_ip" text,
  "nda_user_agent" text,
  "brief_unlocked_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "rfq_participations_rfq_supplier_unique" UNIQUE("rfq_id", "supplier_id")
);

CREATE TABLE IF NOT EXISTS "rfq_submissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "rfq_id" uuid NOT NULL,
  "supplier_id" uuid,
  "rfq_invite_id" uuid,
  "participation_id" uuid,
  "submitter_org_type" "submitter_org_type" DEFAULT 'supplier' NOT NULL,
  "submitter_org_id" uuid,
  "submission_status" "submission_status" DEFAULT 'submitted' NOT NULL,
  "proposal_title" text,
  "proposal_notes" text,
  "submission_version" integer DEFAULT 1 NOT NULL,
  "submitted_at" timestamp DEFAULT now() NOT NULL,
  "last_status_changed_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "rfq_submission_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "submission_id" uuid NOT NULL,
  "doc_type" "rfq_submission_doc_type" NOT NULL,
  "file_url" text NOT NULL,
  "file_name" text NOT NULL,
  "file_size" bigint,
  "mime_type" text,
  "uploaded_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "rfq_evaluation_templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "agency_id" uuid NOT NULL,
  "name" text NOT NULL,
  "criteria" json NOT NULL,
  "is_default" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "rfq_evaluations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "rfq_id" uuid NOT NULL,
  "submission_id" uuid NOT NULL,
  "evaluator_user_id" text NOT NULL,
  "scores" json NOT NULL,
  "weighted_total" numeric(6,2) NOT NULL,
  "comments" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "rfq_awards" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "rfq_id" uuid NOT NULL,
  "winner_submission_id" uuid NOT NULL,
  "runner_up_submission_id" uuid,
  "award_reason" text,
  "contract_value" numeric(14,2),
  "awarded_budget" numeric(14,2),
  "awarded_by_user_id" text,
  "awarded_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "rfq_awards_rfq_unique" UNIQUE("rfq_id")
);

CREATE TABLE IF NOT EXISTS "cost_estimates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "rfq_id" uuid NOT NULL,
  "agency_id" uuid,
  "parent_org_type" text,
  "parent_org_id" uuid,
  "project_type" text,
  "created_by_user_id" text NOT NULL,
  "status" "cost_estimate_status" DEFAULT 'draft' NOT NULL,
  "title" text NOT NULL,
  "currency" text DEFAULT 'ZAR' NOT NULL,
  "supplier_net_total" numeric(14,2) DEFAULT 0 NOT NULL,
  "markup_total" numeric(14,2) DEFAULT 0 NOT NULL,
  "management_fee_percent" numeric(5,2) DEFAULT 15.00 NOT NULL,
  "management_fee_total" numeric(14,2) DEFAULT 0 NOT NULL,
  "vat_percent" numeric(5,2) DEFAULT 15.00 NOT NULL,
  "vat_total" numeric(14,2) DEFAULT 0 NOT NULL,
  "final_client_total" numeric(14,2) DEFAULT 0 NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cost_estimate_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "cost_estimate_id" uuid NOT NULL,
  "category" text NOT NULL,
  "supplier_id" uuid,
  "source_submission_id" uuid,
  "source_org_name" text,
  "source_org_id" uuid,
  "line_description" text NOT NULL,
  "unit_cost" numeric(14,2) NOT NULL,
  "quantity" numeric(12,3) NOT NULL,
  "supplier_subtotal" numeric(14,2) NOT NULL,
  "markup_percent" numeric(5,2) DEFAULT 0 NOT NULL,
  "markup_value" numeric(14,2) DEFAULT 0 NOT NULL,
  "client_price" numeric(14,2) NOT NULL,
  "is_selected" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cost_estimate_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "cost_estimate_id" uuid NOT NULL,
  "version" integer NOT NULL,
  "snapshot" text NOT NULL,
  "created_by_user_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "cost_estimate_versions_unique" UNIQUE("cost_estimate_id", "version")
);

CREATE TABLE IF NOT EXISTS "cost_estimate_exports" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "cost_estimate_id" uuid NOT NULL,
  "export_type" "cost_estimate_export_type" NOT NULL,
  "file_url" text NOT NULL,
  "created_by_user_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "supplier_performance_metrics" (
  "supplier_id" uuid PRIMARY KEY NOT NULL,
  "pitches_viewed" integer DEFAULT 0 NOT NULL,
  "ndas_signed" integer DEFAULT 0 NOT NULL,
  "submissions_total" integer DEFAULT 0 NOT NULL,
  "shortlisted_total" integer DEFAULT 0 NOT NULL,
  "wins_total" integer DEFAULT 0 NOT NULL,
  "win_rate" numeric(6,3) DEFAULT 0 NOT NULL,
  "shortlist_rate" numeric(6,3) DEFAULT 0 NOT NULL,
  "compliance_avg" numeric(6,3) DEFAULT 0 NOT NULL,
  "consistency_avg" numeric(6,3) DEFAULT 0 NOT NULL,
  "contract_value_total" numeric(14,2) DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "supplier_ranking_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "generated_at" timestamp DEFAULT now() NOT NULL,
  "category" text,
  "snapshot" json NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_user_id" text,
  "org_type" "audit_org_type",
  "org_id" uuid,
  "entity_type" text NOT NULL,
  "entity_id" text NOT NULL,
  "event_type" text NOT NULL,
  "old_value" json,
  "new_value" json,
  "ip" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "profiles" ADD CONSTRAINT IF NOT EXISTS "profiles_cost_consultant_fk" FOREIGN KEY ("cost_consultant_id") REFERENCES "cost_consultants"("id") ON DELETE SET NULL;
ALTER TABLE "rfq_participations" ADD CONSTRAINT IF NOT EXISTS "rfq_participations_rfq_fk" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_participations" ADD CONSTRAINT IF NOT EXISTS "rfq_participations_supplier_fk" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_submissions" ADD CONSTRAINT IF NOT EXISTS "rfq_submissions_rfq_fk" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_submissions" ADD CONSTRAINT IF NOT EXISTS "rfq_submissions_supplier_fk" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL;
ALTER TABLE "rfq_submissions" ADD CONSTRAINT IF NOT EXISTS "rfq_submissions_invite_fk" FOREIGN KEY ("rfq_invite_id") REFERENCES "rfq_invites"("id") ON DELETE SET NULL;
ALTER TABLE "rfq_submissions" ADD CONSTRAINT IF NOT EXISTS "rfq_submissions_participation_fk" FOREIGN KEY ("participation_id") REFERENCES "rfq_participations"("id") ON DELETE SET NULL;
ALTER TABLE "rfq_submission_documents" ADD CONSTRAINT IF NOT EXISTS "rfq_submission_docs_submission_fk" FOREIGN KEY ("submission_id") REFERENCES "rfq_submissions"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_evaluation_templates" ADD CONSTRAINT IF NOT EXISTS "rfq_eval_templates_agency_fk" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_evaluations" ADD CONSTRAINT IF NOT EXISTS "rfq_evals_rfq_fk" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_evaluations" ADD CONSTRAINT IF NOT EXISTS "rfq_evals_submission_fk" FOREIGN KEY ("submission_id") REFERENCES "rfq_submissions"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_awards" ADD CONSTRAINT IF NOT EXISTS "rfq_awards_rfq_fk" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_awards" ADD CONSTRAINT IF NOT EXISTS "rfq_awards_winner_fk" FOREIGN KEY ("winner_submission_id") REFERENCES "rfq_submissions"("id") ON DELETE CASCADE;
ALTER TABLE "rfq_awards" ADD CONSTRAINT IF NOT EXISTS "rfq_awards_runnerup_fk" FOREIGN KEY ("runner_up_submission_id") REFERENCES "rfq_submissions"("id") ON DELETE SET NULL;
ALTER TABLE "cost_estimates" ADD CONSTRAINT IF NOT EXISTS "cost_estimates_rfq_fk" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE;
ALTER TABLE "cost_estimates" ADD CONSTRAINT IF NOT EXISTS "cost_estimates_agency_fk" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE SET NULL;
ALTER TABLE "cost_estimate_items" ADD CONSTRAINT IF NOT EXISTS "cost_estimate_items_ce_fk" FOREIGN KEY ("cost_estimate_id") REFERENCES "cost_estimates"("id") ON DELETE CASCADE;
ALTER TABLE "cost_estimate_items" ADD CONSTRAINT IF NOT EXISTS "cost_estimate_items_supplier_fk" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL;
ALTER TABLE "cost_estimate_items" ADD CONSTRAINT IF NOT EXISTS "cost_estimate_items_submission_fk" FOREIGN KEY ("source_submission_id") REFERENCES "rfq_submissions"("id") ON DELETE SET NULL;
ALTER TABLE "cost_estimate_versions" ADD CONSTRAINT IF NOT EXISTS "cost_estimate_versions_ce_fk" FOREIGN KEY ("cost_estimate_id") REFERENCES "cost_estimates"("id") ON DELETE CASCADE;
ALTER TABLE "cost_estimate_exports" ADD CONSTRAINT IF NOT EXISTS "cost_estimate_exports_ce_fk" FOREIGN KEY ("cost_estimate_id") REFERENCES "cost_estimates"("id") ON DELETE CASCADE;
ALTER TABLE "supplier_performance_metrics" ADD CONSTRAINT IF NOT EXISTS "supplier_perf_supplier_fk" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE;
