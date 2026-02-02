-- URL Migration Script: Supabase to Cloudflare R2
-- This script updates file URLs in the database from Supabase storage to R2

-- Preview changes first (run this to see what will be updated)
-- SELECT id, file_url,
--   REPLACE(file_url,
--     'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
--     'https://pub-41d387c0ff02483e911445e83de66a0f.r2.dev/'
--   ) AS new_url
-- FROM images
-- WHERE file_url LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

-- Update images table: file_url column
UPDATE public.images
SET file_url = REPLACE(
  file_url,
  'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
  'https://pub-41d387c0ff02483e911445e83de66a0f.r2.dev/'
)
WHERE file_url LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

-- Update images table: file_path column (keep relative paths, just in case they have full URLs)
UPDATE public.images
SET file_path = REPLACE(
  file_path,
  'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
  ''
)
WHERE file_path LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

-- Update agencies table: logo_url column (if it contains Supabase URLs)
UPDATE public.agencies
SET logo_url = REPLACE(
  logo_url,
  'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
  'https://pub-41d387c0ff02483e911445e83de66a0f.r2.dev/'
)
WHERE logo_url LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

-- Update suppliers table: logo_url, brochure_url, id_image_url columns (if they contain Supabase URLs)
UPDATE public.suppliers
SET logo_url = REPLACE(
  logo_url,
  'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
  'https://pub-41d387c0ff02483e911445e83de66a0f.r2.dev/'
)
WHERE logo_url LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

UPDATE public.suppliers
SET brochure_url = REPLACE(
  brochure_url,
  'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
  'https://pub-41d387c0ff02483e911445e83de66a0f.r2.dev/'
)
WHERE brochure_url LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

UPDATE public.suppliers
SET id_image_url = REPLACE(
  id_image_url,
  'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
  'https://pub-41d387c0ff02483e911445e83de66a0f.r2.dev/'
)
WHERE id_image_url LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

-- Update quotations table: pdf_url column
UPDATE public.quotations
SET pdf_url = REPLACE(
  pdf_url,
  'https://xchlkuftbcplolwdkagt.supabase.co/storage/v1/object/public/',
  'https://pub-41d387c0ff02483e911445e83de66a0f.r2.dev/'
)
WHERE pdf_url LIKE '%xchlkuftbcplolwdkagt.supabase.co%';

-- Verify the changes
SELECT 'images' as table_name, COUNT(*) as total,
       SUM(CASE WHEN file_url LIKE '%r2.dev%' THEN 1 ELSE 0 END) as r2_urls,
       SUM(CASE WHEN file_url LIKE '%supabase.co%' THEN 1 ELSE 0 END) as supabase_urls
FROM public.images
UNION ALL
SELECT 'agencies', COUNT(*),
       SUM(CASE WHEN logo_url LIKE '%r2.dev%' THEN 1 ELSE 0 END),
       SUM(CASE WHEN logo_url LIKE '%supabase.co%' THEN 1 ELSE 0 END)
FROM public.agencies WHERE logo_url IS NOT NULL
UNION ALL
SELECT 'suppliers', COUNT(*),
       SUM(CASE WHEN logo_url LIKE '%r2.dev%' OR brochure_url LIKE '%r2.dev%' OR id_image_url LIKE '%r2.dev%' THEN 1 ELSE 0 END),
       SUM(CASE WHEN logo_url LIKE '%supabase.co%' OR brochure_url LIKE '%supabase.co%' OR id_image_url LIKE '%supabase.co%' THEN 1 ELSE 0 END)
FROM public.suppliers;
