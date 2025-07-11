import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  full_picture?: string;
  created_time: string;
  permalink_url?: string;
}

interface FacebookPageInfo {
  id: string;
  name: string;
  about?: string;
  phone?: string;
  website?: string;
  followers_count?: number;
  fan_count?: number;
}

interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

export function SocialMediaFeed() {
  const { t } = useTranslation();

  const { data: pageInfo } = useQuery({
    queryKey: ["/api/facebook/page-info"],
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: facebookPosts } = useQuery({
    queryKey: ["/api/facebook/posts"],
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const { data: instagramPosts } = useQuery({
    queryKey: ["/api/instagram/posts"],
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show AUTO ANI business info even if Facebook API has limited access
  const businessInfo = pageInfo || {
    name: "AUTO ANI",
    about: "Premium used car dealership specializing in quality vehicle imports from Finland and Germany. Located in Mitrovica, Kosovo.",
    website: "https://instagram.com/aniautosallon",
  };

  return (
    <div className="space-y-8">
      {/* Page Info */}
      {pageInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('social.followUs')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{pageInfo.name}</h3>
                {pageInfo.about && (
                  <p className="text-muted-foreground mt-1">{pageInfo.about}</p>
                )}
              </div>
              
              <div className="flex gap-4 text-sm">
                {pageInfo.fan_count && (
                  <Badge variant="secondary">
                    {pageInfo.fan_count.toLocaleString()} {t('social.followers')}
                  </Badge>
                )}
                {pageInfo.phone && (
                  <Badge variant="outline">
                    {pageInfo.phone}
                  </Badge>
                )}
              </div>

              {pageInfo.website && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={pageInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('social.visitPage')}
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facebook Posts */}
      {facebookPosts && facebookPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t('social.latestPosts')}
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {facebookPosts.slice(0, 4).map((post: FacebookPost) => (
              <Card key={post.id} className="overflow-hidden">
                {post.full_picture && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.full_picture} 
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.created_time)}
                    </span>
                  </div>
                  
                  {(post.message || post.story) && (
                    <p className="text-sm line-clamp-3 mb-3">
                      {post.message || post.story}
                    </p>
                  )}
                  
                  {post.permalink_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={post.permalink_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t('social.viewPost')}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Instagram Posts */}
      {instagramPosts && instagramPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('social.instagram')}
          </h3>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {instagramPosts.slice(0, 8).map((post: InstagramPost) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} 
                    alt="Instagram post"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <CardContent className="p-3">
                  {post.caption && (
                    <p className="text-xs line-clamp-2 mb-2">
                      {post.caption}
                    </p>
                  )}
                  
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a 
                      href={post.permalink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t('social.viewOnInstagram')}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Fallback Content */}
      {(!facebookPosts || facebookPosts.length === 0) && (!instagramPosts || instagramPosts.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('social.noPostsTitle')}</h3>
            <p className="text-muted-foreground mb-4">{t('social.noPostsDescription')}</p>
            <Button variant="outline" asChild>
              <a 
                href="https://www.facebook.com/aniautosallon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t('social.visitFacebook')}
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}