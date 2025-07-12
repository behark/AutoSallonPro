# DNS Configuration for www.aniautosallon.com

## DNS Records to Add at Your Domain Registrar (Namecheap)

### Option 1: If deploying to Netlify

| Type  | Host/Name | Value/Target                      | TTL      |
|-------|-----------|----------------------------------|----------|
| CNAME | www       | your-netlify-site.netlify.app    | Automatic |
| A     | @         | 75.2.60.5                        | Automatic |
| A     | @         | 76.76.21.21                      | Automatic |

### Option 2: If deploying to Vercel

| Type  | Host/Name | Value/Target                      | TTL      |
|-------|-----------|----------------------------------|----------|
| CNAME | www       | cname.vercel-dns.com             | Automatic |
| A     | @         | 76.76.21.21                      | Automatic |

### Option 3: If deploying to a custom server

| Type  | Host/Name | Value/Target                      | TTL      |
|-------|-----------|----------------------------------|----------|
| CNAME | www       | your-hosting-provider-domain     | Automatic |
| A     | @         | IP-ADDRESS-OF-YOUR-SERVER        | Automatic |

## Additional Recommended DNS Records

### Email and Security

| Type  | Host/Name | Value/Target                      | TTL      |
|-------|-----------|----------------------------------|----------|
| MX    | @         | mx.your-email-provider.com (priority: 10) | Automatic |
| TXT   | @         | v=spf1 include:_spf.your-email-provider.com ~all | Automatic |
| TXT   | _dmarc   | v=DMARC1; p=none; rua=mailto:admin@aniautosallon.com | Automatic |

### SSL/TLS Configuration

Once your DNS is configured, you'll need to:

1. Enable HTTPS on your hosting provider (most platforms like Netlify and Vercel do this automatically)
2. Ensure your SSL certificate includes both the apex domain (aniautosallon.com) and the www subdomain (www.aniautosallon.com)

## Verification Steps

After updating your DNS records:

1. DNS propagation may take up to 48 hours, but often completes within a few hours
2. Verify your DNS configuration using tools like:
   - https://dnschecker.org
   - https://mxtoolbox.com/DNSLookup.aspx
   - https://www.whatsmydns.net

3. Test your domain by visiting:
   - http://www.aniautosallon.com (should redirect to HTTPS)
   - https://www.aniautosallon.com
   - https://aniautosallon.com (should redirect to www or vice versa depending on your configuration)

## Troubleshooting

If your domain doesn't work after DNS propagation:

1. Check that your hosting provider has properly configured your domain
2. Verify that SSL certificates have been issued correctly
3. Make sure your build settings include the proper domain configuration
4. Check for any URL hard-coding in your application that might be pointing to development URLs

## Updating Your Application

After your domain is working, update your environment files:

```
VITE_SITE_URL=https://www.aniautosallon.com
```

This ensures all internal links and SEO configurations use the correct domain name.
