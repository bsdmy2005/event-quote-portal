// Utility functions for handling Unsplash images

export interface UnsplashImageConfig {
  width?: number;
  height?: number;
  fit?: 'crop' | 'fill' | 'scale-down' | 'contain' | 'cover' | 'pad';
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'faces' | 'focalpoint';
  quality?: number;
  format?: 'jpg' | 'png' | 'webp';
}

/**
 * Generate Unsplash image URL with specific parameters
 */
export function generateUnsplashUrl(
  imageId: string,
  config: UnsplashImageConfig = {}
): string {
  const {
    width = 400,
    height = 400,
    fit = 'crop',
    crop = 'center',
    quality = 80,
    format = 'jpg'
  } = config;

  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    fit,
    crop,
    q: quality.toString(),
    fm: format
  });

  return `https://images.unsplash.com/photo-${imageId}?${params.toString()}`;
}

/**
 * Predefined Unsplash image IDs for different categories
 */
export const UNSPLASH_IMAGES = {
  // Corporate/Business
  corporate: {
    office: '1560472354-b33ff0c44a43',
    meeting: '1552664730-d307ca884978',
    conference: '1511795409834-ef04bbd61622',
    presentation: '1507003211169-0a1dd7228f2d',
    team: '1472099645785-5658abf4ff4e',
    business: '1494790108755-2616b612b786'
  },
  
  // Audio Visual & Technology
  av: {
    sound: '1493225457124-a3eb161ffa5f',
    lighting: '1516321318423-f06f85e504b3',
    screens: '1558618047-3c8c76ca7d13',
    tech: '1516321318423-f06f85e504b3'
  },
  
  // Food & Catering
  food: {
    catering: '1556909114-f6e7ad7d3136',
    restaurant: '1556909114-f6e7ad7d3136',
    drinks: '1556909114-f6e7ad7d3136'
  },
  
  // Venues
  venues: {
    conference: '1519167758481-83f1426e4b2e',
    hall: '1519167758481-83f1426e4b2e',
    outdoor: '1519167758481-83f1426e4b2e',
    rooftop: '1519167758481-83f1426e4b2e'
  },
  
  // Entertainment
  entertainment: {
    music: '1493225457124-a3eb161ffa5f',
    performance: '1493225457124-a3eb161ffa5f',
    stage: '1493225457124-a3eb161ffa5f'
  },
  
  // Marketing & Branding
  marketing: {
    branding: '1552664730-d307ca884978',
    activation: '1552664730-d307ca884978',
    digital: '1552664730-d307ca884978'
  },
  
  // Decor & Styling
  decor: {
    flowers: '1519167758481-83f1426e4b2e',
    lighting: '1516321318423-f06f85e504b3',
    furniture: '1519167758481-83f1426e4b2e'
  },
  
  // Security & Logistics
  security: {
    security: '1552664730-d307ca884978',
    logistics: '1552664730-d307ca884978',
    transport: '1552664730-d307ca884978'
  },
  
  // Photography & Media
  media: {
    camera: '1507003211169-0a1dd7228f2d',
    video: '1494790108755-2616b612b786',
    streaming: '1507003211169-0a1dd7228f2d'
  }
} as const;

/**
 * Get appropriate Unsplash image for a category
 */
export function getUnsplashImageForCategory(
  category: string,
  type: 'logo' | 'banner' | 'gallery' = 'logo'
): string {
  const categoryLower = category.toLowerCase();
  
  // Map categories to image types
  if (categoryLower.includes('audio') || categoryLower.includes('visual') || categoryLower.includes('sound') || categoryLower.includes('lighting')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.av.sound, { width: 400, height: 400 });
  }
  
  if (categoryLower.includes('catering') || categoryLower.includes('food') || categoryLower.includes('beverage')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.food.catering, { width: 400, height: 400 });
  }
  
  if (categoryLower.includes('venue') || categoryLower.includes('conference') || categoryLower.includes('exhibition')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.venues.conference, { width: 400, height: 400 });
  }
  
  if (categoryLower.includes('entertainment') || categoryLower.includes('music') || categoryLower.includes('performance')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.entertainment.music, { width: 400, height: 400 });
  }
  
  if (categoryLower.includes('marketing') || categoryLower.includes('brand') || categoryLower.includes('activation')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.marketing.branding, { width: 400, height: 400 });
  }
  
  if (categoryLower.includes('decor') || categoryLower.includes('floral') || categoryLower.includes('styling')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.decor.flowers, { width: 400, height: 400 });
  }
  
  if (categoryLower.includes('security') || categoryLower.includes('staffing') || categoryLower.includes('transport')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.security.security, { width: 400, height: 400 });
  }
  
  if (categoryLower.includes('photography') || categoryLower.includes('videography') || categoryLower.includes('streaming')) {
    return generateUnsplashUrl(UNSPLASH_IMAGES.media.camera, { width: 400, height: 400 });
  }
  
  // Default to corporate image
  return generateUnsplashUrl(UNSPLASH_IMAGES.corporate.office, { width: 400, height: 400 });
}

/**
 * Check if a URL is an Unsplash URL
 */
export function isUnsplashUrl(url: string): boolean {
  return url.includes('images.unsplash.com');
}

/**
 * Extract image ID from Unsplash URL
 */
export function extractUnsplashImageId(url: string): string | null {
  const match = url.match(/photo-([^?]+)/);
  return match ? match[1] : null;
}

/**
 * Generate multiple Unsplash images for gallery
 */
export function generateGalleryImages(
  category: string,
  count: number = 5
): string[] {
  const images: string[] = [];
  const categoryLower = category.toLowerCase();
  
  // Get base image for category
  const baseImage = getUnsplashImageForCategory(category);
  const baseImageId = extractUnsplashImageId(baseImage);
  
  if (!baseImageId) return images;
  
  // Generate variations with different crops and sizes
  const crops = ['center', 'top', 'bottom', 'left', 'right'] as const;
  const sizes = [
    { width: 400, height: 300 },
    { width: 300, height: 400 },
    { width: 400, height: 400 },
    { width: 500, height: 300 },
    { width: 300, height: 500 }
  ];
  
  for (let i = 0; i < count; i++) {
    const crop = crops[i % crops.length];
    const size = sizes[i % sizes.length];
    
    images.push(generateUnsplashUrl(baseImageId, {
      ...size,
      crop,
      fit: 'crop'
    }));
  }
  
  return images;
}
