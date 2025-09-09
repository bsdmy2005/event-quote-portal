-- Test Data for South African Corporate Events and Marketing Activations
-- Run this in your Supabase SQL Editor after running seed-categories.sql

-- First, let's insert the categories
INSERT INTO categories (name) VALUES
-- Event Planning & Management
('Corporate Event Planning'),
('Conference Management'),
('Exhibition Management'),
('Product Launch Events'),
('Brand Activation Events'),
('Trade Show Management'),
('Corporate Gala Events'),
('Awards Ceremonies'),

-- Venues & Facilities
('Corporate Event Venues'),
('Conference Centers'),
('Exhibition Halls'),
('Outdoor Corporate Venues'),
('Hotels & Resorts'),
('Convention Centers'),
('Rooftop Venues'),
('Industrial Venues'),

-- Audio Visual & Technology
('Audio Visual Equipment'),
('Live Streaming Services'),
('Event Photography'),
('Event Videography'),
('LED Screens & Displays'),
('Sound Systems'),
('Lighting Design'),
('Virtual Event Technology'),
('Interactive Technology'),
('Projection Mapping'),

-- Catering & Food Services
('Corporate Catering'),
('Beverage Services'),
('Food Trucks'),
('Coffee Services'),
('Cocktail Services'),
('Fine Dining Catering'),
('Buffet Services'),
('Canapé Services'),

-- Entertainment & Activities
('Live Music'),
('Corporate Entertainment'),
('Team Building Activities'),
('Cultural Entertainment'),
('MC Services'),
('Speaker Services'),
('Performance Artists'),
('Interactive Entertainment'),

-- Marketing & Brand Activation
('Brand Activation'),
('Digital Marketing'),
('Event Marketing'),
('Public Relations'),
('Content Creation'),
('Social Media Management'),
('Influencer Marketing'),
('Experiential Marketing'),
('Guerrilla Marketing'),
('Product Sampling'),

-- Decor & Styling
('Event Decor'),
('Floral Design'),
('Lighting Design'),
('Furniture Rental'),
('Themed Events'),
('Stage Design'),
('Exhibition Stands'),
('Branded Environments'),
('Wayfinding Design'),

-- Logistics & Support
('Event Security'),
('Transportation Services'),
('Event Staffing'),
('Waste Management'),
('Insurance Services'),
('Event Management'),
('Logistics Coordination'),
('Crowd Management'),

-- Specialized Services
('Sustainability Services'),
('Accessibility Services'),
('Language Services'),
('Legal Services'),
('Financial Services'),
('Risk Management'),
('Compliance Services'),
('Health & Safety Services')
ON CONFLICT (name) DO NOTHING;

