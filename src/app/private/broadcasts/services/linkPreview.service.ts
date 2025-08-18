import type { LinkMetadata } from '../components/ui/LinkPreview';

interface LinkPreviewResponse {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  author?: string;
}

class LinkPreviewService {
  private cache = new Map<string, LinkMetadata>();
  private readonly CACHE_TTL = 1000 * 60 * 30; // 30 minutes
  private cacheTimestamps = new Map<string, number>();

  async fetchMetadata(url: string): Promise<LinkMetadata | null> {
    // Check cache first
    if (this.cache.has(url) && this.isCacheValid(url)) {
      return this.cache.get(url)!;
    }

    try {
      // Try to fetch real metadata first (in future this could call a backend service)
      let metadata = await this.tryFetchRealMetadata(url);

      // Fallback to pattern-based generation
      if (!metadata) {
        metadata = await this.generateMetadata(url);
      }

      if (metadata) {
        this.cache.set(url, metadata);
        this.cacheTimestamps.set(url, Date.now());
      }

      return metadata;
    } catch (error) {
      console.error('Failed to fetch link metadata:', error);
      return null;
    }
  }

  private async tryFetchRealMetadata(url: string): Promise<LinkMetadata | null> {
    // TODO: In production, this would call your backend service
    // that can safely fetch meta tags from the URL
    //
    // Example backend call:
    // const response = await fetch('/api/fetch-metadata', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url })
    // });
    // const data = await response.json();
    // return data.metadata;

    return null; // For now, always fallback to pattern-based
  }

  private isCacheValid(url: string): boolean {
    const timestamp = this.cacheTimestamps.get(url);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  private async generateMetadata(url: string): Promise<LinkMetadata | null> {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');

      // Base metadata
      const metadata: LinkMetadata = {
        url,
        title: this.extractTitle(url, domain),
        description: this.extractDescription(url, domain),
        siteName: this.getSiteName(domain),
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        author: this.extractAuthor(url, domain)
      };

      // Enhanced metadata for specific sites
      await this.enhanceMetadata(metadata, urlObj);

      return metadata;
    } catch (error) {
      console.error('Error generating metadata:', error);
      return null;
    }
  }

  private extractTitle(url: string, domain: string): string {
    const urlObj = new URL(url);

    // YouTube
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return 'YouTube Video';
    }

    // GitHub
    if (domain.includes('github.com')) {
      const path = urlObj.pathname.split('/').filter(Boolean);
      if (path.length >= 2) {
        return `${path[0]}/${path[1]} - GitHub`;
      }
      return 'GitHub Repository';
    }

