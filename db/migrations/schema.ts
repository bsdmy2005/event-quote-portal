import { pgTable, check, uuid, text, json, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const inviteStatus = pgEnum("invite_status", ['invited', 'opened', 'submitted', 'closed'])
export const orgInviteType = pgEnum("org_invite_type", ['agency', 'supplier'])
export const orgStatus = pgEnum("org_status", ['active', 'inactive', 'pending'])
export const orgType = pgEnum("org_type", ['agency', 'supplier'])
export const quotationStatus = pgEnum("quotation_status", ['submitted', 'replaced'])
export const rfqStatus = pgEnum("rfq_status", ['draft', 'sent', 'closed', 'awarded', 'not_awarded'])
export const userRole = pgEnum("user_role", ['admin', 'agency_admin', 'agency_member', 'supplier_admin', 'supplier_member'])


export const agencies = pgTable("agencies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	contactName: text("contact_name").notNull(),
	email: text().notNull(),
	phone: text(),
	logoUrl: text("logo_url"),
	website: text(),
	location: json(),
	interestCategories: json("interest_categories"),
	about: text(),
	status: orgStatus().default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isPublished: boolean("is_published").default(false).notNull(),
}, (table) => [
	check("agencies_contact_name_not_null", sql`NOT NULL contact_name`),
	check("agencies_created_at_not_null", sql`NOT NULL created_at`),
	check("agencies_email_not_null", sql`NOT NULL email`),
	check("agencies_id_not_null", sql`NOT NULL id`),
	check("agencies_is_published_not_null", sql`NOT NULL is_published`),
	check("agencies_name_not_null", sql`NOT NULL name`),
	check("agencies_status_not_null", sql`NOT NULL status`),
	check("agencies_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("categories_created_at_not_null", sql`NOT NULL created_at`),
	check("categories_id_not_null", sql`NOT NULL id`),
	check("categories_name_not_null", sql`NOT NULL name`),
	check("categories_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const images = pgTable("images", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	organizationType: text("organization_type").notNull(),
	fileName: text("file_name").notNull(),
	filePath: text("file_path").notNull(),
	fileUrl: text("file_url").notNull(),
	fileSize: integer("file_size"),
	mimeType: text("mime_type").notNull(),
	width: integer(),
	height: integer(),
	altText: text("alt_text"),
	caption: text(),
	isFeatured: boolean("is_featured").default(false),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	check("images_file_name_not_null", sql`NOT NULL file_name`),
	check("images_file_path_not_null", sql`NOT NULL file_path`),
	check("images_file_url_not_null", sql`NOT NULL file_url`),
	check("images_id_not_null", sql`NOT NULL id`),
	check("images_mime_type_not_null", sql`NOT NULL mime_type`),
	check("images_organization_id_not_null", sql`NOT NULL organization_id`),
	check("images_organization_type_not_null", sql`NOT NULL organization_type`),
]);

export const orgInvites = pgTable("org_invites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orgType: orgInviteType("org_type").notNull(),
	orgId: uuid("org_id").notNull(),
	email: text().notNull(),
	role: text().notNull(),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	acceptedAt: timestamp("accepted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("org_invites_created_at_not_null", sql`NOT NULL created_at`),
	check("org_invites_email_not_null", sql`NOT NULL email`),
	check("org_invites_expires_at_not_null", sql`NOT NULL expires_at`),
	check("org_invites_id_not_null", sql`NOT NULL id`),
	check("org_invites_org_id_not_null", sql`NOT NULL org_id`),
	check("org_invites_org_type_not_null", sql`NOT NULL org_type`),
	check("org_invites_role_not_null", sql`NOT NULL role`),
	check("org_invites_token_hash_not_null", sql`NOT NULL token_hash`),
]);

export const profiles = pgTable("profiles", {
	userId: text("user_id").primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	role: userRole().default('agency_member').notNull(),
	agencyId: uuid("agency_id"),
	supplierId: uuid("supplier_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("profiles_created_at_not_null", sql`NOT NULL created_at`),
	check("profiles_email_not_null", sql`NOT NULL email`),
	check("profiles_first_name_not_null", sql`NOT NULL first_name`),
	check("profiles_last_name_not_null", sql`NOT NULL last_name`),
	check("profiles_role_not_null", sql`NOT NULL role`),
	check("profiles_updated_at_not_null", sql`NOT NULL updated_at`),
	check("profiles_user_id_not_null", sql`NOT NULL user_id`),
]);

export const quotations = pgTable("quotations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rfqInviteId: uuid("rfq_invite_id").notNull(),
	supplierId: uuid("supplier_id").notNull(),
	pdfUrl: text("pdf_url").notNull(),
	notes: text(),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow().notNull(),
	status: quotationStatus().default('submitted').notNull(),
	version: integer().default(1).notNull(),
}, (table) => [
	check("quotations_id_not_null", sql`NOT NULL id`),
	check("quotations_pdf_url_not_null", sql`NOT NULL pdf_url`),
	check("quotations_rfq_invite_id_not_null", sql`NOT NULL rfq_invite_id`),
	check("quotations_status_not_null", sql`NOT NULL status`),
	check("quotations_submitted_at_not_null", sql`NOT NULL submitted_at`),
	check("quotations_supplier_id_not_null", sql`NOT NULL supplier_id`),
	check("quotations_version_not_null", sql`NOT NULL version`),
]);

export const rfqInvites = pgTable("rfq_invites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rfqId: uuid("rfq_id").notNull(),
	supplierId: uuid("supplier_id").notNull(),
	inviteStatus: inviteStatus("invite_status").default('invited').notNull(),
	lastActivityAt: timestamp("last_activity_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("rfq_invites_created_at_not_null", sql`NOT NULL created_at`),
	check("rfq_invites_id_not_null", sql`NOT NULL id`),
	check("rfq_invites_invite_status_not_null", sql`NOT NULL invite_status`),
	check("rfq_invites_last_activity_at_not_null", sql`NOT NULL last_activity_at`),
	check("rfq_invites_rfq_id_not_null", sql`NOT NULL rfq_id`),
	check("rfq_invites_supplier_id_not_null", sql`NOT NULL supplier_id`),
]);

export const rfqs = pgTable("rfqs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	agencyId: uuid("agency_id").notNull(),
	createdByUserId: text("created_by_user_id").notNull(),
	title: text().notNull(),
	clientName: text("client_name").notNull(),
	eventDates: json("event_dates"),
	venue: text(),
	scope: text().notNull(),
	attachmentsUrl: json("attachments_url"),
	deadlineAt: timestamp("deadline_at", { mode: 'string' }).notNull(),
	status: rfqStatus().default('draft').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("rfqs_agency_id_not_null", sql`NOT NULL agency_id`),
	check("rfqs_client_name_not_null", sql`NOT NULL client_name`),
	check("rfqs_created_at_not_null", sql`NOT NULL created_at`),
	check("rfqs_created_by_user_id_not_null", sql`NOT NULL created_by_user_id`),
	check("rfqs_deadline_at_not_null", sql`NOT NULL deadline_at`),
	check("rfqs_id_not_null", sql`NOT NULL id`),
	check("rfqs_scope_not_null", sql`NOT NULL scope`),
	check("rfqs_status_not_null", sql`NOT NULL status`),
	check("rfqs_title_not_null", sql`NOT NULL title`),
	check("rfqs_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const suppliers = pgTable("suppliers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	contactName: text("contact_name").notNull(),
	email: text().notNull(),
	phone: text(),
	logoUrl: text("logo_url"),
	brochureUrl: text("brochure_url"),
	idImageUrl: text("id_image_url"),
	location: json(),
	serviceCategories: json("service_categories"),
	servicesText: text("services_text"),
	isPublished: boolean("is_published").default(false).notNull(),
	status: orgStatus().default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("suppliers_contact_name_not_null", sql`NOT NULL contact_name`),
	check("suppliers_created_at_not_null", sql`NOT NULL created_at`),
	check("suppliers_email_not_null", sql`NOT NULL email`),
	check("suppliers_id_not_null", sql`NOT NULL id`),
	check("suppliers_is_published_not_null", sql`NOT NULL is_published`),
	check("suppliers_name_not_null", sql`NOT NULL name`),
	check("suppliers_status_not_null", sql`NOT NULL status`),
	check("suppliers_updated_at_not_null", sql`NOT NULL updated_at`),
]);
