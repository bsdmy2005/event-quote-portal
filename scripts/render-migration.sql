-- Render Postgres Migration Script
-- Generated from Supabase backup
-- For Event Quote Portal migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Public Schema Enums
CREATE TYPE public.invite_status AS ENUM (
    'invited',
    'opened',
    'submitted',
    'closed'
);

CREATE TYPE public.org_invite_type AS ENUM (
    'agency',
    'supplier'
);

CREATE TYPE public.org_status AS ENUM (
    'active',
    'inactive',
    'pending'
);

CREATE TYPE public.org_type AS ENUM (
    'agency',
    'supplier'
);

CREATE TYPE public.quotation_status AS ENUM (
    'submitted',
    'replaced'
);

CREATE TYPE public.rfq_status AS ENUM (
    'draft',
    'sent',
    'closed',
    'awarded',
    'not_awarded'
);

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'agency_admin',
    'agency_member',
    'supplier_admin',
    'supplier_member'
);


-- Public Schema Tables
CREATE TABLE public.agencies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL,
    phone text,
    logo_url text,
    website text,
    location json,
    interest_categories json,
    about text,
    status public.org_status DEFAULT 'active'::public.org_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_published boolean DEFAULT false NOT NULL
);

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    organization_type text NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_url text NOT NULL,
    file_size integer,
    mime_type text NOT NULL,
    width integer,
    height integer,
    alt_text text,
    caption text,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.org_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_type public.org_invite_type NOT NULL,
    org_id uuid NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    accepted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.profiles (
    user_id text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    role public.user_role DEFAULT 'agency_member'::public.user_role NOT NULL,
    agency_id uuid,
    supplier_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.quotations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rfq_invite_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    pdf_url text NOT NULL,
    notes text,
    submitted_at timestamp without time zone DEFAULT now() NOT NULL,
    status public.quotation_status DEFAULT 'submitted'::public.quotation_status NOT NULL,
    version integer DEFAULT 1 NOT NULL
);

CREATE TABLE public.rfq_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rfq_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    invite_status public.invite_status DEFAULT 'invited'::public.invite_status NOT NULL,
    last_activity_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.rfqs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_id uuid NOT NULL,
    created_by_user_id text NOT NULL,
    title text NOT NULL,
    client_name text NOT NULL,
    event_dates json,
    venue text,
    scope text NOT NULL,
    attachments_url json,
    deadline_at timestamp without time zone NOT NULL,
    status public.rfq_status DEFAULT 'draft'::public.rfq_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL,
    phone text,
    logo_url text,
    brochure_url text,
    id_image_url text,
    location json,
    service_categories json,
    services_text text,
    is_published boolean DEFAULT false NOT NULL,
    status public.org_status DEFAULT 'active'::public.org_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


