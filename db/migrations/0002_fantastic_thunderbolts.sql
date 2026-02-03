CREATE TYPE "public"."waitlist_role" AS ENUM('agency', 'supplier', 'cost_consultant', 'financier', 'other');--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"company_name" text,
	"role" "waitlist_role" NOT NULL,
	"interests" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
