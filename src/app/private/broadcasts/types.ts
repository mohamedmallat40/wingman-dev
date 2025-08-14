export interface BroadcastPost {
  id: string;
  type: 'text';
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    handle: string;
  };
  timestamp: string;
  tags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
    views: number;
  };
  media?: {
    type: 'video' | 'image' | 'gallery';
    url: string | string[];
    thumbnail?: string;
    duration?: string;
    aspectRatio?: 'landscape' | 'portrait' | 'square';
    isShort?: boolean;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  category: string;
  topic?: {
    id: string;
    name: string;
    icon: string;
  };
  priority?: 'low' | 'normal' | 'high';
  readTime?: number;
  isTrending?: boolean;
  shareUrl?: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
    handle: string;
  };
  content: string;
  timestamp: string;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  replies?: Comment[];
  isPinned?: boolean;
  isAuthor?: boolean;
  isEdited?: boolean;
  editedAt?: string;
}

export interface PostInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'bookmark' | 'share' | 'view';
  timestamp: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  postCount?: number;
  isSubscribed?: boolean;
}