-- Insert 5 South African Agencies
INSERT INTO agencies (name, contact_name, email, phone, logo_url, website, location, interest_categories, about, status) VALUES
(
  'Creative Events SA',
  'Sarah Mitchell',
  'sarah@creativeeventssa.co.za',
  '+27 11 234 5678',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
  'https://www.creativeeventssa.co.za',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Corporate Event Planning", "Brand Activation Events", "Product Launch Events", "Conference Management", "Awards Ceremonies"]',
  'Creative Events SA is a leading corporate event management company specializing in brand activations, product launches, and corporate conferences. We have worked with major brands including Netflix, DSTV, and Heineken to create memorable experiences that drive engagement and brand awareness.',
  'active'
),
(
  'Premier Event Solutions',
  'David Nkomo',
  'david@premiereventsolutions.co.za',
  '+27 21 345 6789',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
  'https://www.premiereventsolutions.co.za',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["Exhibition Management", "Trade Show Management", "Corporate Gala Events", "Conference Management", "Brand Activation Events"]',
  'Premier Event Solutions delivers world-class corporate events and exhibitions across South Africa. Our expertise spans trade shows, corporate galas, and brand activations, with a focus on creating impactful experiences for our clients.',
  'active'
),
(
  'Dynamic Marketing Events',
  'Thabo Mthembu',
  'thabo@dynamicmarketingevents.co.za',
  '+27 31 456 7890',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop&crop=center',
  'https://www.dynamicmarketingevents.co.za',
  '{"city": "Durban", "province": "KwaZulu-Natal", "country": "South Africa"}',
  '["Brand Activation Events", "Experiential Marketing", "Product Launch Events", "Digital Marketing", "Event Marketing"]',
  'Dynamic Marketing Events specializes in experiential marketing and brand activations that create lasting impressions. We combine creativity with strategic thinking to deliver events that resonate with target audiences and drive business results.',
  'active'
),
(
  'Elite Corporate Events',
  'Jennifer van der Merwe',
  'jennifer@elitecorporateevents.co.za',
  '+27 12 567 8901',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  'https://www.elitecorporateevents.co.za',
  '{"city": "Pretoria", "province": "Gauteng", "country": "South Africa"}',
  '["Corporate Event Planning", "Conference Management", "Awards Ceremonies", "Corporate Gala Events", "Event Management"]',
  'Elite Corporate Events is a premium event management company serving corporate clients across South Africa. We excel in delivering sophisticated corporate events, conferences, and awards ceremonies that reflect our clients'' brand values and objectives.',
  'active'
),
(
  'Innovation Event Group',
  'Mandla Khumalo',
  'mandla@innovationeventgroup.co.za',
  '+27 11 678 9012',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
  'https://www.innovationeventgroup.co.za',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Product Launch Events", "Brand Activation Events", "Interactive Technology", "Virtual Event Technology", "Experiential Marketing"]',
  'Innovation Event Group is at the forefront of event technology and innovation. We specialize in cutting-edge product launches, brand activations, and immersive experiences that leverage the latest technology to create unforgettable moments.',
  'active'
);

-- Insert 15+ South African Suppliers
INSERT INTO suppliers (name, contact_name, email, phone, logo_url, brochure_url, id_image_url, location, service_categories, services_text, is_published, status) VALUES
-- Audio Visual & Technology Suppliers
(
  'ProSound AV Solutions',
  'Mike Johnson',
  'mike@prosoundav.co.za',
  '+27 11 123 4567',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Audio Visual Equipment", "Sound Systems", "LED Screens & Displays", "Lighting Design", "Live Streaming Services"]',
  'Professional audio visual equipment rental and technical support for corporate events, conferences, and brand activations. We provide state-of-the-art sound systems, LED displays, lighting solutions, and live streaming services.',
  true,
  'active'
),
(
  'Visual Impact Technologies',
  'Lisa Chen',
  'lisa@visualimpacttech.co.za',
  '+27 21 234 5678',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["LED Screens & Displays", "Projection Mapping", "Interactive Technology", "Virtual Event Technology", "Audio Visual Equipment"]',
  'Cutting-edge visual technology solutions including LED screens, projection mapping, and interactive displays. We specialize in creating immersive visual experiences for corporate events and brand activations.',
  true,
  'active'
),
(
  'Crystal Clear Sound',
  'Peter van Zyl',
  'peter@crystalclearsound.co.za',
  '+27 31 345 6789',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
  '{"city": "Durban", "province": "KwaZulu-Natal", "country": "South Africa"}',
  '["Sound Systems", "Audio Visual Equipment", "Live Streaming Services", "Lighting Design"]',
  'Premium sound system rental and audio engineering services for corporate events, conferences, and live streaming. Our team ensures crystal clear audio quality for all your event needs.',
  true,
  'active'
),

