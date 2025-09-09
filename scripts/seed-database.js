#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * This script populates the database with test data for South African
 * corporate events and marketing activations.
 * 
 * Usage: node scripts/seed-database.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test data
const categories = [
  // Event Planning & Management
  'Corporate Event Planning',
  'Conference Management',
  'Exhibition Management',
  'Product Launch Events',
  'Brand Activation Events',
  'Trade Show Management',
  'Corporate Gala Events',
  'Awards Ceremonies',

  // Venues & Facilities
  'Corporate Event Venues',
  'Conference Centers',
  'Exhibition Halls',
  'Outdoor Corporate Venues',
  'Hotels & Resorts',
  'Convention Centers',
  'Rooftop Venues',
  'Industrial Venues',

  // Audio Visual & Technology
  'Audio Visual Equipment',
  'Live Streaming Services',
  'Event Photography',
  'Event Videography',
  'LED Screens & Displays',
  'Sound Systems',
  'Lighting Design',
  'Virtual Event Technology',
  'Interactive Technology',
  'Projection Mapping',

  // Catering & Food Services
  'Corporate Catering',
  'Beverage Services',
  'Food Trucks',
  'Coffee Services',
  'Cocktail Services',
  'Fine Dining Catering',
  'Buffet Services',
  'Canapé Services',

  // Entertainment & Activities
  'Live Music',
  'Corporate Entertainment',
  'Team Building Activities',
  'Cultural Entertainment',
  'MC Services',
  'Speaker Services',
  'Performance Artists',
  'Interactive Entertainment',

  // Marketing & Brand Activation
  'Brand Activation',
  'Digital Marketing',
  'Event Marketing',
  'Public Relations',
  'Content Creation',
  'Social Media Management',
  'Influencer Marketing',
  'Experiential Marketing',
  'Guerrilla Marketing',
  'Product Sampling',

  // Decor & Styling
  'Event Decor',
  'Floral Design',
  'Lighting Design',
  'Furniture Rental',
  'Themed Events',
  'Stage Design',
  'Exhibition Stands',
  'Branded Environments',
  'Wayfinding Design',

  // Logistics & Support
  'Event Security',
  'Transportation Services',
  'Event Staffing',
  'Waste Management',
  'Insurance Services',
  'Event Management',
  'Logistics Coordination',
  'Crowd Management',

  // Specialized Services
  'Sustainability Services',
  'Accessibility Services',
  'Language Services',
  'Legal Services',
  'Financial Services',
  'Risk Management',
  'Compliance Services',
  'Health & Safety Services'
];

const agencies = [
  {
    name: 'Creative Events SA',
    contact_name: 'Sarah Mitchell',
    email: 'sarah@creativeeventssa.co.za',
    phone: '+27 11 234 5678',
    logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
    website: 'https://www.creativeeventssa.co.za',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    interest_categories: ['Corporate Event Planning', 'Brand Activation Events', 'Product Launch Events', 'Conference Management', 'Awards Ceremonies'],
    about: 'Creative Events SA is a leading corporate event management company specializing in brand activations, product launches, and corporate conferences. We have worked with major brands including Netflix, DSTV, and Heineken to create memorable experiences that drive engagement and brand awareness.',
    status: 'active'
  },
  {
    name: 'Premier Event Solutions',
    contact_name: 'David Nkomo',
    email: 'david@premiereventsolutions.co.za',
    phone: '+27 21 345 6789',
    logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    website: 'https://www.premiereventsolutions.co.za',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    interest_categories: ['Exhibition Management', 'Trade Show Management', 'Corporate Gala Events', 'Conference Management', 'Brand Activation Events'],
    about: 'Premier Event Solutions delivers world-class corporate events and exhibitions across South Africa. Our expertise spans trade shows, corporate galas, and brand activations, with a focus on creating impactful experiences for our clients.',
    status: 'active'
  },
  {
    name: 'Dynamic Marketing Events',
    contact_name: 'Thabo Mthembu',
    email: 'thabo@dynamicmarketingevents.co.za',
    phone: '+27 31 456 7890',
    logo_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop&crop=center',
    website: 'https://www.dynamicmarketingevents.co.za',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    interest_categories: ['Brand Activation Events', 'Experiential Marketing', 'Product Launch Events', 'Digital Marketing', 'Event Marketing'],
    about: 'Dynamic Marketing Events specializes in experiential marketing and brand activations that create lasting impressions. We combine creativity with strategic thinking to deliver events that resonate with target audiences and drive business results.',
    status: 'active'
  },
  {
    name: 'Elite Corporate Events',
    contact_name: 'Jennifer van der Merwe',
    email: 'jennifer@elitecorporateevents.co.za',
    phone: '+27 12 567 8901',
    logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    website: 'https://www.elitecorporateevents.co.za',
    location: { city: 'Pretoria', province: 'Gauteng', country: 'South Africa' },
    interest_categories: ['Corporate Event Planning', 'Conference Management', 'Awards Ceremonies', 'Corporate Gala Events', 'Event Management'],
    about: 'Elite Corporate Events is a premium event management company serving corporate clients across South Africa. We excel in delivering sophisticated corporate events, conferences, and awards ceremonies that reflect our clients\' brand values and objectives.',
    status: 'active'
  },
  {
    name: 'Innovation Event Group',
    contact_name: 'Mandla Khumalo',
    email: 'mandla@innovationeventgroup.co.za',
    phone: '+27 11 678 9012',
    logo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
    website: 'https://www.innovationeventgroup.co.za',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    interest_categories: ['Product Launch Events', 'Brand Activation Events', 'Interactive Technology', 'Virtual Event Technology', 'Experiential Marketing'],
    about: 'Innovation Event Group is at the forefront of event technology and innovation. We specialize in cutting-edge product launches, brand activations, and immersive experiences that leverage the latest technology to create unforgettable moments.',
    status: 'active'
  }
];

