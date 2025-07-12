import React from 'react';
import { Helmet } from 'react-helmet-async';
import { config } from '../lib/config';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schema?: object;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = config.seo.title,
  description = config.seo.description,
  keywords = config.seo.keywords,
  ogImage = config.seo.ogImage,
  canonical,
  schema,
  noindex = false,
}) => {
  const siteUrl = config.site.url;
  const fullTitle = title === config.seo.title ? title : `${title} | ${config.site.name}`;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Indexing */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical Link */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonical || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={config.seo.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Structured Data / Schema.org */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