-- Catering & Food Services
(
  'Gourmet Corporate Catering',
  'Chef Maria Santos',
  'maria@gourmetcorporate.co.za',
  '+27 11 456 7890',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Corporate Catering", "Fine Dining Catering", "Canapé Services", "Beverage Services", "Coffee Services"]',
  'Exquisite corporate catering services specializing in fine dining, canapés, and premium beverage services. We cater to high-profile corporate events, conferences, and brand activations across South Africa.',
  true,
  'active'
),
(
  'Urban Food Trucks',
  'James Mthembu',
  'james@urbanfoodtrucks.co.za',
  '+27 21 567 8901',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["Food Trucks", "Corporate Catering", "Buffet Services", "Beverage Services"]',
  'Modern food truck services for corporate events and brand activations. We offer diverse cuisine options and can provide multiple trucks for large-scale events and activations.',
  true,
  'active'
),
(
  'Premium Bar Services',
  'Sarah Williams',
  'sarah@premiumbarservices.co.za',
  '+27 31 678 9012',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  '{"city": "Durban", "province": "KwaZulu-Natal", "country": "South Africa"}',
  '["Beverage Services", "Cocktail Services", "Corporate Catering", "Coffee Services"]',
  'Professional bar and beverage services for corporate events, including cocktail bars, coffee stations, and premium beverage management. We ensure exceptional service and quality drinks.',
  true,
  'active'
),

-- Venues & Facilities
(
  'Grand Convention Centre',
  'Robert Smith',
  'robert@grandconvention.co.za',
  '+27 11 789 0123',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Conference Centers", "Exhibition Halls", "Corporate Event Venues", "Convention Centers"]',
  'Premier convention and conference center in Johannesburg, offering state-of-the-art facilities for corporate events, exhibitions, and conferences. Capacity for up to 2000 delegates.',
  true,
  'active'
),
(
  'Cape Town Event Hub',
  'Amanda Botha',
  'amanda@capetowneventhub.co.za',
  '+27 21 890 1234',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["Corporate Event Venues", "Rooftop Venues", "Outdoor Corporate Venues", "Hotels & Resorts"]',
  'Versatile event venue in Cape Town offering indoor and outdoor spaces, including a stunning rooftop venue with panoramic views. Perfect for corporate events, product launches, and brand activations.',
  true,
  'active'
),
(
  'Industrial Event Space',
  'Thabo Nkosi',
  'thabo@industrialeventspace.co.za',
  '+27 31 901 2345',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  '{"city": "Durban", "province": "KwaZulu-Natal", "country": "South Africa"}',
  '["Industrial Venues", "Exhibition Halls", "Corporate Event Venues", "Outdoor Corporate Venues"]',
  'Unique industrial event space perfect for large-scale brand activations, product launches, and corporate events. Features high ceilings, open spaces, and modern amenities.',
  true,
  'active'
),

-- Entertainment & Activities
(
  'Corporate Entertainment Group',
  'Zanele Mthembu',
  'zanele@corporateentertainment.co.za',
  '+27 11 012 3456',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Corporate Entertainment", "Live Music", "MC Services", "Performance Artists", "Interactive Entertainment"]',
  'Professional entertainment services for corporate events, including live music, MCs, performance artists, and interactive entertainment. We provide entertainment that aligns with your brand and event objectives.',
  true,
  'active'
),
(
  'Team Building Adventures',
  'Mark Johnson',
  'mark@teambuildingadventures.co.za',
  '+27 21 123 4567',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["Team Building Activities", "Corporate Entertainment", "Interactive Entertainment", "Cultural Entertainment"]',
  'Specialized team building activities and corporate entertainment designed to enhance team cohesion and engagement. We offer both indoor and outdoor activities suitable for corporate events.',
  true,
  'active'
),