    // Twitter/X
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return 'Twitter/X Post';
    }

    // LinkedIn
    if (domain.includes('linkedin.com')) {
      if (urlObj.pathname.includes('/posts/')) {
        return 'LinkedIn Post';
      }
      if (urlObj.pathname.includes('/in/')) {
        return 'LinkedIn Profile';
      }
      return 'LinkedIn';
    }

    // Medium - extract title from URL
    if (domain.includes('medium.com')) {
      const path = urlObj.pathname;
      const titleMatch = path.match(/\/([^\/]+)$/);
      if (titleMatch && titleMatch[1]) {
        // Convert URL slug to readable title
        let slug = titleMatch[1];

        // Remove Medium's trailing ID (usually a hash like 3db155d5c6b2)
        slug = slug.replace(/-[a-f0-9]{12}$/, '');

        const title = slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return title;
      }
      return 'Medium Article';
    }

    // Dev.to - extract title from URL
    if (domain.includes('dev.to')) {
      const path = urlObj.pathname;
      const titleMatch = path.match(/\/[^\/]+\/([^\/]+)$/);
      if (titleMatch && titleMatch[1]) {
        const slug = titleMatch[1];
        const title = slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return title;
      }
      return 'Dev.to Article';
    }

    // Generic title
    return this.formatDomainTitle(domain);
  }

  private extractDescription(url: string, domain: string): string {
    const urlObj = new URL(url);

    // YouTube
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return 'Watch this video on YouTube';
    }

    // GitHub
    if (domain.includes('github.com')) {
      const path = urlObj.pathname.split('/').filter(Boolean);
      if (path.length >= 2) {
        return `Explore the ${path[1]} repository by ${path[0]} on GitHub`;
      }
      return 'View this repository on GitHub';
    }

    // Twitter/X
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return 'View this post on Twitter/X';
    }

    // LinkedIn
    if (domain.includes('linkedin.com')) {
      if (urlObj.pathname.includes('/posts/')) {
        return 'Read this professional update on LinkedIn';
      }
      if (urlObj.pathname.includes('/in/')) {
        return 'View this professional profile on LinkedIn';
      }
      return 'View on LinkedIn';
    }

    // Medium
    if (domain.includes('medium.com')) {
      return 'Article on Medium';
    }

    // Dev.to
    if (domain.includes('dev.to')) {
      return 'Developer article on DEV Community';
    }

    // Generic description
    return `Visit ${domain} to view the full content`;
  }

  private getSiteName(domain: string): string {
    const siteNames: Record<string, string> = {
      'youtube.com': 'YouTube',
      'youtu.be': 'YouTube',
      'github.com': 'GitHub',
      'twitter.com': 'Twitter',
      'x.com': 'X',
      'linkedin.com': 'LinkedIn',
      'medium.com': 'Medium',
      'dev.to': 'DEV Community',
      'stackoverflow.com': 'Stack Overflow',
      'reddit.com': 'Reddit',
      'facebook.com': 'Facebook',
      'instagram.com': 'Instagram',
      'tiktok.com': 'TikTok',
      'pinterest.com': 'Pinterest'
    };

    return siteNames[domain] || this.formatDomainTitle(domain);
  }

  private formatDomainTitle(domain: string): string {
    return domain
      .split('.')
      .slice(0, -1) // Remove TLD
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('.');
  }

  private extractAuthor(url: string, domain: string): string | undefined {
    const urlObj = new URL(url);

    // Medium - extract author from @username
    if (domain.includes('medium.com')) {
      const authorMatch = urlObj.pathname.match(/\/@([^\/]+)/);
      if (authorMatch) {
        return authorMatch[1];
      }
    }

    // Dev.to - extract author from username
    if (domain.includes('dev.to')) {
      const authorMatch = urlObj.pathname.match(/\/([^\/]+)\//);
      if (authorMatch) {
        return authorMatch[1];
      }
    }

    // GitHub - extract author from repository owner
    if (domain.includes('github.com')) {
      const path = urlObj.pathname.split('/').filter(Boolean);
      if (path.length >= 1) {
        return path[0];
      }
    }

    return undefined;
  }

  private async enhanceMetadata(metadata: LinkMetadata, urlObj: URL): Promise<void> {
    const domain = urlObj.hostname.replace('www.', '');

    // YouTube specific enhancements
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      const videoId = this.extractYouTubeVideoId(urlObj);
      if (videoId) {
        metadata.image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        metadata.title = 'YouTube Video';
      }
    }

    // GitHub specific enhancements
    if (domain.includes('github.com')) {
      const path = urlObj.pathname.split('/').filter(Boolean);
      if (path.length >= 2) {
        metadata.title = `${path[0]}/${path[1]}`;
        metadata.description = `GitHub repository by ${path[0]}`;
      }
    }

    // Medium specific enhancements
    if (domain.includes('medium.com')) {
      // Medium articles often have a predictable image pattern
      // For now, we'll use Medium's logo as a fallback
      metadata.image = 'https://miro.medium.com/v2/resize:fit:1200/1*jfdwtvU6V6g99q3G7gq7dQ.png';

      // Extract author info
      const authorMatch = urlObj.pathname.match(/\/@([^\/]+)/);
      if (authorMatch) {
        const author = authorMatch[1];
        metadata.description = `Read this insightful article by ${author} on Medium`;
      }
    }

    // Dev.to specific enhancements
    if (domain.includes('dev.to')) {
      metadata.image =
        'https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png';
    }
  }

  private extractYouTubeVideoId(urlObj: URL): string | null {
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }

    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }

    return null;
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }
}

export const linkPreviewService = new LinkPreviewService();
