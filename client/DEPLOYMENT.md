# Auto Ani - Deployment Guide

This document provides comprehensive instructions for deploying the Auto Ani used car dealership website to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. Node.js (v18.0.0 or higher) installed
2. npm (v7.0.0 or higher) installed
3. Git installed (for version control)
4. API keys for Facebook and Instagram integrations
5. Access to your chosen hosting platform (Netlify, Vercel, etc.)

## Environment Configuration

The application uses environment variables for configuration. Before deployment:

1. Create or modify `.env.production` with your production values:

```
VITE_NODE_ENV=production
VITE_API_URL=https://api.yourdomain.com/api
VITE_ENABLE_MOCK_API=false
VITE_FACEBOOK_PAGE_ID=your_facebook_page_id
VITE_FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
VITE_INSTAGRAM_ACCOUNT_ID=your_instagram_account_id
VITE_INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
VITE_SITE_URL=https://yourdomain.com
VITE_DEBUG_ENABLED=false
```

2. **IMPORTANT**: Never commit your `.env.production` file to version control. It contains sensitive API keys and tokens.

## Build Process

To create a production build:

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. The build output will be in the `dist/` directory.

## Deployment Options

### Option 1: Netlify

Netlify offers easy deployment with continuous integration:

1. Create a `netlify.toml` file in the project root:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy via Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. Alternatively, connect your GitHub repository to Netlify for automatic deployments.

### Option 2: Vercel

Vercel is optimized for React applications:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy your application:
   ```bash
   vercel login
   vercel --prod
   ```

3. Configure project settings in the Vercel dashboard.

### Option 3: GitHub Pages

For hosting on GitHub Pages:

1. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add these scripts to package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Configure the base URL in vite.config.ts:
   ```typescript
   base: '/repository-name/',  // Replace with your repository name
   ```

4. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Option 4: Traditional Web Hosting

For traditional web hosting:

1. Build your application
2. Upload the contents of the `dist/` directory to your web server
3. Configure your web server to serve index.html for all routes (for SPA routing)

## Post-Deployment Verification

After deployment, verify that:

1. The website loads correctly
2. All pages and components function as expected
3. Facebook and Instagram car imports work properly
4. Forms submit data correctly
5. The site is responsive on various devices
6. SEO meta tags are present and correct

## Troubleshooting

Common deployment issues and solutions:

1. **404 errors on page refresh**: Configure redirects to serve index.html for all routes
2. **API connectivity issues**: Check your VITE_API_URL environment variable
3. **Social media integrations failing**: Verify API keys and tokens are correctly set
4. **CSS or JavaScript not loading**: Check for path issues in the build output

## Monitoring and Analytics

Consider setting up:

1. Google Analytics for website traffic monitoring
2. Error logging services like Sentry
3. Performance monitoring with tools like Lighthouse

## Security Considerations

1. Ensure API keys and tokens are securely stored as environment variables
2. Implement rate limiting for API endpoints
3. Use HTTPS for all connections
4. Regularly update dependencies to patch security vulnerabilities

---

For additional support or questions, please contact the development team.
