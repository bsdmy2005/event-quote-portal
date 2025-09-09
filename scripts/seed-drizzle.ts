#!/usr/bin/env tsx

/**
 * Drizzle ORM Database Seeding Script
 * 
 * This script populates the database with test data for South African
 * corporate events and marketing activations using Drizzle ORM.
 * 
 * Usage: npx tsx scripts/seed-drizzle.ts
 */

import { config } from "dotenv";
import { db } from "../db/db";
import { 
  categoriesTable, 
  agenciesTable, 
  suppliersTable,
  type InsertCategory,
  type InsertAgency,
  type InsertSupplier
} from "../db/schema";

// Load environment variables
config({ path: ".env.local" });

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
    logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
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
    logoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    brochureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop&crop=center',
    idImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    serviceCategories: ['Live Streaming Services', 'Virtual Event Technology', 'Event Videography', 'Interactive Technology'],
    servicesText: 'Professional live streaming and virtual event technology services. We provide high-quality live streaming solutions for corporate events, conferences, and hybrid events.',
    isPublished: true,
    status: 'active'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting Drizzle ORM database seeding...\n');

  try {
    // 1. Seed Categories
    console.log('📋 Seeding categories...');
    const insertedCategories = await db.insert(categoriesTable)
      .values(categories)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Seeded ${insertedCategories.length} categories\n`);

    // 2. Seed Agencies
    console.log('🏢 Seeding agencies...');
    const insertedAgencies = await db.insert(agenciesTable)
      .values(agencies)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Seeded ${insertedAgencies.length} agencies\n`);

    // 3. Seed Suppliers
    console.log('🔧 Seeding suppliers...');
    const insertedSuppliers = await db.insert(suppliersTable)
      .values(suppliers)
      .onConflictDoNothing()
      .returning();
    console.log(`✅ Seeded ${insertedSuppliers.length} suppliers\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   • Categories: ${insertedCategories.length}`);
    console.log(`   • Agencies: ${insertedAgencies.length}`);
    console.log(`   • Suppliers: ${insertedSuppliers.length}`);
    console.log(`\n🚀 Your event quote portal is now populated with realistic South African test data!`);

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
