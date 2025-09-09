CREATE TYPE "public"."user_role" AS ENUM('admin', 'agency_admin', 'agency_member', 'supplier_admin', 'supplier_member');--> statement-breakpoint
CREATE TYPE "public"."org_status" AS ENUM('active', 'inactive', 'pending');--> statement-breakpoint
CREATE TYPE "public"."org_type" AS ENUM('agency', 'supplier');--> statement-breakpoint
CREATE TYPE "public"."rfq_status" AS ENUM('draft', 'sent', 'closed', 'awarded', 'not_awarded');--> statement-breakpoint
CREATE TYPE "public"."quotation_status" AS ENUM('submitted', 'replaced');--> statement-breakpoint
CREATE TYPE "public"."invite_status" AS ENUM('invited', 'opened', 'submitted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."org_invite_type" AS ENUM('agency', 'supplier');--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'agency_member' NOT NULL,
	"agency_id" uuid,
	"supplier_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"logo_url" text,
	"website" text,
	"location" json,
	"interest_categories" json,
	"about" text,
	"status" "org_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agencies_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"logo_url" text,
	"brochure_url" text,
	"id_image_url" text,
	"location" json,
	"service_categories" json,
	"services_text" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"status" "org_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "suppliers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "rfqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agency_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"title" text NOT NULL,
	"client_name" text NOT NULL,
	"event_dates" json,
	"venue" text,
	"scope" text NOT NULL,
	"attachments_url" json,
	"deadline_at" timestamp NOT NULL,
	"status" "rfq_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfq_invite_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"pdf_url" text NOT NULL,
	"notes" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"status" "quotation_status" DEFAULT 'submitted' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_type" "org_invite_type" NOT NULL,
	"org_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "org_invites_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "rfq_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfq_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"invite_status" "invite_status" DEFAULT 'invited' NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"organization_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"mime_type" text NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text" text,
	"caption" text,
	"is_featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
