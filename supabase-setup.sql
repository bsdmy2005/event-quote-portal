-- Supabase RLS Policy Setup
-- Run this in your Supabase SQL Editor

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for agencies table
CREATE POLICY "Allow all operations on agencies" ON agencies
    FOR ALL USING (true);

-- Create policies for suppliers table  
CREATE POLICY "Allow all operations on suppliers" ON suppliers
    FOR ALL USING (true);

-- Create policies for images table
CREATE POLICY "Allow all operations on images" ON images
    FOR ALL USING (true);

-- Create policies for categories table
CREATE POLICY "Allow all operations on categories" ON categories
    FOR ALL USING (true);

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant permissions for storage
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.objects TO anon;