-- Marketing & Brand Activation
(
  'Brand Activation Specialists',
  'Nomsa Dlamini',
  'nomsa@brandactivationspecialists.co.za',
  '+27 31 234 5678',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  '{"city": "Durban", "province": "KwaZulu-Natal", "country": "South Africa"}',
  '["Brand Activation", "Experiential Marketing", "Product Sampling", "Guerrilla Marketing", "Event Marketing"]',
  'Specialized brand activation and experiential marketing services. We create immersive brand experiences that drive engagement and deliver measurable results for corporate clients.',
  true,
  'active'
),
(
  'Digital Event Marketing',
  'Kevin O''Connor',
  'kevin@digitaleventmarketing.co.za',
  '+27 11 345 6789',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Digital Marketing", "Event Marketing", "Social Media Management", "Content Creation", "Influencer Marketing"]',
  'Digital marketing services specifically tailored for events and brand activations. We provide social media management, content creation, and influencer marketing to maximize event reach and engagement.',
  true,
  'active'
),

-- Decor & Styling
(
  'Elite Event Decor',
  'Grace Mokoena',
  'grace@eliteeventdecor.co.za',
  '+27 21 456 7890',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["Event Decor", "Floral Design", "Lighting Design", "Furniture Rental", "Themed Events"]',
  'Premium event decoration and styling services for corporate events. We specialize in creating sophisticated, branded environments that reflect your company''s image and event objectives.',
  true,
  'active'
),
(
  'Stage Design Solutions',
  'Andre van der Berg',
  'andre@stagedesignsolutions.co.za',
  '+27 31 567 8901',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1519167758481-83f1426e4b2e?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  '{"city": "Durban", "province": "KwaZulu-Natal", "country": "South Africa"}',
  '["Stage Design", "Exhibition Stands", "Branded Environments", "Wayfinding Design", "Lighting Design"]',
  'Professional stage design and exhibition stand solutions for corporate events, conferences, and brand activations. We create impactful visual environments that enhance your event experience.',
  true,
  'active'
),

-- Logistics & Support
(
  'Secure Event Solutions',
  'Captain John Pretorius',
  'john@secureeventsolutions.co.za',
  '+27 11 678 9012',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Event Security", "Crowd Management", "Risk Management", "Health & Safety Services"]',
  'Professional security services for corporate events, including crowd management, risk assessment, and health & safety compliance. We ensure safe and secure events for all attendees.',
  true,
  'active'
),
(
  'Event Staffing Solutions',
  'Patricia Ndlovu',
  'patricia@eventstaffingsolutions.co.za',
  '+27 21 789 0123',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["Event Staffing", "Logistics Coordination", "Event Management", "Crowd Management"]',
  'Professional event staffing and logistics coordination services. We provide trained, professional staff for corporate events, conferences, and brand activations across South Africa.',
  true,
  'active'
),
(
  'Premium Transportation',
  'Sipho Mthembu',
  'sipho@premiumtransportation.co.za',
  '+27 31 890 1234',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  '{"city": "Durban", "province": "KwaZulu-Natal", "country": "South Africa"}',
  '["Transportation Services", "Logistics Coordination", "Event Management"]',
  'Premium transportation services for corporate events, including executive vehicles, shuttle services, and logistics coordination. We ensure reliable and comfortable transportation for your event attendees.',
  true,
  'active'
),

-- Photography & Videography
(
  'Corporate Media Productions',
  'Alex Thompson',
  'alex@corporatemediaproductions.co.za',
  '+27 11 901 2345',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center',
  '{"city": "Johannesburg", "province": "Gauteng", "country": "South Africa"}',
  '["Event Photography", "Event Videography", "Content Creation", "Live Streaming Services"]',
  'Professional event photography and videography services for corporate events, conferences, and brand activations. We capture high-quality content for marketing and documentation purposes.',
  true,
  'active'
),
(
  'Live Stream Solutions',
  'Rachel Green',
  'rachel@livestreamsolutions.co.za',
  '+27 21 012 3456',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center',
  '{"city": "Cape Town", "province": "Western Cape", "country": "South Africa"}',
  '["Live Streaming Services", "Virtual Event Technology", "Event Videography", "Interactive Technology"]',
  'Professional live streaming and virtual event technology services. We provide high-quality live streaming solutions for corporate events, conferences, and hybrid events.',
  true,
  'active'
);
