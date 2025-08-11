/**
 * Utility functions for broadcast feature
 */

/**
 * Format timestamp to human-readable relative time
 */
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  // For older posts, show actual date
  return postDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Format engagement numbers (likes, comments, etc.) with appropriate suffixes
 */
export const formatEngagementCount = (count: number): string => {
  if (count === 0) return '0';
  
  if (count < 1000) {
    return count.toString();
  }
  
  if (count < 1000000) {
    const formatted = (count / 1000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`;
  }
  
  const formatted = (count / 1000000).toFixed(1);
  return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
};

/**
 * Generate a random color for topics/categories
 */
export const getTopicColor = (topic: string): string => {
  const colors = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'default'
  ];
  
  // Use topic string to consistently generate the same color
  const hash = topic.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Extract hashtags from text
 */
export const extractHashtags = (text: string): string[] => {
  const hashtagRegex = /#[\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
};

/**
 * Extract mentions from text
 */
export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@[\w]+/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
};

/**
 * Calculate estimated read time based on word count
 */
export const calculateReadTime = (text: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readTime); // Minimum 1 minute
};

/**
 * Validate if a URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get domain from URL
 */
export const getDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
};

/**
 * Generate a unique ID for posts
 */
export const generatePostId = (): string => {
  return `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Sort posts by various criteria
 */
export const sortPosts = (
  posts: any[], 
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending'
): any[] => {
  switch (sortBy) {
    case 'oldest':
      return [...posts].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    
    case 'popular':
      return [...posts].sort((a, b) => {
        const aScore = a.engagement.likes + a.engagement.comments + a.engagement.shares;
        const bScore = b.engagement.likes + b.engagement.comments + b.engagement.shares;
        return bScore - aScore;
      });
    
    case 'trending':
      return [...posts].sort((a, b) => {
        // Prioritize trending posts first, then by engagement
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        
        const aScore = a.engagement.likes + a.engagement.comments + a.engagement.shares;
        const bScore = b.engagement.likes + b.engagement.comments + b.engagement.shares;
        return bScore - aScore;
      });
    
    case 'newest':
    default:
      return [...posts].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }
};

/**
 * Filter posts by search query
 */
export const filterPostsBySearch = (posts: any[], query: string): any[] => {
  if (!query.trim()) return posts;
  
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.author.name.toLowerCase().includes(searchTerm) ||
    post.author.handle.toLowerCase().includes(searchTerm) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
  );
};