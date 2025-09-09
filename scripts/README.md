# Database Seeding Scripts

This directory contains scripts to populate your event quote portal with realistic test data for South African corporate events and marketing activations.

## Overview

The seeding scripts will populate your database with:

- **Categories**: 70+ event and marketing categories relevant to corporate events
- **Agencies**: 5 realistic South African event agencies
- **Suppliers**: 20+ suppliers across various service categories

All data is specifically tailored for the South African market and focuses on corporate events, brand activations, and marketing activations (no wedding-related content).

## Quick Start

### Prerequisites

1. Make sure your Supabase project is set up and running
2. Ensure you have the required environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Running the Seed Script

```bash
# Using npm script (recommended)
npm run db:seed

# Or directly with node
node scripts/seed-database.js
```

### Manual SQL Execution

If you prefer to run the SQL directly in Supabase:

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `seed-test-data.sql`
4. Execute the script

## What Gets Seeded

### Categories (70+ categories)

**Event Planning & Management**
- Corporate Event Planning
- Conference Management
- Exhibition Management
- Product Launch Events
- Brand Activation Events
- Trade Show Management
- Corporate Gala Events
- Awards Ceremonies

**Audio Visual & Technology**
- Audio Visual Equipment
- Live Streaming Services
- Event Photography
- Event Videography
- LED Screens & Displays
- Sound Systems
- Lighting Design
- Virtual Event Technology
- Interactive Technology
- Projection Mapping

**Catering & Food Services**
- Corporate Catering
- Beverage Services
- Food Trucks
- Coffee Services
- Cocktail Services
- Fine Dining Catering
- Buffet Services
- Canapé Services

**Marketing & Brand Activation**
- Brand Activation
- Digital Marketing
- Event Marketing
- Public Relations
- Content Creation
- Social Media Management
- Influencer Marketing
- Experiential Marketing
- Guerrilla Marketing
- Product Sampling

And many more categories covering venues, entertainment, decor, logistics, and specialized services.

### Agencies (5 agencies)

1. **Creative Events SA** (Johannesburg) - Brand activations, product launches
2. **Premier Event Solutions** (Cape Town) - Exhibitions, trade shows
3. **Dynamic Marketing Events** (Durban) - Experiential marketing
4. **Elite Corporate Events** (Pretoria) - Corporate events, conferences
5. **Innovation Event Group** (Johannesburg) - Technology-driven events

### Suppliers (20+ suppliers)

**Audio Visual & Technology**
- ProSound AV Solutions
- Visual Impact Technologies
- Crystal Clear Sound

**Catering & Food Services**
- Gourmet Corporate Catering
- Urban Food Trucks
- Premium Bar Services

**Venues & Facilities**
- Grand Convention Centre
- Cape Town Event Hub
- Industrial Event Space

**Entertainment & Activities**
- Corporate Entertainment Group
- Team Building Adventures

**Marketing & Brand Activation**
- Brand Activation Specialists
- Digital Event Marketing

**Decor & Styling**
- Elite Event Decor
- Stage Design Solutions

**Logistics & Support**
- Secure Event Solutions
- Event Staffing Solutions
- Premium Transportation

**Photography & Videography**
- Corporate Media Productions
- Live Stream Solutions

## Image Integration

All suppliers and agencies use Unsplash images as placeholders. The system supports:

- **Logo URLs**: Professional business images
- **Brochure URLs**: Service showcase images
- **ID Images**: Contact person photos
- **Gallery Images**: Can be added via the image gallery component

The image system has been enhanced to support both:
- Local file uploads (stored in Supabase Storage)
- External URLs (like Unsplash images)

## Data Characteristics

### South African Focus
- All locations use South African cities and provinces
- Phone numbers follow South African format (+27)
- Email addresses use .co.za domain
- Business names reflect South African naming conventions

### Corporate Event Focus
- No wedding-related categories or services
- Emphasis on brand activations, product launches, corporate conferences
- Services tailored for B2B events and marketing activations
- References to major brands like Netflix, DSTV, Heineken

### Realistic Business Data
- Professional contact names and emails
- Realistic service descriptions
- Appropriate service categories for each supplier
- Published status set to true for immediate visibility

## Customization

You can modify the seed data by editing:

- `scripts/seed-database.js` - For the Node.js script
- `scripts/seed-test-data.sql` - For the SQL script

### Adding More Data

To add more suppliers or agencies:

1. Edit the respective arrays in `seed-database.js`
2. Follow the existing data structure
3. Use appropriate Unsplash image URLs
4. Ensure South African relevance

### Image URLs

All images use Unsplash with specific parameters:
- `w=400&h=400` for logos
- `w=800&h=600` for brochures
- `fit=crop&crop=center` for consistent cropping

## Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   - Ensure `.env.local` exists with required Supabase credentials
   - Check that `SUPABASE_SERVICE_ROLE_KEY` has admin privileges

2. **Database Connection Issues**
   - Verify Supabase project is active
   - Check network connectivity
   - Ensure database tables exist (run migrations first)

3. **Duplicate Data**
   - The script uses `upsert` with conflict resolution
   - Duplicate emails will be ignored
   - Categories with duplicate names will be skipped

### Verification

After seeding, verify the data:

1. Check Supabase dashboard for record counts
2. Browse categories, agencies, and suppliers in your app
3. Test image loading and display
4. Verify search and filtering functionality

## Support

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your Supabase project configuration
3. Ensure all required environment variables are set
4. Check that database migrations have been applied

The seed data provides a solid foundation for testing and development of your event quote portal with realistic South African corporate event data.
