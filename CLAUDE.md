# Project Instructions for Claude

## Database Migrations (Drizzle ORM)

**IMPORTANT**: Always use `generate` + `migrate` workflow, never use `push`.

```bash
# Correct workflow:
npx drizzle-kit generate   # Generate migration files
npx drizzle-kit migrate    # Apply migrations

# DO NOT use:
npx drizzle-kit push       # This causes issues with existing constraints
```

### Why?
- The database was migrated from Supabase to Render
- Supabase added redundant CHECK constraints that conflict with `push`
- `generate` + `migrate` gives more control and avoids constraint conflicts

## Tech Stack
- Next.js with App Router
- Drizzle ORM with PostgreSQL (hosted on Render)
- Clerk for authentication
- Cloudflare R2 for file storage
- Postmark for email
