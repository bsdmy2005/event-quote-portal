# Quote Portal — MVP 1.0 (Reduced) _with Agency Onboarding_
Lean, document‑driven workflow focusing on **Supplier ↔ Agency** engagement. No line‑item parsing or compliance vault in Phase I.

---

## 1) Goals & Scope
**Goal:** Enable agencies to discover suppliers and run RFQs; enable suppliers to maintain profiles and respond with **PDF quotations**; enable admins to bootstrap the ecosystem (categories, suppliers, agencies).

**In‑scope (Phase I)**
- Supplier onboarding & profile (incl. ID image) + services listing
- **Agency onboarding & profile**
- Admin management of **categories**, suppliers, and agencies
- Agency: supplier directory browsing + contact details
- Agency: RFQ creation & sending (document‑driven brief)
- Supplier: RFQ inbox & **PDF quotation** submission
- Basic email notifications (invites, submissions)

**Out‑of‑scope (later phases)**
- Compliance vault, line‑item quote parsing
- Payments/escrow, analytics, negotiation chat, SSO, contracts/e‑sign

---

## 2) Roles, Orgs & Permissions
- **Admin**
  - Create/edit **categories**
  - Create suppliers & agencies (manual onboarding)
  - Disable/enable orgs and users
- **Agency (Org + Users)**
  - **Agency Admin:** manage agency profile, invite teammates
  - **Agency Member:** browse directory, create/send RFQs, view submissions
- **Supplier (Org + Users)**
  - **Supplier Admin:** manage supplier profile, services, ID image
  - **Supplier Member:** view RFQs, submit/replace quotations (PDF)

> _Note_: Each user belongs to **0 or 1 org** (`agency` or `supplier`). Admin users belong to no customer org.

---

## 3) Core Features

### 3.1 Agency Onboarding & Profile
**User stories**
- As an admin, I can create an **agency** and send an invite to its admin.
- As an invited agency admin, I can accept the invite, set password, and complete profile.

**Agency Profile (min fields)**
- Agency name, primary contact name, email, phone
- Logo (optional), website (optional)
- Location (city, province, country)
- Areas of interest (categories multi‑select)
- About/notes (free text)

**Acceptance**
- Invite link valid 7 days; one‑time use
- On acceptance, agency admin can invite team (email + role)

---

### 3.2 Supplier Onboarding & Profile
**Supplier Profile (min fields)**
- Company name, primary contact name, email, phone
- Location(s) (city/province/country)
- **ID image** (PDF/JPG/PNG) — _for now stored and visible to agencies_
- Services offered:
  - Categories (multi‑select from admin list)
  - Services description (free text)
- Logo, brochure (PDF, optional)

**Acceptance**
- Profile can be drafted and published (visibility toggle)
- Agencies can view contact info and download brochure/ID image

---

### 3.3 Categories Management (Admin)
- CRUD categories (e.g., Catering, AV, Décor, Transport, Venue)
- Categories used by both suppliers (services) and agencies (interest)
- Validation: unique name (case‑insensitive)

---

### 3.4 Supplier Directory (Agency)
**Browse & Search**
- Filters: category, location, text search over services
- Supplier card: name, services snippet, categories, location, contact email/phone
- Supplier detail: full services text, downloads (logo, brochure, ID image)

**Acceptance**
- Filter + search returns results <1s on 1k suppliers
- Click‑to‑copy contact details

---

### 3.5 RFQ Creation & Send (Agency) — _Document‑driven_
**RFQ Form**
- Title, client/event name
- Event dates, venue/location
- Scope summary (rich text)
- Attachments (PDF preferred; images allowed)
- Response **deadline (date & time)**, timezone
- Invite suppliers (search & select from directory)

**Send**
- Creates RFQ and an invite per supplier
- Sends email with secure link to each invited supplier

**Acceptance**
- RFQ states: `Draft → Sent → Closed (deadline) → Awarded/Not Awarded` (award optional later)
- Agency can extend deadline (sends update email)

---

### 3.6 RFQ Inbox & Quotation Submission (Supplier)
**Inbox**
- List of invited RFQs with sort by deadline
- RFQ view shows scope, attachments, agency contact

**Quotation Submission**
- Upload **one PDF** (allow replace until deadline)
- Optional notes (plain text)
- On submit/replace, agency notified via email

**Acceptance**
- File types: PDF (primary), allow JPG/PNG
- Max size: 20 MB/file
- Version history retained (metadata only; keep last file active)

---

### 3.7 Notifications (Minimal)
- **Agency → Supplier invite:** “You’re invited to quote: {RFQ Title} (due {deadline})” + secure link
- **Supplier → Agency quote submitted/replaced:** “New quotation from {Supplier} — {RFQ Title}” + view link
- **Optional later:** 24h deadline reminder to suppliers

---

## 4) Data Model (Simplified)
*(Relational; UUID PKs)*

**users**
- id, email (unique), password_hash, name, role (`admin|agency_admin|agency_member|supplier_admin|supplier_member`),
  agency_id (nullable), supplier_id (nullable), created_at, last_login_at, is_active

