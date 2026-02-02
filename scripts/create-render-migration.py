#!/usr/bin/env python3
"""
Extract public schema from Supabase backup for Render Postgres migration.
This script creates a clean SQL file that can be imported to Render Postgres.
"""

import re
import sys

INPUT_FILE = "/tmp/full_backup.sql"
OUTPUT_FILE = "/Users/bereketmac/projects/personal/event_qoute_portal/scripts/render-migration.sql"

# Public schema tables we need
PUBLIC_TABLES = [
    "agencies", "categories", "images", "org_invites",
    "profiles", "quotations", "rfq_invites", "rfqs", "suppliers"
]

# Public schema enums we need
PUBLIC_ENUMS = [
    "invite_status", "org_invite_type", "org_status", "org_type",
    "quotation_status", "rfq_status", "user_role"
]

def main():
    with open(INPUT_FILE, 'r') as f:
        content = f.read()

    output = []

    # Header
    output.append("-- Render Postgres Migration Script")
    output.append("-- Generated from Supabase backup")
    output.append("-- For Event Quote Portal migration")
    output.append("")

    # Enable UUID extension
    output.append("-- Enable UUID extension")
    output.append('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    output.append("")

    # Extract and add enums
    output.append("-- Public Schema Enums")
    for enum_name in PUBLIC_ENUMS:
        # Find CREATE TYPE statement
        pattern = rf"CREATE TYPE public\.{enum_name} AS ENUM \([^)]+\);"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            output.append(match.group(0))
            output.append("")

    output.append("")

    # Extract and add tables
    output.append("-- Public Schema Tables")
    for table in PUBLIC_TABLES:
        # Find CREATE TABLE statement
        pattern = rf"CREATE TABLE public\.{table} \([^;]+\);"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            output.append(match.group(0))
            output.append("")

    output.append("")

    # Extract and add data
    output.append("-- Public Schema Data")
    for table in PUBLIC_TABLES:
        # Find COPY statement and data
        pattern = rf"(COPY public\.{table} \([^)]+\) FROM stdin;[\s\S]*?\\\.)"
        match = re.search(pattern, content)
        if match:
            output.append(f"-- Data for {table}")
            output.append(match.group(1))
            output.append("")

    output.append("")

    # Add drizzle schema and migrations tracking
    output.append("-- Drizzle Migrations Tracking")
    output.append("CREATE SCHEMA IF NOT EXISTS drizzle;")
    output.append("")

    # Extract drizzle migrations table
    pattern = r"CREATE TABLE drizzle\.__drizzle_migrations \([^;]+\);"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        output.append(match.group(0))
        output.append("")

    # Extract drizzle migrations data
    pattern = r"(COPY drizzle\.__drizzle_migrations \([^)]+\) FROM stdin;[\s\S]*?\\\.)"
    match = re.search(pattern, content)
    if match:
        output.append(match.group(1))
        output.append("")

    output.append("")

    # Extract primary key constraints
    output.append("-- Primary Key Constraints")
    for table in PUBLIC_TABLES:
        pattern = rf"ALTER TABLE ONLY public\.{table}\s+ADD CONSTRAINT [^;]+PRIMARY KEY[^;]+;"
        match = re.search(pattern, content)
        if match:
            output.append(match.group(0))
    output.append("")

    # Extract foreign key constraints
    output.append("-- Foreign Key Constraints")
    for table in PUBLIC_TABLES:
        pattern = rf"ALTER TABLE ONLY public\.{table}\s+ADD CONSTRAINT [^;]+FOREIGN KEY[^;]+;"
        for match in re.finditer(pattern, content):
            output.append(match.group(0))
    output.append("")

    # Write output
    with open(OUTPUT_FILE, 'w') as f:
        f.write('\n'.join(output))

    print(f"Migration script created: {OUTPUT_FILE}")
    print(f"Total lines: {len(output)}")

if __name__ == "__main__":
    main()
