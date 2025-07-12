import axios from 'axios';

// Interface for Facebook API responses
export interface FacebookPost {
  id: string;
  created_time: string;
  message: string;
  attachments?: {
    data: {
      media: {
        image: {
          src: string;
        };
      }[];
    }[];
  };
}

export interface FacebookCar {
  id: string;
  images: string[];
  info: string;
  price: string;
  created_time: string;
  link?: string;
}

const FACEBOOK_API_VERSION = 'v18.0';

/**
 * Fetches car posts from a Facebook Page
 * @param pageId - The Facebook Page ID
 * @param accessToken - Facebook API access token
 * @param limit - Number of posts to fetch (default: 25)
 */
export const fetchFacebookPagePosts = async (
  pageId: string, 
  accessToken: string, 
  limit = 25
): Promise<FacebookPost[]> => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}/posts`, {
        params: {
          access_token: accessToken,
          limit,
          fields: 'id,created_time,message,attachments{media}'
        }
      }
    );
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching Facebook page posts:', error);
    throw error;
  }
};

/**
 * Extracts car information from Facebook posts
 * Parses the post message to identify car details and price
 */
export const extractCarsFromPosts = (posts: FacebookPost[]): FacebookCar[] => {
  return posts
    .filter(post => {
      // Filter posts that likely contain car listings
      // Check if post has images and contains typical car-related keywords or price patterns
      const hasAttachments = post.attachments?.data?.length > 0;
      const hasCarKeywords = post.message?.toLowerCase().match(/car|auto|vehicle|sedan|suv|bmw|audi|mercedes|vw|volkswagen|toyota|ford|€|euro/i);
      
      return hasAttachments && hasCarKeywords;
    })
    .map(post => {
      // Extract images from post attachments
      const images = post.attachments?.data
        ?.flatMap(attachment => 
          attachment.media
            ?.filter(m => m.image)
            .map(m => m.image.src)
        ) || [];
      
      // Try to extract price using regex (looking for patterns like "€10,000" or "10000€")
      const priceMatch = post.message?.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)(?:\s*)(€|EUR|euro)/i) || 
                         post.message?.match(/(€|EUR|euro)(?:\s*)(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/i);
      
      let price = priceMatch ? priceMatch[0] : "Price on request";
      
      // Get car info from message (remove price if found)
      let info = post.message || "Car details not available";
      if (priceMatch) {
        info = info.replace(priceMatch[0], '').trim();
      }
      
      return {
        id: post.id,
        images,
        info,
        price,
        created_time: post.created_time,
        link: `https://facebook.com/${post.id}`
      };
    });
};

/**
 * Main function to fetch car listings from Facebook
 */
export const fetchFacebookCars = async (
  pageId: string,
  accessToken: string,
  limit = 50
): Promise<FacebookCar[]> => {
  try {
    const posts = await fetchFacebookPagePosts(pageId, accessToken, limit);
    return extractCarsFromPosts(posts);
  } catch (error) {
    console.error('Failed to fetch Facebook cars:', error);
    return [];
  }
};