-- Public Schema Data
-- Data for agencies
COPY public.agencies (id, name, contact_name, email, phone, logo_url, website, location, interest_categories, about, status, created_at, updated_at, is_published) FROM stdin;
39dc04f8-0001-4dbb-b7e4-fff0c3f6e16d	Innovation Event Group	Mandla Khumalo	mandla@innovationeventgroup.co.za	+27 11 678 9012	https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHwwfHx8MTc1NzI1MzcxNHww&ixlib=rb-4.1.0&q=80&w=1080	https://www.innovationeventgroup.co.za	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Product Launch Events","Brand Activation Events","Interactive Technology","Virtual Event Technology","Experiential Marketing"]	Innovation Event Group is at the forefront of event technology and innovation. We specialize in cutting-edge product launches, brand activations, and immersive experiences that leverage the latest technology to create unforgettable moments.	active	2025-09-07 14:01:55.57095	2025-09-07 14:01:55.57095	t
60be6a3f-9593-416b-b3c8-ee80a28670b0	Creative Events SA	Sarah Mitchell	sarah@creativeeventssa.co.za	+27 11 234 5678	https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHwwfHx8MTc1NzI1MzcxNHww&ixlib=rb-4.1.0&q=80&w=1080	https://www.creativeeventssa.co.za	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Corporate Event Planning","Brand Activation Events","Product Launch Events","Conference Management","Awards Ceremonies"]	Creative Events SA is a leading corporate event management company specializing in brand activations, product launches, and corporate conferences. We have worked with major brands including Netflix, DSTV, and Heineken to create memorable experiences that drive engagement and brand awareness.	active	2025-09-07 14:01:55.57095	2025-09-07 14:01:55.57095	t
e13d9852-86a1-4b0d-9ea5-7d4b8cd05858	Elite Corporate Events	Jennifer van der Merwe	jennifer@elitecorporateevents.co.za	+27 12 567 8901	https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHwwfHx8MTc1NzI1MzcxNHww&ixlib=rb-4.1.0&q=80&w=1080	https://www.elitecorporateevents.co.za	{"city":"Pretoria","province":"Gauteng","country":"South Africa"}	["Corporate Event Planning","Conference Management","Awards Ceremonies","Corporate Gala Events","Event Management"]	Elite Corporate Events is a premium event management company serving corporate clients across South Africa. We excel in delivering sophisticated corporate events, conferences, and awards ceremonies that reflect our clients' brand values and objectives.	active	2025-09-07 14:01:55.57095	2025-09-07 14:01:55.57095	t
e478eaac-76e5-4ec9-a464-1de5f80005fb	Premier Event Solutions	David Nkomo	david@premiereventsolutions.co.za	+27 21 345 6789	https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHwwfHx8MTc1NzI1MzcxNHww&ixlib=rb-4.1.0&q=80&w=1080	https://www.premiereventsolutions.co.za	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["Exhibition Management","Trade Show Management","Corporate Gala Events","Conference Management","Brand Activation Events"]	Premier Event Solutions delivers world-class corporate events and exhibitions across South Africa. Our expertise spans trade shows, corporate galas, and brand activations, with a focus on creating impactful experiences for our clients.	active	2025-09-07 14:01:55.57095	2025-09-07 14:01:55.57095	t
edc1a5a7-1811-4ba5-ac83-ca5ca11675a9	Dynamic Marketing Events	Thabo Mthembu	thabo@dynamicmarketingevents.co.za	+27 31 456 7890	https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHwwfHx8MTc1NzI1MzcxNHww&ixlib=rb-4.1.0&q=80&w=1080	https://www.dynamicmarketingevents.co.za	{"city":"Durban","province":"KwaZulu-Natal","country":"South Africa"}	["Brand Activation Events","Experiential Marketing","Product Launch Events","Digital Marketing","Event Marketing"]	Dynamic Marketing Events specializes in experiential marketing and brand activations that create lasting impressions. We combine creativity with strategic thinking to deliver events that resonate with target audiences and drive business results.	active	2025-09-07 14:01:55.57095	2025-09-07 14:01:55.57095	t
ed95638d-b7c5-4900-919e-3aab2e557ace	ES agency	Bereket Sendros Demeke	bereket@elenjicalsolutions.com	+27815547684	\N		{"city":"cpt","province":"Western Cape","country":"South Africa"}	["Seminars","Other","Networking Events","Team Building","Trade Shows","Product Launches","Weddings","Conferences","Awards Ceremonies","Gala Dinners","Charity Events"]	hello woeld	active	2025-09-14 16:03:29.30239	2025-09-14 16:03:29.30239	t
\.

