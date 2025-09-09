#!/usr/bin/env tsx

/**
 * Enhanced Database Seeding Script with Unsplash API
 * 
 * This script populates the database with test data using real Unsplash images
 * for South African corporate events and marketing activations.
 * 
 * Usage: npx tsx scripts/seed-with-unsplash.ts
 */

import { config } from "dotenv";
import { db } from "../db/db";
import { 
  categoriesTable, 
  agenciesTable, 
  suppliersTable,
  imagesTable,
  type InsertCategory,
  type InsertAgency,
  type InsertSupplier,
  type NewImage
} from "../db/schema";

// Load environment variables
config({ path: ".env.local" });

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

if (!UNSPLASH_ACCESS_KEY) {
  console.error('❌ Missing UNSPLASH_ACCESS_KEY in environment variables');
  process.exit(1);
}

// Image search keywords for different service categories
const IMAGE_KEYWORDS = {
  'Audio Visual Equipment': ['sound system', 'audio equipment', 'microphone'],
  'Sound Systems': ['sound system', 'speakers', 'audio equipment'],
  'LED Screens & Displays': ['led screen', 'digital display', 'video wall'],
  'Lighting Design': ['event lighting', 'stage lighting', 'lighting equipment'],
  'Live Streaming Services': ['live streaming', 'video production', 'broadcasting'],
  'Event Photography': ['event photography', 'corporate photography', 'camera'],
  'Event Videography': ['video production', 'camera equipment', 'filming'],
  'Virtual Event Technology': ['virtual event', 'video conference', 'online meeting'],
  'Interactive Technology': ['interactive display', 'touch screen', 'digital technology'],
  'Projection Mapping': ['projection mapping', '3d projection', 'visual effects'],
  
  'Corporate Catering': ['corporate catering', 'business lunch', 'professional food'],
  'Fine Dining Catering': ['fine dining', 'elegant food', 'gourmet catering'],
  'Beverage Services': ['bar service', 'cocktails', 'beverage station'],
  'Food Trucks': ['food truck', 'mobile catering', 'street food'],
  'Coffee Services': ['coffee service', 'coffee station', 'professional coffee'],
  'Cocktail Services': ['cocktail bar', 'mixology', 'drinks service'],
  
  'Conference Centers': ['conference room', 'meeting room', 'business conference'],
  'Exhibition Halls': ['exhibition hall', 'trade show', 'convention center'],
  'Corporate Event Venues': ['corporate event', 'business venue', 'event space'],
  'Convention Centers': ['convention center', 'large venue', 'conference facility'],
  'Rooftop Venues': ['rooftop venue', 'city view', 'outdoor event space'],
  'Industrial Venues': ['industrial space', 'warehouse venue', 'modern venue'],
  
  'Corporate Entertainment': ['corporate entertainment', 'business event', 'professional entertainment'],
  'Live Music': ['live music', 'band performance', 'musical entertainment'],
  'Team Building Activities': ['team building', 'corporate team', 'group activities'],
  'MC Services': ['event host', 'master of ceremonies', 'event presenter'],
  'Performance Artists': ['performance art', 'entertainment', 'live performance'],
  
  'Brand Activation': ['brand activation', 'marketing event', 'brand experience'],
  'Digital Marketing': ['digital marketing', 'social media', 'online marketing'],
  'Event Marketing': ['event marketing', 'promotional event', 'marketing campaign'],
  'Experiential Marketing': ['experiential marketing', 'brand experience', 'interactive marketing'],
  'Product Sampling': ['product sampling', 'brand promotion', 'product demonstration'],
  
  'Event Decor': ['event decoration', 'venue styling', 'event design'],
  'Floral Design': ['floral arrangement', 'event flowers', 'decorative flowers'],
  'Furniture Rental': ['event furniture', 'venue furniture', 'rental furniture'],
  'Stage Design': ['stage design', 'event stage', 'performance stage'],
  'Exhibition Stands': ['exhibition stand', 'trade show booth', 'display stand'],
  
  'Event Security': ['event security', 'security personnel', 'crowd control'],
  'Transportation Services': ['corporate transportation', 'executive car', 'event transport'],
  'Event Staffing': ['event staff', 'professional staff', 'event personnel'],
  'Logistics Coordination': ['event logistics', 'coordination', 'event management'],
  
  'Sustainability Services': ['sustainable event', 'eco-friendly', 'green event'],
  'Accessibility Services': ['accessibility', 'inclusive event', 'accessibility services'],
  'Language Services': ['translation services', 'interpreter', 'language support'],
  'Legal Services': ['legal services', 'business law', 'corporate legal'],
  'Financial Services': ['financial services', 'business finance', 'corporate finance'],
  'Risk Management': ['risk management', 'safety management', 'event safety'],
  'Health & Safety Services': ['health safety', 'event safety', 'safety services']
};

