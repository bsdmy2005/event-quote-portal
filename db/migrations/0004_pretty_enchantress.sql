CREATE TYPE "public"."rfq_issuer_type" AS ENUM('agency', 'cost_consultant', 'client');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('physical_event', 'digital_campaign', 'brand_activation', 'conference_expo', 'hybrid', 'other');--> statement-breakpoint
CREATE TYPE "public"."rfq_recipient_type" AS ENUM('supplier', 'agency');--> statement-breakpoint
CREATE TYPE "public"."rfq_submission_doc_type" AS ENUM('proposal', 'cost_estimate', 'credentials', 'compliance', 'other');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('submitted', 'under_review', 'shortlisted', 'awarded', 'not_successful');--> statement-breakpoint
CREATE TYPE "public"."submitter_org_type" AS ENUM('supplier', 'agency');--> statement-breakpoint
CREATE TYPE "public"."cost_estimate_export_type" AS ENUM('pdf', 'client_summary_pdf');--> statement-breakpoint
CREATE TYPE "public"."cost_estimate_status" AS ENUM('draft', 'ready_for_review', 'approved', 'published');--> statement-breakpoint
CREATE TYPE "public"."audit_org_type" AS ENUM('agency', 'supplier', 'cost_consultant', 'admin');--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'cost_consultant_admin';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'cost_consultant_member';--> statement-breakpoint
ALTER TYPE "public"."org_type" ADD VALUE 'cost_consultant';--> statement-breakpoint
ALTER TYPE "public"."rfq_status" ADD VALUE 'published' BEFORE 'closed';--> statement-breakpoint
ALTER TYPE "public"."rfq_status" ADD VALUE 'evaluation' BEFORE 'closed';--> statement-breakpoint
ALTER TYPE "public"."rfq_status" ADD VALUE 'cancelled';--> statement-breakpoint
ALTER TYPE "public"."org_invite_type" ADD VALUE 'cost_consultant';--> statement-breakpoint
CREATE TABLE "cost_consultants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"logo_url" text,
	"website" text,
	"location" json,
	"service_categories" json,
	"about" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"status" "org_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cost_consultants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "rfq_participations" (
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
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rfq_submission_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"doc_type" "rfq_submission_doc_type" NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" bigint,
	"mime_type" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rfq_submissions" (
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
--> statement-breakpoint
CREATE TABLE "rfq_awards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfq_id" uuid NOT NULL,
	"winner_submission_id" uuid NOT NULL,
	"runner_up_submission_id" uuid,
	"award_reason" text,
	"contract_value" numeric(14, 2),
	"awarded_budget" numeric(14, 2),
	"awarded_by_user_id" text,
	"awarded_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rfq_evaluation_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agency_id" uuid NOT NULL,
	"name" text NOT NULL,
	"criteria" json NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rfq_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfq_id" uuid NOT NULL,
	"submission_id" uuid NOT NULL,
	"evaluator_user_id" text NOT NULL,
	"scores" json NOT NULL,
	"weighted_total" numeric(6, 2) NOT NULL,
	"comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cost_estimate_exports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cost_estimate_id" uuid NOT NULL,
	"export_type" "cost_estimate_export_type" NOT NULL,
	"file_url" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cost_estimate_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cost_estimate_id" uuid NOT NULL,
	"category" text NOT NULL,
	"supplier_id" uuid,
	"source_submission_id" uuid,
	"source_org_name" text,
	"source_org_id" uuid,
	"line_description" text NOT NULL,
	"unit_cost" numeric(14, 2) NOT NULL,
	"quantity" numeric(12, 3) NOT NULL,
	"supplier_subtotal" numeric(14, 2) NOT NULL,
	"markup_percent" numeric(5, 2) DEFAULT '0' NOT NULL,
	"markup_value" numeric(14, 2) DEFAULT '0' NOT NULL,
	"client_price" numeric(14, 2) NOT NULL,
	"is_selected" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cost_estimate_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cost_estimate_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cost_estimates" (
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
	"supplier_net_total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"markup_total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"management_fee_percent" numeric(5, 2) DEFAULT '15.00' NOT NULL,
	"management_fee_total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"vat_percent" numeric(5, 2) DEFAULT '15.00' NOT NULL,
	"vat_total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"final_client_total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_performance_metrics" (
	"supplier_id" uuid PRIMARY KEY NOT NULL,
	"pitches_viewed" integer DEFAULT 0 NOT NULL,
	"ndas_signed" integer DEFAULT 0 NOT NULL,
	"submissions_total" integer DEFAULT 0 NOT NULL,
	"shortlisted_total" integer DEFAULT 0 NOT NULL,
	"wins_total" integer DEFAULT 0 NOT NULL,
	"win_rate" numeric(6, 3) DEFAULT '0' NOT NULL,
	"shortlist_rate" numeric(6, 3) DEFAULT '0' NOT NULL,
	"compliance_avg" numeric(6, 3) DEFAULT '0' NOT NULL,
	"consistency_avg" numeric(6, 3) DEFAULT '0' NOT NULL,
	"contract_value_total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_ranking_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"category" text,
	"snapshot" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
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
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "cost_consultant_id" uuid;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "event_type" text;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "project_type" "project_type" DEFAULT 'physical_event' NOT NULL;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "issuer_type" "rfq_issuer_type" DEFAULT 'agency' NOT NULL;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "issuer_org_id" uuid;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "recipient_type" "rfq_recipient_type" DEFAULT 'supplier' NOT NULL;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "budget_min" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "budget_max" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "location_city" text;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "location_province" text;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "location_country" text;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "required_services" json;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "submission_template" json;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "nda_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "teaser_summary" text;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "full_brief_url" text;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "audience_count" integer;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "audience_description" text;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "closed_at" timestamp;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "awarded_at" timestamp;