const suppliers = [
  // Audio Visual & Technology Suppliers
  {
    name: 'ProSound AV Solutions',
    contact_name: 'Mike Johnson',
    email: 'mike@prosoundav.co.za',
    phone: '+27 11 123 4567',
    logo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    service_categories: ['Audio Visual Equipment', 'Sound Systems', 'LED Screens & Displays', 'Lighting Design', 'Live Streaming Services'],
    services_text: 'Professional audio visual equipment rental and technical support for corporate events, conferences, and brand activations. We provide state-of-the-art sound systems, LED displays, lighting solutions, and live streaming services.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Visual Impact Technologies',
    contact_name: 'Lisa Chen',
    email: 'lisa@visualimpacttech.co.za',
    phone: '+27 21 234 5678',
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    service_categories: ['LED Screens & Displays', 'Projection Mapping', 'Interactive Technology', 'Virtual Event Technology', 'Audio Visual Equipment'],
    services_text: 'Cutting-edge visual technology solutions including LED screens, projection mapping, and interactive displays. We specialize in creating immersive visual experiences for corporate events and brand activations.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Crystal Clear Sound',
    contact_name: 'Peter van Zyl',
    email: 'peter@crystalclearsound.co.za',
    phone: '+27 31 345 6789',
    logo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    service_categories: ['Sound Systems', 'Audio Visual Equipment', 'Live Streaming Services', 'Lighting Design'],
    services_text: 'Premium sound system rental and audio engineering services for corporate events, conferences, and live streaming. Our team ensures crystal clear audio quality for all your event needs.',
    is_published: true,
    status: 'active'
  },

  // Catering & Food Services
  {
    name: 'Gourmet Corporate Catering',
    contact_name: 'Chef Maria Santos',
    email: 'maria@gourmetcorporate.co.za',
    phone: '+27 11 456 7890',
    logo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    service_categories: ['Corporate Catering', 'Fine Dining Catering', 'Canapé Services', 'Beverage Services', 'Coffee Services'],
    services_text: 'Exquisite corporate catering services specializing in fine dining, canapés, and premium beverage services. We cater to high-profile corporate events, conferences, and brand activations across South Africa.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Urban Food Trucks',
    contact_name: 'James Mthembu',
    email: 'james@urbanfoodtrucks.co.za',
    phone: '+27 21 567 8901',
    logo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    service_categories: ['Food Trucks', 'Corporate Catering', 'Buffet Services', 'Beverage Services'],
    services_text: 'Modern food truck services for corporate events and brand activations. We offer diverse cuisine options and can provide multiple trucks for large-scale events and activations.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Premium Bar Services',
    contact_name: 'Sarah Williams',
    email: 'sarah@premiumbarservices.co.za',
    phone: '+27 31 678 9012',
    logo_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    service_categories: ['Beverage Services', 'Cocktail Services', 'Corporate Catering', 'Coffee Services'],
    services_text: 'Professional bar and beverage services for corporate events, including cocktail bars, coffee stations, and premium beverage management. We ensure exceptional service and quality drinks.',
    is_published: true,
    status: 'active'
  },

  // Venues & Facilities
  {
    name: 'Grand Convention Centre',
    contact_name: 'Robert Smith',
    email: 'robert@grandconvention.co.za',
    phone: '+27 11 789 0123',
    logo_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    service_categories: ['Conference Centers', 'Exhibition Halls', 'Corporate Event Venues', 'Convention Centers'],
    services_text: 'Premier convention and conference center in Johannesburg, offering state-of-the-art facilities for corporate events, exhibitions, and conferences. Capacity for up to 2000 delegates.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Cape Town Event Hub',
    contact_name: 'Amanda Botha',
    email: 'amanda@capetowneventhub.co.za',
    phone: '+27 21 890 1234',
    logo_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    service_categories: ['Corporate Event Venues', 'Rooftop Venues', 'Outdoor Corporate Venues', 'Hotels & Resorts'],
    services_text: 'Versatile event venue in Cape Town offering indoor and outdoor spaces, including a stunning rooftop venue with panoramic views. Perfect for corporate events, product launches, and brand activations.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Industrial Event Space',
    contact_name: 'Thabo Nkosi',
    email: 'thabo@industrialeventspace.co.za',
    phone: '+27 31 901 2345',
    logo_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    service_categories: ['Industrial Venues', 'Exhibition Halls', 'Corporate Event Venues', 'Outdoor Corporate Venues'],
    services_text: 'Unique industrial event space perfect for large-scale brand activations, product launches, and corporate events. Features high ceilings, open spaces, and modern amenities.',
    is_published: true,
    status: 'active'
  },

  // Entertainment & Activities
  {
    name: 'Corporate Entertainment Group',
    contact_name: 'Zanele Mthembu',
    email: 'zanele@corporateentertainment.co.za',
    phone: '+27 11 012 3456',
    logo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    service_categories: ['Corporate Entertainment', 'Live Music', 'MC Services', 'Performance Artists', 'Interactive Entertainment'],
    services_text: 'Professional entertainment services for corporate events, including live music, MCs, performance artists, and interactive entertainment. We provide entertainment that aligns with your brand and event objectives.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Team Building Adventures',
    contact_name: 'Mark Johnson',
    email: 'mark@teambuildingadventures.co.za',
    phone: '+27 21 123 4567',
    logo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    service_categories: ['Team Building Activities', 'Corporate Entertainment', 'Interactive Entertainment', 'Cultural Entertainment'],
    services_text: 'Specialized team building activities and corporate entertainment designed to enhance team cohesion and engagement. We offer both indoor and outdoor activities suitable for corporate events.',
    is_published: true,
    status: 'active'
  },

  // Marketing & Brand Activation
  {
    name: 'Brand Activation Specialists',
    contact_name: 'Nomsa Dlamini',
    email: 'nomsa@brandactivationspecialists.co.za',
    phone: '+27 31 234 5678',
    logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    service_categories: ['Brand Activation', 'Experiential Marketing', 'Product Sampling', 'Guerrilla Marketing', 'Event Marketing'],
    services_text: 'Specialized brand activation and experiential marketing services. We create immersive brand experiences that drive engagement and deliver measurable results for corporate clients.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Digital Event Marketing',
    contact_name: 'Kevin O\'Connor',
    email: 'kevin@digitaleventmarketing.co.za',
    phone: '+27 11 345 6789',
    logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    service_categories: ['Digital Marketing', 'Event Marketing', 'Social Media Management', 'Content Creation', 'Influencer Marketing'],
    services_text: 'Digital marketing services specifically tailored for events and brand activations. We provide social media management, content creation, and influencer marketing to maximize event reach and engagement.',
    is_published: true,
    status: 'active'
  },

  // Decor & Styling
  {
    name: 'Elite Event Decor',
    contact_name: 'Grace Mokoena',
    email: 'grace@eliteeventdecor.co.za',
    phone: '+27 21 456 7890',
    logo_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    service_categories: ['Event Decor', 'Floral Design', 'Lighting Design', 'Furniture Rental', 'Themed Events'],
    services_text: 'Premium event decoration and styling services for corporate events. We specialize in creating sophisticated, branded environments that reflect your company\'s image and event objectives.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Stage Design Solutions',
    contact_name: 'Andre van der Berg',
    email: 'andre@stagedesignsolutions.co.za',
    phone: '+27 31 567 8901',
    logo_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    service_categories: ['Stage Design', 'Exhibition Stands', 'Branded Environments', 'Wayfinding Design', 'Lighting Design'],
    services_text: 'Professional stage design and exhibition stand solutions for corporate events, conferences, and brand activations. We create impactful visual environments that enhance your event experience.',
    is_published: true,
    status: 'active'
  },

  // Logistics & Support
  {
    name: 'Secure Event Solutions',
    contact_name: 'Captain John Pretorius',
    email: 'john@secureeventsolutions.co.za',
    phone: '+27 11 678 9012',
    logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    service_categories: ['Event Security', 'Crowd Management', 'Risk Management', 'Health & Safety Services'],
    services_text: 'Professional security services for corporate events, including crowd management, risk assessment, and health & safety compliance. We ensure safe and secure events for all attendees.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Event Staffing Solutions',
    contact_name: 'Patricia Ndlovu',
    email: 'patricia@eventstaffingsolutions.co.za',
    phone: '+27 21 789 0123',
    logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    service_categories: ['Event Staffing', 'Logistics Coordination', 'Event Management', 'Crowd Management'],
    services_text: 'Professional event staffing and logistics coordination services. We provide trained, professional staff for corporate events, conferences, and brand activations across South Africa.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Premium Transportation',
    contact_name: 'Sipho Mthembu',
    email: 'sipho@premiumtransportation.co.za',
    phone: '+27 31 890 1234',
    logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' },
    service_categories: ['Transportation Services', 'Logistics Coordination', 'Event Management'],
    services_text: 'Premium transportation services for corporate events, including executive vehicles, shuttle services, and logistics coordination. We ensure reliable and comfortable transportation for your event attendees.',
    is_published: true,
    status: 'active'
  },

  // Photography & Videography
  {
    name: 'Corporate Media Productions',
    contact_name: 'Alex Thompson',
    email: 'alex@corporatemediaproductions.co.za',
    phone: '+27 11 901 2345',
    logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    service_categories: ['Event Photography', 'Event Videography', 'Content Creation', 'Live Streaming Services'],
    services_text: 'Professional event photography and videography services for corporate events, conferences, and brand activations. We capture high-quality content for marketing and documentation purposes.',
    is_published: true,
    status: 'active'
  },
  {
    name: 'Live Stream Solutions',
    contact_name: 'Rachel Green',
    email: 'rachel@livestreamsolutions.co.za',
    phone: '+27 21 012 3456',
    logo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
    brochure_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop&crop=center',
    id_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    service_categories: ['Live Streaming Services', 'Virtual Event Technology', 'Event Videography', 'Interactive Technology'],
    services_text: 'Professional live streaming and virtual event technology services. We provide high-quality live streaming solutions for corporate events, conferences, and hybrid events.',
    is_published: true,
    status: 'active'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Seed Categories
    console.log('📋 Seeding categories...');
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .upsert(categories.map(name => ({ name })), { 
        onConflict: 'name',
        ignoreDuplicates: true 
      });

    if (categoryError) {
      console.error('❌ Error seeding categories:', categoryError);
      return;
    }
    console.log(`✅ Seeded ${categories.length} categories\n`);

    // 2. Seed Agencies
    console.log('🏢 Seeding agencies...');
    const { data: agencyData, error: agencyError } = await supabase
      .from('agencies')
      .upsert(agencies, { 
        onConflict: 'email',
        ignoreDuplicates: true 
      });

    if (agencyError) {
      console.error('❌ Error seeding agencies:', agencyError);
      return;
    }
    console.log(`✅ Seeded ${agencies.length} agencies\n`);

    // 3. Seed Suppliers
    console.log('🔧 Seeding suppliers...');
    const { data: supplierData, error: supplierError } = await supabase
      .from('suppliers')
      .upsert(suppliers, { 
        onConflict: 'email',
        ignoreDuplicates: true 
      });

    if (supplierError) {
      console.error('❌ Error seeding suppliers:', supplierError);
      return;
    }
    console.log(`✅ Seeded ${suppliers.length} suppliers\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Agencies: ${agencies.length}`);
    console.log(`   • Suppliers: ${suppliers.length}`);
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

module.exports = { seedDatabase };