-- Data for categories
COPY public.categories (id, name, created_at, updated_at) FROM stdin;
8020ce62-df2b-432c-a5a6-4617b312b7bd	Corporate Event Planning	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
44177ab2-fd1c-4b8d-9311-bcc17e04f5c7	Conference Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
66551390-fbc9-4547-847d-7263fd2def44	Exhibition Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
1c7fc37a-e4d6-4e82-8f5d-c88d9951ca43	Product Launch Events	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
7242eda2-0d2b-42d6-8f29-f7202c17b594	Brand Activation Events	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
8a01e95a-77ee-4350-9a8a-e62a2fb62c41	Trade Show Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
c0214a81-d995-4e0d-b0dd-93ba428e0287	Corporate Gala Events	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
5b833b57-78f9-4e0b-956b-3d86fa28305b	Awards Ceremonies	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
abd89594-7de8-42f9-906f-fd2d6305eadd	Corporate Event Venues	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
8b46aed9-f112-4dcb-a1fc-b8ad38bdad61	Conference Centers	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
9b9d4eef-bc92-4d74-b930-d70ae260b385	Exhibition Halls	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
ad0ad1de-226f-4728-88df-193fe3c7d599	Outdoor Corporate Venues	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
0266ece1-1e70-4d89-920e-ef76322e3aa4	Hotels & Resorts	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
d33e1bf2-6ba7-4248-b06a-f45a5725deeb	Convention Centers	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
a3e1fcd8-5a6a-4679-be47-1f2b54431980	Rooftop Venues	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
a457d5fd-8402-400d-9e38-16d89c085051	Industrial Venues	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
d56e491d-b1b3-4814-b4d6-2c5c05c79cb9	Audio Visual Equipment	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
0b0f82d6-ac81-4b73-8d71-04bc24ca128a	Live Streaming Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
41c032aa-770b-495f-b607-b10ef468a600	Event Photography	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
8c767116-8721-42f0-8289-4c96a1cce996	Event Videography	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
a2591f0b-13ea-4cba-9a35-151b9a0c0d48	LED Screens & Displays	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
ea278f84-b060-4594-ba5b-f0bd0717119f	Sound Systems	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
bba0dcc8-4e17-433b-bdcd-426ff5975c42	Lighting Design	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
4175ad9c-c8f2-4ca4-8450-649dc213842c	Virtual Event Technology	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
f6c4018c-4220-4faf-8c72-5fc6c1e44f04	Interactive Technology	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
df10ada6-23f5-46eb-908e-09a51ff8c86b	Projection Mapping	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
790fca1e-7ffc-400a-be7b-8e49cbe4e954	Corporate Catering	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
0099b13a-b118-4bfe-9c95-5bf168f46b71	Beverage Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
62e0fe20-ed41-471e-a764-9eedd6a8f3d4	Food Trucks	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
390b746c-73d8-4a46-b57c-32708f397908	Coffee Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
6145e552-82fa-4893-9a0d-01302afdeb29	Cocktail Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
21764359-5c91-4129-8580-bab364bab799	Fine Dining Catering	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
d9d7d9b5-b1fd-4210-8572-ad075fac9055	Buffet Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
7fadc097-9981-48c6-a101-e02bb92fcd06	Canapé Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
bc483b9c-2731-4e94-8905-514653f3cf4a	Live Music	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
62b3e335-cd5d-4f5c-b19e-19c9d080af65	Corporate Entertainment	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
e68a39db-ee36-4df8-8790-95a0400289db	Team Building Activities	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
f808d9ad-cf53-4416-88a7-db0faa883614	Cultural Entertainment	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
2df9c3da-14cf-4f84-858c-9acea715fc80	MC Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
599f1ddf-4a97-49fb-9ad3-ba98eea51bec	Speaker Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
0e751ed7-1afb-4261-8f20-e8098c45d161	Performance Artists	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
2385ff34-3955-46d3-a8f6-e76e7dae5565	Interactive Entertainment	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
d2e4db70-5810-46c2-bf59-d75dc08d9fcc	Brand Activation	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
f417a391-609d-41f9-ad6c-fe97b83a5854	Digital Marketing	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
6bb9f417-9836-4724-9b7b-792889ed6e33	Event Marketing	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
7db04e77-b29e-4cc3-9509-b85654f1c9e8	Public Relations	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
f94085ac-9f3d-4968-9d0c-88b17fc6b2e6	Content Creation	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
aa4d049c-b082-4929-8a5d-8e89aa34104b	Social Media Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
7c0e0bf3-d15a-47c9-91f5-5e85da24c5dd	Influencer Marketing	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
234e7cb3-8507-4199-b638-db2f6e9cb5e3	Experiential Marketing	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
2ff54fec-41ab-4a12-b248-2b8ff454a93e	Guerrilla Marketing	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
2385c408-fd59-49ed-85e8-a00799d53b5a	Product Sampling	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
e2393652-9c81-4642-9e1e-a219c0477367	Event Decor	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
d102018e-3be9-41ca-9d48-06ad6113b101	Floral Design	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
17cb0e9c-e517-4713-b59a-589a59bd78f5	Furniture Rental	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
1655b873-cd58-46d2-b49d-319ccaad1903	Themed Events	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
ff58cd88-496d-451c-9005-a2f260535795	Stage Design	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
970287a6-28a2-4725-8a06-9d086f903535	Exhibition Stands	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
0aa5d1e2-0ca6-40f1-bc37-fc02a402f57f	Branded Environments	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
ae8978d8-1311-4a0e-806e-31be131dd882	Wayfinding Design	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
30e04c00-06ba-4b61-b8a0-4c8516c07e40	Event Security	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
6a9c7012-9ff5-4193-ad59-cdd3beb18262	Transportation Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
35186818-e21a-4a90-8f7a-bbef7efe8bba	Event Staffing	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
3f6c6f38-2d24-4d26-b628-792ddda25ebb	Waste Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
55ac3f15-20ff-472a-855e-86539e6045b0	Insurance Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
e50ea52d-e043-4f75-91a7-37699a9369ba	Event Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
80a17524-d4ce-417c-a5fd-8c1054831af2	Logistics Coordination	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
71f67655-a51d-4b90-95e0-1d82f4899cf6	Crowd Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
b9e3a23e-6494-4c5a-af34-37c4a1065e34	Sustainability Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
38e1ce56-4852-4b02-87b4-3b9d144c529a	Accessibility Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
e4cf6645-34d9-4ded-8b01-8a57b965c29c	Language Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
a5d1dcd7-753e-485f-975a-3ab41947d384	Legal Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
9ebed50c-49e1-44ec-b4ef-cac71cf952d1	Financial Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
95f8c81f-4398-4428-b927-5cd7e2810319	Risk Management	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
547a140d-10e5-41d2-8512-0d03eb008632	Compliance Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
2d3bcf51-2910-4e80-b078-40df92374510	Health & Safety Services	2025-09-07 14:01:53.506236	2025-09-07 14:01:53.506236
\.