**agencies**
- id, name, contact_name, email, phone, logo_url, website, location, interest_categories (string[]), about, status, created_at, updated_at

**suppliers**
- id, name, contact_name, email, phone, logo_url, brochure_url, id_image_url, location, service_categories (string[]), services_text, status, created_at, updated_at

**categories**
- id, name, created_at, updated_at, UNIQUE(name_ci)

**rfqs**
- id, agency_id (fk), created_by_user_id (fk), title, client_name, event_dates (json), venue, scope, attachments_url (json[]), deadline_at, status, created_at, updated_at

**rfq_invites**
- id, rfq_id (fk), supplier_id (fk), invite_status (`invited|opened|submitted|closed`), last_activity_at, created_at

**quotations**
- id, rfq_invite_id (fk), supplier_id (fk), pdf_url, notes, submitted_at, status (`submitted|replaced`), version (int)

**org_invites**
- id, org_type (`agency|supplier`), org_id (fk), email, role, token_hash, expires_at, accepted_at, created_at

---

## 5) Key Workflows (Happy Paths)

### 5.1 Admin creates Agency & invites admin
1. Admin → Create Agency
2. Admin → Invite agency admin (email + role)
3. Email → Accept invite → Set password → Complete profile
4. Agency admin → Invite members

### 5.2 Agency creates RFQ & invites suppliers
1. Agency member → Create RFQ draft
2. Select suppliers → **Send**
3. System → Create invites + send emails
4. Suppliers submit PDFs
5. Agency views submissions & downloads files

### 5.3 Supplier onboarding
1. Admin creates Supplier (or public signup queued for approval — optional later)
2. Supplier admin completes profile, uploads **ID image** and services

---

## 6) Acceptance Criteria (Phase I)

**Agency Onboarding**
- [ ] Invite flow generates one‑time, 7‑day link
- [ ] Agency profile editable by agency admins only
- [ ] Team invites limited to same org

**Supplier Profiles**
- [ ] Published profiles appear in directory
- [ ] ID image uploaded & downloadable by agencies
- [ ] Category selection limited to admin list

**Directory**
- [ ] Filter by category + text search over services_text
- [ ] Supplier card shows contact details and categories

**RFQs**
- [ ] Invites created per supplier; email queued
- [ ] Deadline enforced for submission/replace
- [ ] Extending deadline updates all invites and emails

**Quotations**
- [ ] Single active PDF per invite; version increments on replace
- [ ] Agency notified on submit/replace
- [ ] Files virus‑scanned and stored in object storage

**Security & Audit (minimal)**
- [ ] RBAC enforced at route level
- [ ] Audit log of RFQ sends and quote submissions
- [ ] Signed links (JWT) for invite acceptance

---

## 7) Minimal API Sketch

**Auth & Invites**
- `POST /auth/login`
- `POST /invites` (admin) — body: {org_type, org_id, email, role}
- `POST /invites/accept` — body: {token, password, name}

**Agencies**
- `POST /agencies` (admin)
- `GET /agencies/{id}`
- `PUT /agencies/{id}` (agency_admin)

**Suppliers**
- `POST /suppliers` (admin)
- `GET /suppliers?category=&q=&location=`
- `GET /suppliers/{id}`
- `PUT /suppliers/{id}` (supplier_admin)

**Categories**
- `GET /categories`
- `POST /categories` (admin)
- `PUT /categories/{id}` (admin)

**RFQs & Quotes**
- `POST /rfqs` (agency_member/admin)  # create + attach files
- `POST /rfqs/{id}/send`              # generate invites + emails
- `GET /rfqs/{id}`                    # agency view
- `GET /invites/{id}`                 # supplier RFQ view
- `POST /invites/{id}/quotation`      # upload/replace PDF
- `POST /invites/{id}/close`          # system on deadline

---

## 8) Email Templates (Phase I)

**Agency Admin Invite**
- Subject: “You’ve been invited to join Code Portal — {Agency Name}”
- Body: CTA to accept invite, expires in 7 days

**Supplier RFQ Invite**
- Subject: “RFQ: {Title} (due {DD Mon, HH:mm})”
- Body: summary + secure link

**Quotation Submitted (to Agency)**
- Subject: “New quotation from {Supplier} — {RFQ Title}”
- Body: link to RFQ view + download

---

## 9) Non‑Functional (Phase I)
- **Storage:** S3‑compatible; 20 MB/file; content‑type validation & AV scan
- **Auth:** Email+password; invite acceptance tokens (JWT, short TTL)
- **Perf:** P95 < 2s for directory & RFQ pages
- **Backups:** Daily DB backup, 7‑day retention
- **Internationalization:** Timezone handling on deadlines

---

## 10) Release Plan (2 Sprints)

**Sprint 1**
- Orgs & users (agencies, suppliers) + invite flow
- Categories CRUD
- Supplier profile (ID image, services) & directory

**Sprint 2**
- RFQ creation/send + inbox
- PDF quotation upload/replace + notifications
- Hardening (security, audit, file scanning)
