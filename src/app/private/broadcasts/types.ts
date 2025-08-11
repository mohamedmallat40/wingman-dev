export interface Topic {
  id: string;
  name: string;
  category: string;
  image: string;
  featured?: boolean;
  description?: string;
}

export interface BroadcastPreferences {
  selectedTopics: Topic[];
  isFirstTime: boolean;
  lastUpdated: string;
}

export interface BroadcastPost {
  id: string;
  type: 'article' | 'video' | 'image' | 'poll' | 'quote';
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
  };
  media?: {
    type: 'video' | 'image';
    url: string;
    thumbnail?: string;
    duration?: string;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  category: string;
  subcast?: {
    id: string;
    name: string;
    icon: string;
  };
}

export interface TopicSelectorProps {
  topics?: Topic[];
  minSelect?: number;
  rowCount?: number;
  durationSeconds?: number;
  gap?: number;
  cardHeight?: number;
  rowTitles?: string[];
  pauseOnHover?: boolean;
  initialSelectedIds?: string[];
  onConfirm?: (selectedIds: string[]) => void;
}

export interface CategoryChipsProps {
  categories: string[];
  active?: string;
  onChange?: (category: string) => void;
  className?: string;
}

export interface RailRowProps {
  topics: Topic[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  reverse?: boolean;
  gap?: number;
  cardHeight?: number;
  aspect?: number;
  durationSeconds?: number;
  pauseOnHover?: boolean;
}

export interface RailCardProps {
  topic: Topic;
  isSelected: boolean;
  onToggle: (id: string) => void;
  width: number;
  height: number;
  gap: number;
}

export interface SelectionCTAProps {
  selectedNames: string[];
  minSelect?: number;
  isPending?: boolean;
  onShuffle?: () => void;
  onClear?: () => void;
  onConfirm?: () => void;
}