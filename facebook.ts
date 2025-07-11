interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  full_picture?: string;
  created_time: string;
  permalink_url?: string;
  attachments?: {
    data: Array<{
      media?: {
        image?: {
          src: string;
        };
      };
      target?: {
        url: string;
      };
    }>;
  };
}

interface FacebookPageInfo {
  id: string;
  name: string;
  about?: string;
  phone?: string;
  website?: string;
  location?: {
    street?: string;
    city?: string;
    country?: string;
  };
  cover?: {
    source: string;
  };
  picture?: {
    data: {
      url: string;
    };
  };
  followers_count?: number;
  fan_count?: number;
}

export class FacebookService {
  private pageAccessToken: string;
  private appId: string;
  private appSecret: string;

  constructor() {
    this.appId = process.env.FACEBOOK_APP_ID || '';
    this.appSecret = process.env.FACEBOOK_APP_SECRET || '';
    // Use the page access token directly
    this.pageAccessToken = process.env.FACEBOOK_ACCESS_TOKEN || `${this.appId}|${this.appSecret}`;
  }

  // Get page info using page access token
  private async getPageInfo(): Promise<{ id: string; access_token: string } | null> {
    try {
      // With a page access token, "me" refers to the page directly
      const pageData = await this.makeRequest(`me?access_token=${this.pageAccessToken}`);
      console.log('Page data retrieved:', pageData);
      
      return { 
        id: pageData.id, 
        access_token: this.pageAccessToken 
      };
    } catch (error) {
      console.error('Failed to get page info:', error);
      return null;
    }
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const url = `https://graph.facebook.com/v18.0/${endpoint}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Facebook API error details:', data);
        throw new Error(`Facebook API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }
      return data;
    } catch (error) {
      console.error('Facebook API request failed for URL:', url);
      console.error('Error:', error);
      throw error;
    }
  }

  async getPageDetails(): Promise<FacebookPageInfo | null> {
    try {
      const pageInfo = await this.getPageInfo();
      if (!pageInfo) return null;

      // Use only basic fields that work with user tokens
      const fields = 'id,name';
      const data = await this.makeRequest(`${pageInfo.id}?fields=${fields}&access_token=${pageInfo.access_token}`);
      
      // Return AUTO ANI business information
      return {
        id: data.id,
        name: 'AUTO ANI',
        about: 'Premium used car dealership specializing in quality vehicle imports from Finland and Germany. Located in Mitrovica, Kosovo.',
        website: 'https://instagram.com/aniautosallon'
      };
    } catch (error) {
      console.error('Failed to fetch page details:', error);
      return null;
    }
  }

  async getRecentPosts(limit: number = 10): Promise<FacebookPost[]> {
    try {
      const pageInfo = await this.getPageInfo();
      if (!pageInfo) return [];

      const fields = 'id,message,story,full_picture,created_time,permalink_url,attachments{media,target}';
      const data = await this.makeRequest(`${pageInfo.id}/posts?fields=${fields}&limit=${limit}&access_token=${pageInfo.access_token}`);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return [];
    }
  }

  async getInstagramPosts(limit: number = 10): Promise<any[]> {
    try {
      const pageInfo = await this.getPageInfo();
      if (!pageInfo) return [];

      // First get Instagram Business Account connected to Facebook Page
      const igAccount = await this.makeRequest(`${pageInfo.id}?fields=instagram_business_account&access_token=${pageInfo.access_token}`);
      
      if (!igAccount.instagram_business_account) {
        return [];
      }

      const igAccountId = igAccount.instagram_business_account.id;
      const fields = 'id,media_type,media_url,permalink,caption,timestamp,thumbnail_url';
      const data = await this.makeRequest(`${igAccountId}/media?fields=${fields}&limit=${limit}&access_token=${pageInfo.access_token}`);
      
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error);
      return [];
    }
  }

  async getPageReviews(limit: number = 5): Promise<any[]> {
    try {
      const pageInfo = await this.getPageInfo();
      if (!pageInfo) return [];

      const fields = 'created_time,reviewer,rating,review_text';
      const data = await this.makeRequest(`${pageInfo.id}/ratings?fields=${fields}&limit=${limit}&access_token=${pageInfo.access_token}`);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  }
}

export const facebookService = new FacebookService();