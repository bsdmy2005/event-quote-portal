#!/usr/bin/env tsx

/**
 * Database Cleanup Script
 * 
 * This script clears all existing data from the database tables.
 * 
 * Usage: npx tsx scripts/clear-database.ts
 */

import { config } from "dotenv";
import { db } from "../db/db";
import { 
  categoriesTable, 
  agenciesTable, 
  suppliersTable,
  imagesTable
} from "../db/schema";

// Load environment variables
config({ path: ".env.local" });

async function clearDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Clear in reverse order to respect foreign key constraints
    console.log('🗑️  Clearing images...');
    await db.delete(imagesTable);
    console.log('✅ Images cleared\n');

    console.log('🗑️  Clearing suppliers...');
    await db.delete(suppliersTable);
    console.log('✅ Suppliers cleared\n');

    console.log('🗑️  Clearing agencies...');
    await db.delete(agenciesTable);
    console.log('✅ Agencies cleared\n');

    console.log('🗑️  Clearing categories...');
    await db.delete(categoriesTable);
    console.log('✅ Categories cleared\n');

    console.log('🎉 Database cleanup completed successfully!');
    console.log('📊 All tables have been cleared and are ready for fresh data.');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
if (require.main === module) {
  clearDatabase();
}

export { clearDatabase };