-- Data for images
COPY public.images (id, organization_id, organization_type, file_name, file_path, file_url, file_size, mime_type, width, height, alt_text, caption, is_featured, sort_order, created_at, updated_at) FROM stdin;
a13da832-0422-4e20-a0e9-fbf90564a9e7	a0e4490d-95a4-4896-a97d-01f3c8df243e	supplier	IMG_6737.jpg	supplier/a0e4490d-95a4-4896-a97d-01f3c8df243e/1757253945245_IMG_6737.jpg	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/supplier-images/supplier/a0e4490d-95a4-4896-a97d-01f3c8df243e/1757253945245_IMG_6737.jpg	431798	image/jpeg	\N	\N	IMG_6737.jpg	\N	f	0	2025-09-07 14:05:47.308565	2025-09-07 14:05:47.308565
9923ba2b-07af-4616-ac4b-c051913cc04d	fa690678-73dc-46de-a683-69c312a3d417	supplier	IMG_3963.jpg	supplier/fa690678-73dc-46de-a683-69c312a3d417/1757256381051_IMG_3963.jpg	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/supplier-images/supplier/fa690678-73dc-46de-a683-69c312a3d417/1757256381051_IMG_3963.jpg	350667	image/jpeg	\N	\N	IMG_3963.jpg	\N	f	0	2025-09-07 14:46:22.829013	2025-09-07 14:46:22.829013
340e05b8-2a27-4761-b6d4-8e3c749e1a35	fa690678-73dc-46de-a683-69c312a3d417	supplier	IMG_6737.jpg	supplier/fa690678-73dc-46de-a683-69c312a3d417/1757256381050_IMG_6737.jpg	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/supplier-images/supplier/fa690678-73dc-46de-a683-69c312a3d417/1757256381050_IMG_6737.jpg	431798	image/jpeg	\N	\N	IMG_6737.jpg	\N	f	0	2025-09-07 14:46:23.224492	2025-09-07 14:46:23.224492
11f28e9c-b9da-4835-8f45-5aea77e7ba9b	a151791f-2abc-40c2-8302-d6529aa70f1d	supplier	IMG_3963.jpg	supplier/a151791f-2abc-40c2-8302-d6529aa70f1d/1757256285302_IMG_3963.jpg	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/supplier-images/supplier/a151791f-2abc-40c2-8302-d6529aa70f1d/1757256285302_IMG_3963.jpg	350667	image/jpeg	\N	\N	IMG_3963.jpg	\N	f	0	2025-09-07 14:44:48.448742	2025-09-07 15:01:16.91
26215dd0-4851-4bb0-8096-7a6d335edb7d	a151791f-2abc-40c2-8302-d6529aa70f1d	supplier	IMG_6737.jpg	supplier/a151791f-2abc-40c2-8302-d6529aa70f1d/1757256285301_IMG_6737.jpg	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/supplier-images/supplier/a151791f-2abc-40c2-8302-d6529aa70f1d/1757256285301_IMG_6737.jpg	431798	image/jpeg	\N	\N	IMG_6737.jpg	\N	t	0	2025-09-07 14:44:48.862228	2025-09-07 15:01:17.278
d65167a7-57c9-4d77-a686-cef53c26de70	5f535bdd-cd6e-42bb-b60b-3e2de77d10ce	agency	QP_LOGO.png	agency/5f535bdd-cd6e-42bb-b60b-3e2de77d10ce/1757482600968_QP_LOGO.png	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/agency-images/agency/5f535bdd-cd6e-42bb-b60b-3e2de77d10ce/1757482600968_QP_LOGO.png	112566	image/png	\N	\N	QP_LOGO.png	\N	t	0	2025-09-10 05:36:44.075638	2025-09-10 05:36:44.075638
e4736593-c0f2-4a27-b4f6-5700fea57b6d	5f535bdd-cd6e-42bb-b60b-3e2de77d10ce	agency	Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	agency/5f535bdd-cd6e-42bb-b60b-3e2de77d10ce/1757483019913_Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/agency-images/agency/5f535bdd-cd6e-42bb-b60b-3e2de77d10ce/1757483019913_Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	726379	image/png	\N	\N	Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	\N	f	0	2025-09-10 05:43:43.496816	2025-09-10 05:43:43.496816
34e15b58-95d2-4c8c-a2d1-078ca0700ea9	ed95638d-b7c5-4900-919e-3aab2e557ace	agency	Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	agency/ed95638d-b7c5-4900-919e-3aab2e557ace/1757865810146_Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/agency-images/agency/ed95638d-b7c5-4900-919e-3aab2e557ace/1757865810146_Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	\N	image/png	\N	\N	Gemini_Generated_Image_lk9hx6lk9hx6lk9h.png	\N	t	0	2025-09-14 16:03:32.870193	2025-09-14 16:03:32.870193
\.

