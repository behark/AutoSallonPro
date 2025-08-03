import axios from 'axios';
import express from 'express';

const router = express.Router();

const FB_APP_ID = process.env.FB_APP_ID || '723238287294850';
const FB_APP_SECRET = process.env.FB_APP_SECRET || '4537bb4500a20251b9baf5df95dcafb1';
const FB_PAGE_ID = process.env.FB_PAGE_ID || '723238287294850';

// Utility: Get App Access Token
async function getAppAccessToken() {
  const resp = await axios.get(
    `https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&grant_type=client_credentials`
  );
  return resp.data.access_token;
}

// Utility: Get latest posts with photos
async function getCarPostsWithPhotos(pageId: string, accessToken: string) {
  // Fetch posts with attached media
  const resp = await axios.get(
    `https://graph.facebook.com/v19.0/${pageId}/posts`,
    {
      params: {
        access_token: accessToken,
        fields: 'id,message,created_time,attachments{media,type,url,subattachments},full_picture',
        limit: 10,
      },
    }
  );
  // Filter posts with images and try to extract car info/price from message
  return resp.data.data
    .map((post: any) => {
      let images: string[] = [];
      if (post.attachments && post.attachments.data) {
        for (const att of post.attachments.data) {
          if (att.type === 'photo' && att.media && att.media.image) {
            images.push(att.media.image.src);
          }
          if (att.subattachments && att.subattachments.data) {
            for (const sub of att.subattachments.data) {
              if (sub.media && sub.media.image) {
                images.push(sub.media.image.src);
              }
            }
          }
        }
      }
      if (post.full_picture) {
        images.push(post.full_picture);
      }
      // Parse car info and price from message (simple regex)
      let info = '';
      let price = '';
      if (post.message) {
        info = post.message.split(/\b(?:Çmimi|Price|€|USD|Lek|Euro)\b/i)[0].trim();
        const priceMatch = post.message.match(/([€$]?\s?\d+[\.,]?\d*)/);
        price = priceMatch ? priceMatch[1] : '';
      }
      return images.length > 0 ? { images, info, price, created_time: post.created_time } : null;
    })
    .filter(Boolean);
}

// API endpoint
router.get('/api/facebook-cars', async (req, res) => {
  try {
    const pageId = req.query.pageId || FB_PAGE_ID;
    if (!pageId) return res.status(400).json({ error: 'Missing Facebook Page ID' });
    const token = await getAppAccessToken();
    const posts = await getCarPostsWithPhotos(pageId, token);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Facebook posts', details: err?.message });
  }
});

export default router;
