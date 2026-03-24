import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categoriesTable } from "../db/schema/categories-schema";

const client = postgres(process.env.DATABASE_URL!, { ssl: "require" });
const db = drizzle(client);

const CATEGORIES = [
  // Audio & Visual
  "Audio Visual Equipment",
  "LED Screens & Displays",
  "Lighting Design",
  "Live Streaming Services",
  "Projection Mapping",
  "Sound Systems",
  "Stage Design",

  // Catering & Beverage
  "Bar Services",
  "Beverage Services",
  "Catering",
  "Cocktail Services",
  "Coffee & Barista Services",
  "Fine Dining Catering",
  "Food Trucks",

  // Decor & Design
  "Branded Environments",
  "Event Decor",
  "Exhibition Stands",
  "Floral Design",
  "Furniture Rental",
  "Signage & Wayfinding",
  "Tents & Structures",

  // Entertainment
  "Corporate Entertainment",
  "Interactive Entertainment",
  "Live Music",
  "MC & Hosting Services",
  "Performance Artists",
  "Speaker & Keynote Services",
  "Team Building Activities",

  // Event Types & Management
  "Awards Ceremonies",
  "Brand Activation",
  "Conference Management",
  "Corporate Event Planning",
  "Exhibition Management",
  "Experiential Marketing",
  "Product Launch Events",
  "Themed Events",
  "Trade Show Management",

  // Marketing & Digital
  "Content Creation",
  "Digital Marketing",
  "Influencer Marketing",
  "Public Relations",
  "Social Media Management",

  // Photography & Video
  "Event Photography",
  "Event Videography",
  "Content Production",

  // Staffing & Operations
  "Crowd Management",
  "Event Staffing",
  "Health & Safety",
  "Logistics & Freight",
  "Security Services",
  "Transportation Services",
  "Waste Management",

  // Technology
  "Event Technology",
  "Interactive Technology",
  "Registration & Check-in Systems",
  "Virtual & Hybrid Event Platforms",

  // Venues
  "Conference Centres",
  "Convention Centres",
  "Hotels & Resorts",
  "Industrial Venues",
  "Outdoor Venues",
  "Rooftop Venues",
  "Unique Venues",

  // Professional Services
  "Accessibility Services",
  "Compliance & Regulatory",
  "Event Insurance",
  "Language & Translation Services",
  "Power & Electrical",
  "Printing & Production",
  "Sustainability Services",
].sort();

async function main() {
  console.log(`Seeding ${CATEGORIES.length} categories...`);

  const result = await db
    .insert(categoriesTable)
    .values(CATEGORIES.map((name) => ({ name })))
    .onConflictDoNothing({ target: categoriesTable.name })
    .returning();

  console.log(
    `Done. ${result.length} new categories inserted (${CATEGORIES.length - result.length} already existed).`
  );

  await client.end();
  process.exit(0);
}

main().catch((error) => {
  console.error("Failed to seed categories:", error);
  process.exit(1);
});