-- Data for org_invites
COPY public.org_invites (id, org_type, org_id, email, role, token_hash, expires_at, accepted_at, created_at) FROM stdin;
a6a222de-207b-4752-ae64-b26d7d5ae32b	agency	ed95638d-b7c5-4900-919e-3aab2e557ace	bereket@elenjical.com	agency_member	7a3349b37914a505c34aa3148d72ce34d759c62ddc5916a9b59d89b42c8352eb	2025-09-21 16:45:43.471	\N	2025-09-14 16:45:43.605179
9d510585-d8bc-4692-9d3e-dc86dd7fe42a	agency	ed95638d-b7c5-4900-919e-3aab2e557ace	bereket@elenjical.com	agency_member	9856346f158da02872e31c9e67ef22d55452e5b0a398b44f164777dff852aafd	2025-09-21 17:04:25.11	\N	2025-09-14 17:04:25.226939
8f3c0419-7251-4b95-a06c-557844c49828	agency	ed95638d-b7c5-4900-919e-3aab2e557ace	bereket.demeke89@gmail.com	agency_member	0ecdf20ed127a03fd7f662e1bd785c8487026b3e5e6dc27caba9132e24c114ea	2025-09-21 17:05:22.092	\N	2025-09-14 17:05:22.207407
\.

-- Data for profiles
COPY public.profiles (user_id, first_name, last_name, email, role, agency_id, supplier_id, created_at, updated_at) FROM stdin;
user_323cjLjA1pcfv12gLEADOuetjHg	Bereket	Demeke	nibble2008@gmail.com	admin	\N	\N	2025-09-07 10:46:01.258488	2025-09-07 10:46:01.258488
user_32hHAQ4P2dPH5uGFCz3cTf0CQwi	Bereket Sendros	Demeke	bereket@elenjicalsolutions.com	agency_admin	ed95638d-b7c5-4900-919e-3aab2e557ace	\N	2025-09-14 16:02:24.752981	2025-09-14 16:03:29.5
\.

-- Data for quotations
COPY public.quotations (id, rfq_invite_id, supplier_id, pdf_url, notes, submitted_at, status, version) FROM stdin;
\.

-- Data for rfq_invites
COPY public.rfq_invites (id, rfq_id, supplier_id, invite_status, last_activity_at, created_at) FROM stdin;
\.

-- Data for rfqs
COPY public.rfqs (id, agency_id, created_by_user_id, title, client_name, event_dates, venue, scope, attachments_url, deadline_at, status, created_at, updated_at) FROM stdin;
\.

