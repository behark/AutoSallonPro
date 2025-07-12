import axios from 'axios';

// Interface for Instagram API responses
export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  children?: {
    data: {
      id: string;
      media_type: 'IMAGE' | 'VIDEO';
      media_url: string;
    }[];
  };
}

export interface InstagramCar {
  id: string;
  images: string[];
  info: string;
  price: string;
  created_time: string;
  link: string;
}

/**
 * Fetches media from an Instagram Business Account
 * @param instagramAccountId - The Instagram Business Account ID
 * @param accessToken - Facebook/Instagram API access token
 * @param limit - Number of posts to fetch (default: 25)
 */
export const fetchInstagramMedia = async (
  instagramAccountId: string,
  accessToken: string,
  limit = 25
): Promise<InstagramMedia[]> => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${instagramAccountId}/media`, {
        params: {
          access_token: accessToken,
          limit,
          fields: 'id,caption,media_type,media_url,permalink,timestamp,children{media_type,media_url}'
        }
      }
    );
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
};

/**
 * Extracts car information from Instagram media
 * Parses the media caption to identify car details and price
 */
export const extractCarsFromMedia = (mediaItems: InstagramMedia[]): InstagramCar[] => {
  return mediaItems
    .filter(media => {
      // Filter media that likely contain car listings
      // Check if media has images and contains typical car-related keywords or price patterns
      const isImageOrCarousel = media.media_type === 'IMAGE' || media.media_type === 'CAROUSEL_ALBUM';
      const hasCarKeywords = media.caption?.toLowerCase().match(/car|auto|vehicle|sedan|suv|bmw|audi|mercedes|vw|volkswagen|toyota|ford|€|euro/i);
      
      return isImageOrCarousel && hasCarKeywords;
    })
    .map(media => {
      // Extract images from media
      let images: string[] = [];
      
      if (media.media_type === 'IMAGE') {
        images = [media.media_url];
      } else if (media.media_type === 'CAROUSEL_ALBUM' && media.children?.data) {
        images = media.children.data
          .filter(child => child.media_type === 'IMAGE')
          .map(child => child.media_url);
      }
      
      // Try to extract price using regex (looking for patterns like "€10,000" or "10000€")
      const priceMatch = media.caption?.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)(?:\s*)(€|EUR|euro)/i) || 
                         media.caption?.match(/(€|EUR|euro)(?:\s*)(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/i);
      
      let price = priceMatch ? priceMatch[0] : "Price on request";
      
      // Get car info from caption (remove price if found)
      let info = media.caption || "Car details not available";
      if (priceMatch) {
        info = info.replace(priceMatch[0], '').trim();
      }
      
      return {
        id: media.id,
        images,
        info,
        price,
        created_time: media.timestamp,
        link: media.permalink
      };
    });
};

/**
 * Main function to fetch car listings from Instagram
 */
export const fetchInstagramCars = async (
  instagramAccountId: string,
  accessToken: string,
  limit = 50
): Promise<InstagramCar[]> => {
  try {
    const media = await fetchInstagramMedia(instagramAccountId, accessToken, limit);
    return extractCarsFromMedia(media);
  } catch (error) {
    console.error('Failed to fetch Instagram cars:', error);
    return [];
  }
};
