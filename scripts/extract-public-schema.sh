#!/bin/bash
# Extract public schema from Supabase backup for Render Postgres migration

BACKUP_FILE="../db_cluster-23-09-2025@02-32-35.backup.gz"
OUTPUT_FILE="./render-migration.sql"

echo "-- Render Postgres Migration Script" > $OUTPUT_FILE
echo "-- Generated from Supabase backup" >> $OUTPUT_FILE
echo "-- Date: $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "-- Enable UUID extension" >> $OUTPUT_FILE
echo "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Extract public schema enums (types)
echo "-- Public Schema Types (Enums)" >> $OUTPUT_FILE
gunzip -c $BACKUP_FILE | sed -n '/^CREATE TYPE public\./,/;$/p' >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Extract public schema tables
echo "-- Public Schema Tables" >> $OUTPUT_FILE
gunzip -c $BACKUP_FILE | sed -n '/^CREATE TABLE public\./,/^);$/p' >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Extract drizzle migrations table
echo "-- Drizzle Migrations Table" >> $OUTPUT_FILE
echo "CREATE SCHEMA IF NOT EXISTS drizzle;" >> $OUTPUT_FILE
gunzip -c $BACKUP_FILE | sed -n '/^CREATE TABLE drizzle\.__drizzle_migrations/,/^);$/p' >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Extract data for public schema tables
echo "-- Public Schema Data" >> $OUTPUT_FILE

# List of tables to extract data from
tables=("agencies" "categories" "images" "org_invites" "profiles" "quotations" "rfq_invites" "rfqs" "suppliers")

for table in "${tables[@]}"; do
    echo "-- Extracting $table..."
    echo "" >> $OUTPUT_FILE
    echo "-- Data for $table" >> $OUTPUT_FILE

    # Find the COPY statement and extract until \.
    gunzip -c $BACKUP_FILE | awk "/^COPY public\.$table /,/^\\\\\.$/" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
done

# Extract drizzle migrations data
echo "-- Drizzle migrations data" >> $OUTPUT_FILE
gunzip -c $BACKUP_FILE | awk '/^COPY drizzle\.__drizzle_migrations /,/^\\.$/' >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Extract sequences and constraints
echo "-- Sequences and Constraints" >> $OUTPUT_FILE
gunzip -c $BACKUP_FILE | grep -E "^ALTER TABLE ONLY public\." >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "Migration script generated: $OUTPUT_FILE"