-- Data for suppliers
COPY public.suppliers (id, name, contact_name, email, phone, logo_url, brochure_url, id_image_url, location, service_categories, services_text, is_published, status, created_at, updated_at) FROM stdin;
e71575d4-d431-4e5d-8f8f-8c8ae2801207	ProSound AV Solutions	Mike Johnson	mike@prosoundav.co.za	+27 11 123 4567	https://images.unsplash.com/photo-1504904126298-3fde501c9b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMHN5c3RlbXxlbnwwfDB8fHwxNzU3MjUzNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1504904126298-3fde501c9b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMHN5c3RlbXxlbnwwfDB8fHwxNzU3MjUzNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1495232714953-ef7f41577786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxsZWQlMjBzY3JlZW58ZW58MHwwfHx8MTc1NzI1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Audio Visual Equipment","Sound Systems","LED Screens & Displays","Lighting Design","Live Streaming Services"]	Professional audio visual equipment rental and technical support for corporate events, conferences, and brand activations. We provide state-of-the-art sound systems, LED displays, lighting solutions, and live streaming services.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
299fdadd-87eb-4d68-b532-e524a3dca8d0	Visual Impact Technologies	Lisa Chen	lisa@visualimpacttech.co.za	+27 21 234 5678	https://images.unsplash.com/photo-1495232714953-ef7f41577786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxsZWQlMjBzY3JlZW58ZW58MHwwfHx8MTc1NzI1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1556173251-cab2c1e8abe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9qZWN0aW9uJTIwbWFwcGluZ3xlbnwwfDB8fHwxNzU3MjUzNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1747320735590-cf0571c39c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxpbnRlcmFjdGl2ZSUyMGRpc3BsYXl8ZW58MHwwfHx8MTc1NzI1MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["LED Screens & Displays","Projection Mapping","Interactive Technology","Virtual Event Technology","Audio Visual Equipment"]	Cutting-edge visual technology solutions including LED screens, projection mapping, and interactive displays. We specialize in creating immersive visual experiences for corporate events and brand activations.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
4378dab6-80ce-4d64-9d72-60b99f269dca	Crystal Clear Sound	Peter van Zyl	peter@crystalclearsound.co.za	+27 31 345 6789	https://images.unsplash.com/photo-1504904126298-3fde501c9b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMHN5c3RlbXxlbnwwfDB8fHwxNzU3MjUzNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1504904126298-3fde501c9b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMHN5c3RlbXxlbnwwfDB8fHwxNzU3MjUzNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1607968565043-36af90dde238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxsaXZlJTIwc3RyZWFtaW5nfGVufDB8MHx8fDE3NTcyNTM3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Durban","province":"KwaZulu-Natal","country":"South Africa"}	["Sound Systems","Audio Visual Equipment","Live Streaming Services","Lighting Design"]	Premium sound system rental and audio engineering services for corporate events, conferences, and live streaming. Our team ensures crystal clear audio quality for all your event needs.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
91a7a8a6-93cf-4eee-b17a-bd1e346b8584	Gourmet Corporate Catering	Chef Maria Santos	maria@gourmetcorporate.co.za	+27 11 456 7890	https://images.unsplash.com/photo-1683012235616-a214aa0bf654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjYXRlcmluZ3xlbnwwfDB8fHwxNzU3MjUzNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nfGVufDB8MHx8fDE3NTcyNTM3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Corporate Catering","Fine Dining Catering","Canapé Services","Beverage Services","Coffee Services"]	Exquisite corporate catering services specializing in fine dining, canapés, and premium beverage services. We cater to high-profile corporate events, conferences, and brand activations across South Africa.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
55fa7b18-5944-4212-bb2f-984c15a89a35	Urban Food Trucks	James Mthembu	james@urbanfoodtrucks.co.za	+27 21 567 8901	https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJ1Y2t8ZW58MHwwfHx8MTc1NzI1MzcyM3ww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1683012235616-a214aa0bf654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjYXRlcmluZ3xlbnwwfDB8fHwxNzU3MjUzNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["Food Trucks","Corporate Catering","Buffet Services","Beverage Services"]	Modern food truck services for corporate events and brand activations. We offer diverse cuisine options and can provide multiple trucks for large-scale events and activations.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
b870c55d-8c5e-4cd0-8860-b6638424aabc	Premium Bar Services	Sarah Williams	sarah@premiumbarservices.co.za	+27 31 678 9012	https://images.unsplash.com/photo-1674654658736-fb56d31118ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxiYXIlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1502819126416-d387f86d47a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhcnxlbnwwfDB8fHwxNzU3MjUzNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1683012235616-a214aa0bf654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjYXRlcmluZ3xlbnwwfDB8fHwxNzU3MjUzNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Durban","province":"KwaZulu-Natal","country":"South Africa"}	["Beverage Services","Cocktail Services","Corporate Catering","Coffee Services"]	Professional bar and beverage services for corporate events, including cocktail bars, coffee stations, and premium beverage management. We ensure exceptional service and quality drinks.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
aa69d662-ca03-48c1-8e74-243c3a4c1c7b	Grand Convention Centre	Robert Smith	robert@grandconvention.co.za	+27 11 789 0123	https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcm9vbXxlbnwwfDB8fHwxNzU3MjUzNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1718099066109-81964e5df51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxleGhpYml0aW9uJTIwaGFsbHxlbnwwfDB8fHwxNzU3MjUzNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudHxlbnwwfDB8fHwxNzU3MjUzNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Conference Centers","Exhibition Halls","Corporate Event Venues","Convention Centers"]	Premier convention and conference center in Johannesburg, offering state-of-the-art facilities for corporate events, exhibitions, and conferences. Capacity for up to 2000 delegates.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
9cefda41-a37f-482b-bf71-755c3fd13504	Cape Town Event Hub	Amanda Botha	amanda@capetowneventhub.co.za	+27 21 890 1234	https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudHxlbnwwfDB8fHwxNzU3MjUzNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1747762315292-1518fc21ac0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwdmVudWV8ZW58MHwwfHx8MTc1NzI1MzcyOXww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["Corporate Event Venues","Rooftop Venues","Outdoor Corporate Venues","Hotels & Resorts"]	Versatile event venue in Cape Town offering indoor and outdoor spaces, including a stunning rooftop venue with panoramic views. Perfect for corporate events, product launches, and brand activations.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
18abe300-1c0f-4bfd-b3dc-1170fbb9debb	Industrial Event Space	Thabo Nkosi	thabo@industrialeventspace.co.za	+27 31 901 2345	https://images.unsplash.com/photo-1671318676228-5d4ed98053f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwc3BhY2V8ZW58MHwwfHx8MTc1NzI1MzczMHww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1718099066109-81964e5df51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxleGhpYml0aW9uJTIwaGFsbHxlbnwwfDB8fHwxNzU3MjUzNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudHxlbnwwfDB8fHwxNzU3MjUzNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Durban","province":"KwaZulu-Natal","country":"South Africa"}	["Industrial Venues","Exhibition Halls","Corporate Event Venues","Outdoor Corporate Venues"]	Unique industrial event space perfect for large-scale brand activations, product launches, and corporate events. Features high ceilings, open spaces, and modern amenities.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
2e0eac9c-c2a5-45a8-895b-714c8ed1dc3d	Corporate Entertainment Group	Zanele Mthembu	zanele@corporateentertainment.co.za	+27 11 012 3456	https://images.unsplash.com/photo-1606920294061-f3db54fdc890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBlbnRlcnRhaW5tZW50fGVufDB8MHx8fDE3NTcyNTM3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1614999098814-23c48ffa512d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWN8ZW58MHwwfHx8MTc1NzI1MzczMnww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1702562546723-ba4f7aaa3008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMGhvc3R8ZW58MHwwfHx8MTc1NzI1MzczMnww&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Corporate Entertainment","Live Music","MC Services","Performance Artists","Interactive Entertainment"]	Professional entertainment services for corporate events, including live music, MCs, performance artists, and interactive entertainment. We provide entertainment that aligns with your brand and event objectives.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
68fdb001-a602-4e8c-898d-dbddce92743b	Team Building Adventures	Mark Johnson	mark@teambuildingadventures.co.za	+27 21 123 4567	https://images.unsplash.com/photo-1704386651981-0729a60da579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwYnVpbGRpbmd8ZW58MHwwfHx8MTc1NzI1MzczM3ww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1606920294061-f3db54fdc890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBlbnRlcnRhaW5tZW50fGVufDB8MHx8fDE3NTcyNTM3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["Team Building Activities","Corporate Entertainment","Interactive Entertainment","Cultural Entertainment"]	Specialized team building activities and corporate entertainment designed to enhance team cohesion and engagement. We offer both indoor and outdoor activities suitable for corporate events.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
7833f285-29a1-4b39-b5e4-f6edeea3ea5a	Brand Activation Specialists	Nomsa Dlamini	nomsa@brandactivationspecialists.co.za	+27 31 234 5678	https://images.unsplash.com/photo-1600066976076-598228593a92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGFjdGl2YXRpb258ZW58MHwwfHx8MTc1NzI1MzczNXww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1649766508871-9dabf2127f5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxleHBlcmllbnRpYWwlMjBtYXJrZXRpbmd8ZW58MHwwfHx8MTc1NzI1MzczNXww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1587755887860-edeaf70346ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwc2FtcGxpbmd8ZW58MHwwfHx8MTc1NzI1MzczNnww&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Durban","province":"KwaZulu-Natal","country":"South Africa"}	["Brand Activation","Experiential Marketing","Product Sampling","Guerrilla Marketing","Event Marketing"]	Specialized brand activation and experiential marketing services. We create immersive brand experiences that drive engagement and deliver measurable results for corporate clients.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
d2a51c40-c5e7-47d5-bf78-a7cf5acddce9	Digital Event Marketing	Kevin O'Connor	kevin@digitaleventmarketing.co.za	+27 11 345 6789	https://images.unsplash.com/photo-1557838923-2985c318be48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nfGVufDB8MHx8fDE3NTcyNTM3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1505373877841-8d25f7d46678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMG1hcmtldGluZ3xlbnwwfDB8fHwxNzU3MjUzNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Digital Marketing","Event Marketing","Social Media Management","Content Creation","Influencer Marketing"]	Digital marketing services specifically tailored for events and brand activations. We provide social media management, content creation, and influencer marketing to maximize event reach and engagement.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
ec7a9b16-9398-43ab-875a-340d81e73772	Elite Event Decor	Grace Mokoena	grace@eliteeventdecor.co.za	+27 21 456 7890	https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMGRlY29yYXRpb258ZW58MHwwfHx8MTc1NzI1MzczOHww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1697842609344-f238a1b2ded2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBhcnJhbmdlbWVudHxlbnwwfDB8fHwxNzU3MjUzNzM5fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1566904501875-35009b7075fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMGxpZ2h0aW5nfGVufDB8MHx8fDE3NTcyNTM3NDB8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["Event Decor","Floral Design","Lighting Design","Furniture Rental","Themed Events"]	Premium event decoration and styling services for corporate events. We specialize in creating sophisticated, branded environments that reflect your company's image and event objectives.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
b2648140-62c6-4e12-ba9a-172d53effa73	Stage Design Solutions	Andre van der Berg	andre@stagedesignsolutions.co.za	+27 31 567 8901	https://images.unsplash.com/photo-1494435619026-9e21da76be75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxzdGFnZSUyMGRlc2lnbnxlbnwwfDB8fHwxNzU3MjUzNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1698935958560-2891be2d84c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxleGhpYml0aW9uJTIwc3RhbmR8ZW58MHwwfHx8MTc1NzI1Mzc0MXww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Durban","province":"KwaZulu-Natal","country":"South Africa"}	["Stage Design","Exhibition Stands","Branded Environments","Wayfinding Design","Lighting Design"]	Professional stage design and exhibition stand solutions for corporate events, conferences, and brand activations. We create impactful visual environments that enhance your event experience.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
4cd89a59-1df4-402a-8b3f-7a0fcb3569ad	Secure Event Solutions	Captain John Pretorius	john@secureeventsolutions.co.za	+27 11 678 9012	https://images.unsplash.com/photo-1571283056653-e9802feac258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMHNlY3VyaXR5fGVufDB8MHx8fDE3NTcyNTM3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxyaXNrJTIwbWFuYWdlbWVudHxlbnwwfDB8fHwxNzU3MjUzNzQzfDA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Event Security","Crowd Management","Risk Management","Health & Safety Services"]	Professional security services for corporate events, including crowd management, risk assessment, and health & safety compliance. We ensure safe and secure events for all attendees.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
0acc46b1-7e11-469f-b57a-8e44bef4f86f	Event Staffing Solutions	Patricia Ndlovu	patricia@eventstaffingsolutions.co.za	+27 21 789 0123	https://images.unsplash.com/photo-1573798484153-da43eda898f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMHN0YWZmfGVufDB8MHx8fDE3NTcyNTM3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1699444118005-56d854416bc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMGxvZ2lzdGljc3xlbnwwfDB8fHwxNzU3MjUzNzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["Event Staffing","Logistics Coordination","Event Management","Crowd Management"]	Professional event staffing and logistics coordination services. We provide trained, professional staff for corporate events, conferences, and brand activations across South Africa.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
a77f71cb-b4f2-4fd0-9fe2-c642f92df235	Premium Transportation	Sipho Mthembu	sipho@premiumtransportation.co.za	+27 31 890 1234	https://images.unsplash.com/photo-1667339025643-81a5aba3b368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB0cmFuc3BvcnRhdGlvbnxlbnwwfDB8fHwxNzU3MjUzNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1699444118005-56d854416bc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMGxvZ2lzdGljc3xlbnwwfDB8fHwxNzU3MjUzNzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Durban","province":"KwaZulu-Natal","country":"South Africa"}	["Transportation Services","Logistics Coordination","Event Management"]	Premium transportation services for corporate events, including executive vehicles, shuttle services, and logistics coordination. We ensure reliable and comfortable transportation for your event attendees.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
87a52a26-ba8c-446c-8c14-ee5985300a9e	Corporate Media Productions	Alex Thompson	alex@corporatemediaproductions.co.za	+27 11 901 2345	https://images.unsplash.com/photo-1614607653708-0777e6d003b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBob3RvZ3JhcGh5fGVufDB8MHx8fDE3NTcyNTM3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1497015289639-54688650d173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHByb2R1Y3Rpb258ZW58MHwwfHx8MTc1NzI1Mzc0OHww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1560264418-c4445382edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlfGVufDB8MHx8fDE3NTcyNTM3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Johannesburg","province":"Gauteng","country":"South Africa"}	["Event Photography","Event Videography","Content Creation","Live Streaming Services"]	Professional event photography and videography services for corporate events, conferences, and brand activations. We capture high-quality content for marketing and documentation purposes.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
07ea2f48-7ff3-4349-a3a6-d2987a06f62b	Live Stream Solutions	Rachel Green	rachel@livestreamsolutions.co.za	+27 21 012 3456	https://images.unsplash.com/photo-1607968565043-36af90dde238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHxsaXZlJTIwc3RyZWFtaW5nfGVufDB8MHx8fDE3NTcyNTM3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwZXZlbnR8ZW58MHwwfHx8MTc1NzI1Mzc0OXww&ixlib=rb-4.1.0&q=80&w=1080	https://images.unsplash.com/photo-1497015289639-54688650d173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDE1MTZ8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHByb2R1Y3Rpb258ZW58MHwwfHx8MTc1NzI1Mzc0OHww&ixlib=rb-4.1.0&q=80&w=1080	{"city":"Cape Town","province":"Western Cape","country":"South Africa"}	["Live Streaming Services","Virtual Event Technology","Event Videography","Interactive Technology"]	Professional live streaming and virtual event technology services. We provide high-quality live streaming solutions for corporate events, conferences, and hybrid events.	t	active	2025-09-07 14:02:29.988564	2025-09-07 14:02:29.988564
fa690678-73dc-46de-a683-69c312a3d417	supplier2	bereket	bereket@supplier2.com		\N	\N	\N	{"street":"456 main street","suburb":"sandton","city":"jhb","province":"jhb","postalCode":"2019","country":"sa"}	["0099b13a-b118-4bfe-9c95-5bf168f46b71","8b46aed9-f112-4dcb-a1fc-b8ad38bdad61","547a140d-10e5-41d2-8512-0d03eb008632"]	SA lisitng	t	active	2025-09-07 14:46:20.858838	2025-09-07 14:46:20.858838
a151791f-2abc-40c2-8302-d6529aa70f1d	supplier test	bereket	bereket@supplier.com	0114567891	\N	\N	\N	{"street":"123 main street","suburb":"sandton ","city":"jhb","province":"jhb","postalCode":"jhb","country":"sa"}	["6bb9f417-9836-4724-9b7b-792889ed6e33"]	hello world	t	active	2025-09-07 14:44:45.048248	2025-09-07 15:01:20.199
\.


-- Drizzle Migrations Tracking
CREATE SCHEMA IF NOT EXISTS drizzle;

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


-- Primary Key Constraints
ALTER TABLE ONLY public.agencies
    ADD CONSTRAINT agencies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.org_invites
    ADD CONSTRAINT org_invites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.rfq_invites
    ADD CONSTRAINT rfq_invites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.rfqs
    ADD CONSTRAINT rfqs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);

-- Foreign Key Constraints