// Fallback keywords for general categories
const FALLBACK_KEYWORDS = {
  'agency': ['corporate office', 'business meeting', 'professional team'],
  'supplier': ['professional service', 'business equipment', 'corporate service']
};

async function searchUnsplashImages(query: string, count: number = 1): Promise<string[]> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results.map((photo: any) => photo.urls.regular);
  } catch (error) {
    console.warn(`⚠️  Failed to fetch images for "${query}":`, error);
    return [];
  }
}

async function getImagesForCategories(categories: string[], type: 'supplier' | 'agency'): Promise<string[]> {
  const images: string[] = [];
  
  if (type === 'agency') {
    // For agencies, use general business/corporate images
    const businessImages = await searchUnsplashImages('corporate office business meeting', 1);
    images.push(...businessImages);
  } else {
    // For suppliers, get relevant images based on their service categories
    for (const category of categories.slice(0, 3)) { // Limit to first 3 categories
      const keywords = IMAGE_KEYWORDS[category] || FALLBACK_KEYWORDS.supplier;
      const categoryImages = await searchUnsplashImages(keywords[0], 1);
      images.push(...categoryImages);
      
      // Add a small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return images.filter(Boolean); // Remove any empty results
}

// Test data
const categories: InsertCategory[] = [
  // Event Planning & Management
  { name: 'Corporate Event Planning' },
  { name: 'Conference Management' },
  { name: 'Exhibition Management' },
  { name: 'Product Launch Events' },
  { name: 'Brand Activation Events' },
  { name: 'Trade Show Management' },
  { name: 'Corporate Gala Events' },
  { name: 'Awards Ceremonies' },

  // Venues & Facilities
  { name: 'Corporate Event Venues' },
  { name: 'Conference Centers' },
  { name: 'Exhibition Halls' },
  { name: 'Outdoor Corporate Venues' },
  { name: 'Hotels & Resorts' },
  { name: 'Convention Centers' },
  { name: 'Rooftop Venues' },
  { name: 'Industrial Venues' },

  // Audio Visual & Technology
  { name: 'Audio Visual Equipment' },
  { name: 'Live Streaming Services' },
  { name: 'Event Photography' },
  { name: 'Event Videography' },
  { name: 'LED Screens & Displays' },
  { name: 'Sound Systems' },
  { name: 'Lighting Design' },
  { name: 'Virtual Event Technology' },
  { name: 'Interactive Technology' },
  { name: 'Projection Mapping' },

  // Catering & Food Services
  { name: 'Corporate Catering' },
  { name: 'Beverage Services' },
  { name: 'Food Trucks' },
  { name: 'Coffee Services' },
  { name: 'Cocktail Services' },
  { name: 'Fine Dining Catering' },
  { name: 'Buffet Services' },
  { name: 'Canapé Services' },

  // Entertainment & Activities
  { name: 'Live Music' },
  { name: 'Corporate Entertainment' },
  { name: 'Team Building Activities' },
  { name: 'Cultural Entertainment' },
  { name: 'MC Services' },
  { name: 'Speaker Services' },
  { name: 'Performance Artists' },
  { name: 'Interactive Entertainment' },

  // Marketing & Brand Activation
  { name: 'Brand Activation' },
  { name: 'Digital Marketing' },
  { name: 'Event Marketing' },
  { name: 'Public Relations' },
  { name: 'Content Creation' },
  { name: 'Social Media Management' },
  { name: 'Influencer Marketing' },
  { name: 'Experiential Marketing' },
  { name: 'Guerrilla Marketing' },
  { name: 'Product Sampling' },

  // Decor & Styling
  { name: 'Event Decor' },
  { name: 'Floral Design' },
  { name: 'Lighting Design' },
  { name: 'Furniture Rental' },
  { name: 'Themed Events' },
  { name: 'Stage Design' },
  { name: 'Exhibition Stands' },
  { name: 'Branded Environments' },
  { name: 'Wayfinding Design' },

  // Logistics & Support
  { name: 'Event Security' },
  { name: 'Transportation Services' },
  { name: 'Event Staffing' },
  { name: 'Waste Management' },
  { name: 'Insurance Services' },
  { name: 'Event Management' },
  { name: 'Logistics Coordination' },
  { name: 'Crowd Management' },

  // Specialized Services
  { name: 'Sustainability Services' },
  { name: 'Accessibility Services' },
  { name: 'Language Services' },
  { name: 'Legal Services' },
  { name: 'Financial Services' },
  { name: 'Risk Management' },
  { name: 'Compliance Services' },
  { name: 'Health & Safety Services' }
];

const agencies: InsertAgency[] = [
  {
    name: 'Creative Events SA',
    contactName: 'Sarah Mitchell',
    email: 'sarah@creativeeventssa.co.za',
    phone: '+27 11 234 5678',
    logoUrl: '', // Will be populated with Unsplash image
    website: 'https://www.creativeeventssa.co.za',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    interestCategories: ['Corporate Event Planning', 'Brand Activation Events', 'Product Launch Events', 'Conference Management', 'Awards Ceremonies'],
    about: 'Creative Events SA is a leading corporate event management company specializing in brand activations, product launches, and corporate conferences. We have worked with major brands including Netflix, DSTV, and Heineken to create memorable experiences that drive engagement and brand awareness.',
    status: 'active'
  },
  {
    name: 'Premier Event Solutions',
    contactName: 'David Nkomo',
    email: 'david@premiereventsolutions.co.za',
    phone: '+27 21 345 6789',
    logoUrl: '', // Will be populated with Unsplash image
    website: 'https://www.premiereventsolutions.co.za',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    interestCategories: ['Exhibition Management', 'Trade Show Management', 'Corporate Gala Events', 'Conference Management', 'Brand Activation Events'],
    about: 'Premier Event Solutions delivers world-class corporate events and exhibitions across South Africa. Our expertise spans trade shows, corporate galas, and brand activations, with a focus on creating impactful experiences for our clients.',
    status: 'active'
  },
  {
    name: 'Dynamic Marketing Events',
    contactName: 'Thabo Mthembu',
    email: 'thabo@dynamicmarketingevents.co.za',
    phone: '+27 31 456 7890',
    logoUrl: '', // Will be populated with Unsplash image
    website: 'https://www.dynamicmarketingevents.co.za',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    interestCategories: ['Brand Activation Events', 'Experiential Marketing', 'Product Launch Events', 'Digital Marketing', 'Event Marketing'],
    about: 'Dynamic Marketing Events specializes in experiential marketing and brand activations that create lasting impressions. We combine creativity with strategic thinking to deliver events that resonate with target audiences and drive business results.',
    status: 'active'
  },
  {
    name: 'Elite Corporate Events',
    contactName: 'Jennifer van der Merwe',
    email: 'jennifer@elitecorporateevents.co.za',
    phone: '+27 12 567 8901',
    logoUrl: '', // Will be populated with Unsplash image
    website: 'https://www.elitecorporateevents.co.za',
    location: { city: 'Pretoria', province: 'Gauteng', country: 'South Africa' },
    interestCategories: ['Corporate Event Planning', 'Conference Management', 'Awards Ceremonies', 'Corporate Gala Events', 'Event Management'],
    about: 'Elite Corporate Events is a premium event management company serving corporate clients across South Africa. We excel in delivering sophisticated corporate events, conferences, and awards ceremonies that reflect our clients\' brand values and objectives.',
    status: 'active'
  },
  {
    name: 'Innovation Event Group',
    contactName: 'Mandla Khumalo',
    email: 'mandla@innovationeventgroup.co.za',
    phone: '+27 11 678 9012',
    logoUrl: '', // Will be populated with Unsplash image
    website: 'https://www.innovationeventgroup.co.za',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    interestCategories: ['Product Launch Events', 'Brand Activation Events', 'Interactive Technology', 'Virtual Event Technology', 'Experiential Marketing'],
    about: 'Innovation Event Group is at the forefront of event technology and innovation. We specialize in cutting-edge product launches, brand activations, and immersive experiences that leverage the latest technology to create unforgettable moments.',
    status: 'active'
  }
];

const suppliers: InsertSupplier[] = [
  // Audio Visual & Technology Suppliers
  {
    name: 'ProSound AV Solutions',
    contactName: 'Mike Johnson',
    email: 'mike@prosoundav.co.za',
    phone: '+27 11 123 4567',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    serviceCategories: ['Audio Visual Equipment', 'Sound Systems', 'LED Screens & Displays', 'Lighting Design', 'Live Streaming Services'],
    servicesText: 'Professional audio visual equipment rental and technical support for corporate events, conferences, and brand activations. We provide state-of-the-art sound systems, LED displays, lighting solutions, and live streaming services.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Visual Impact Technologies',
    contactName: 'Lisa Chen',
    email: 'lisa@visualimpacttech.co.za',
    phone: '+27 21 234 5678',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['LED Screens & Displays', 'Projection Mapping', 'Interactive Technology', 'Virtual Event Technology', 'Audio Visual Equipment'],
    servicesText: 'Cutting-edge visual technology solutions including LED screens, projection mapping, and interactive displays. We specialize in creating immersive visual experiences for corporate events and brand activations.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Crystal Clear Sound',
    contactName: 'Peter van Zyl',
    email: 'peter@crystalclearsound.co.za',
    phone: '+27 31 345 6789',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    serviceCategories: ['Sound Systems', 'Audio Visual Equipment', 'Live Streaming Services', 'Lighting Design'],
    servicesText: 'Premium sound system rental and audio engineering services for corporate events, conferences, and live streaming. Our team ensures crystal clear audio quality for all your event needs.',
    isPublished: true,
    status: 'active'
  },

  // Catering & Food Services
  {
    name: 'Gourmet Corporate Catering',
    contactName: 'Chef Maria Santos',
    email: 'maria@gourmetcorporate.co.za',
    phone: '+27 11 456 7890',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    serviceCategories: ['Corporate Catering', 'Fine Dining Catering', 'Canapé Services', 'Beverage Services', 'Coffee Services'],
    servicesText: 'Exquisite corporate catering services specializing in fine dining, canapés, and premium beverage services. We cater to high-profile corporate events, conferences, and brand activations across South Africa.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Urban Food Trucks',
    contactName: 'James Mthembu',
    email: 'james@urbanfoodtrucks.co.za',
    phone: '+27 21 567 8901',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['Food Trucks', 'Corporate Catering', 'Buffet Services', 'Beverage Services'],
    servicesText: 'Modern food truck services for corporate events and brand activations. We offer diverse cuisine options and can provide multiple trucks for large-scale events and activations.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Premium Bar Services',
    contactName: 'Sarah Williams',
    email: 'sarah@premiumbarservices.co.za',
    phone: '+27 31 678 9012',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    serviceCategories: ['Beverage Services', 'Cocktail Services', 'Corporate Catering', 'Coffee Services'],
    servicesText: 'Professional bar and beverage services for corporate events, including cocktail bars, coffee stations, and premium beverage management. We ensure exceptional service and quality drinks.',
    isPublished: true,
    status: 'active'
  },

  // Venues & Facilities
  {
    name: 'Grand Convention Centre',
    contactName: 'Robert Smith',
    email: 'robert@grandconvention.co.za',
    phone: '+27 11 789 0123',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    serviceCategories: ['Conference Centers', 'Exhibition Halls', 'Corporate Event Venues', 'Convention Centers'],
    servicesText: 'Premier convention and conference center in Johannesburg, offering state-of-the-art facilities for corporate events, exhibitions, and conferences. Capacity for up to 2000 delegates.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Cape Town Event Hub',
    contactName: 'Amanda Botha',
    email: 'amanda@capetowneventhub.co.za',
    phone: '+27 21 890 1234',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['Corporate Event Venues', 'Rooftop Venues', 'Outdoor Corporate Venues', 'Hotels & Resorts'],
    servicesText: 'Versatile event venue in Cape Town offering indoor and outdoor spaces, including a stunning rooftop venue with panoramic views. Perfect for corporate events, product launches, and brand activations.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Industrial Event Space',
    contactName: 'Thabo Nkosi',
    email: 'thabo@industrialeventspace.co.za',
    phone: '+27 31 901 2345',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    serviceCategories: ['Industrial Venues', 'Exhibition Halls', 'Corporate Event Venues', 'Outdoor Corporate Venues'],
    servicesText: 'Unique industrial event space perfect for large-scale brand activations, product launches, and corporate events. Features high ceilings, open spaces, and modern amenities.',
    isPublished: true,
    status: 'active'
  },

  // Entertainment & Activities
  {
    name: 'Corporate Entertainment Group',
    contactName: 'Zanele Mthembu',
    email: 'zanele@corporateentertainment.co.za',
    phone: '+27 11 012 3456',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    serviceCategories: ['Corporate Entertainment', 'Live Music', 'MC Services', 'Performance Artists', 'Interactive Entertainment'],
    servicesText: 'Professional entertainment services for corporate events, including live music, MCs, performance artists, and interactive entertainment. We provide entertainment that aligns with your brand and event objectives.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Team Building Adventures',
    contactName: 'Mark Johnson',
    email: 'mark@teambuildingadventures.co.za',
    phone: '+27 21 123 4567',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['Team Building Activities', 'Corporate Entertainment', 'Interactive Entertainment', 'Cultural Entertainment'],
    servicesText: 'Specialized team building activities and corporate entertainment designed to enhance team cohesion and engagement. We offer both indoor and outdoor activities suitable for corporate events.',
    isPublished: true,
    status: 'active'
  },

  // Marketing & Brand Activation
  {
    name: 'Brand Activation Specialists',
    contactName: 'Nomsa Dlamini',
    email: 'nomsa@brandactivationspecialists.co.za',
    phone: '+27 31 234 5678',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    serviceCategories: ['Brand Activation', 'Experiential Marketing', 'Product Sampling', 'Guerrilla Marketing', 'Event Marketing'],
    servicesText: 'Specialized brand activation and experiential marketing services. We create immersive brand experiences that drive engagement and deliver measurable results for corporate clients.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Digital Event Marketing',
    contactName: 'Kevin O\'Connor',
    email: 'kevin@digitaleventmarketing.co.za',
    phone: '+27 11 345 6789',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    serviceCategories: ['Digital Marketing', 'Event Marketing', 'Social Media Management', 'Content Creation', 'Influencer Marketing'],
    servicesText: 'Digital marketing services specifically tailored for events and brand activations. We provide social media management, content creation, and influencer marketing to maximize event reach and engagement.',
    isPublished: true,
    status: 'active'
  },

  // Decor & Styling
  {
    name: 'Elite Event Decor',
    contactName: 'Grace Mokoena',
    email: 'grace@eliteeventdecor.co.za',
    phone: '+27 21 456 7890',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['Event Decor', 'Floral Design', 'Lighting Design', 'Furniture Rental', 'Themed Events'],
    servicesText: 'Premium event decoration and styling services for corporate events. We specialize in creating sophisticated, branded environments that reflect your company\'s image and event objectives.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Stage Design Solutions',
    contactName: 'Andre van der Berg',
    email: 'andre@stagedesignsolutions.co.za',
    phone: '+27 31 567 8901',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    serviceCategories: ['Stage Design', 'Exhibition Stands', 'Branded Environments', 'Wayfinding Design', 'Lighting Design'],
    servicesText: 'Professional stage design and exhibition stand solutions for corporate events, conferences, and brand activations. We create impactful visual environments that enhance your event experience.',
    isPublished: true,
    status: 'active'
  },

  // Logistics & Support
  {
    name: 'Secure Event Solutions',
    contactName: 'Captain John Pretorius',
    email: 'john@secureeventsolutions.co.za',
    phone: '+27 11 678 9012',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    serviceCategories: ['Event Security', 'Crowd Management', 'Risk Management', 'Health & Safety Services'],
    servicesText: 'Professional security services for corporate events, including crowd management, risk assessment, and health & safety compliance. We ensure safe and secure events for all attendees.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Event Staffing Solutions',
    contactName: 'Patricia Ndlovu',
    email: 'patricia@eventstaffingsolutions.co.za',
    phone: '+27 21 789 0123',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['Event Staffing', 'Logistics Coordination', 'Event Management', 'Crowd Management'],
    servicesText: 'Professional event staffing and logistics coordination services. We provide trained, professional staff for corporate events, conferences, and brand activations across South Africa.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Premium Transportation',
    contactName: 'Sipho Mthembu',
    email: 'sipho@premiumtransportation.co.za',
    phone: '+27 31 890 1234',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    serviceCategories: ['Transportation Services', 'Logistics Coordination', 'Event Management'],
    servicesText: 'Premium transportation services for corporate events, including executive vehicles, shuttle services, and logistics coordination. We ensure reliable and comfortable transportation for your event attendees.',
    isPublished: true,
    status: 'active'
  },

  // Photography & Videography
  {
    name: 'Corporate Media Productions',
    contactName: 'Alex Thompson',
    email: 'alex@corporatemediaproductions.co.za',
    phone: '+27 11 901 2345',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    serviceCategories: ['Event Photography', 'Event Videography', 'Content Creation', 'Live Streaming Services'],
    servicesText: 'Professional event photography and videography services for corporate events, conferences, and brand activations. We capture high-quality content for marketing and documentation purposes.',
    isPublished: true,
    status: 'active'
  },
  {
    name: 'Live Stream Solutions',
    contactName: 'Rachel Green',
    email: 'rachel@livestreamsolutions.co.za',
    phone: '+27 21 012 3456',
    logoUrl: '', // Will be populated with Unsplash image
    brochureUrl: '', // Will be populated with Unsplash image
    idImageUrl: '', // Will be populated with Unsplash image
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['Live Streaming Services', 'Virtual Event Technology', 'Event Videography', 'Interactive Technology'],
    servicesText: 'Professional live streaming and virtual event technology services. We provide high-quality live streaming solutions for corporate events, conferences, and hybrid events.',
    isPublished: true,
    status: 'active'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting enhanced database seeding with Unsplash images...\n');

  try {
    // 1. Seed Categories
    console.log('📋 Seeding categories...');
    const insertedCategories = await db.insert(categoriesTable)
      .values(categories)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Seeded ${insertedCategories.length} categories\n`);

    // 2. Seed Agencies with images
    console.log('🏢 Seeding agencies with images...');
    const agenciesWithImages = [];
    
    for (const agency of agencies) {
      console.log(`   📸 Fetching images for ${agency.name}...`);
      const images = await getImagesForCategories(agency.interestCategories, 'agency');
      
      if (images.length > 0) {
        agency.logoUrl = images[0];
      }
      
      agenciesWithImages.push(agency);
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const insertedAgencies = await db.insert(agenciesTable)
      .values(agenciesWithImages)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Seeded ${insertedAgencies.length} agencies with images\n`);

    // 3. Seed Suppliers with images
    console.log('🔧 Seeding suppliers with images...');
    const suppliersWithImages = [];
    
    for (const supplier of suppliers) {
      console.log(`   📸 Fetching images for ${supplier.name}...`);
      const images = await getImagesForCategories(supplier.serviceCategories, 'supplier');
      
      if (images.length > 0) {
        supplier.logoUrl = images[0];
        if (images.length > 1) supplier.brochureUrl = images[1];
        if (images.length > 2) supplier.idImageUrl = images[2];
      }
      
      suppliersWithImages.push(supplier);
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    const insertedSuppliers = await db.insert(suppliersTable)
      .values(suppliersWithImages)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Seeded ${insertedSuppliers.length} suppliers with images\n`);

    console.log('🎉 Enhanced database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   • Categories: ${insertedCategories.length}`);
    console.log(`   • Agencies: ${insertedAgencies.length} (with professional images)`);
    console.log(`   • Suppliers: ${insertedSuppliers.length} (with relevant service images)`);
    console.log(`\n🚀 Your event quote portal now has realistic data with high-quality Unsplash images!`);

  } catch (error) {
    console.error('❌ Unexpected error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
