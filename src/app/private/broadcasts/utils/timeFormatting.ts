import { useTranslations } from 'next-intl';

/**
 * Smart time formatting utility for comments
 * Provides intelligent relative time display that adapts to different languages
 */

export interface TimeFormatOptions {
  locale?: string;
  precision?: 'short' | 'long';
  showSeconds?: boolean;
  maxDays?: number; // After this many days, show absolute date
}

export const useSmartTimeFormat = () => {
  const t = useTranslations('comments.time');

  const formatRelativeTime = (dateString: string, options: TimeFormatOptions = {}): string => {
    const { precision = 'short', showSeconds = false, maxDays = 7 } = options;

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Just now (less than 1 minute)
    if (diffInSeconds < 60) {
      return showSeconds && diffInSeconds > 0 ? `${diffInSeconds}s` : t('justNow');
    }

    // Minutes ago (less than 1 hour)
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return precision === 'short' ? `${minutes}m` : t('minutesAgo', { count: minutes });
    }

    // Hours ago (less than 24 hours)
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return precision === 'short' ? `${hours}h` : t('hoursAgo', { count: hours });
    }

    // Days ago (within maxDays)
    const days = Math.floor(diffInSeconds / 86400);
    if (days <= maxDays) {
      return precision === 'short' ? `${days}d` : t('daysAgo', { count: days });
    }

    // After maxDays, show absolute date
    return date.toLocaleDateString();
  };

  const formatTimeAgo = (dateString: string): string => {
    return formatRelativeTime(dateString, { precision: 'long' });
  };

  const formatTimeShort = (dateString: string): string => {
    return formatRelativeTime(dateString, { precision: 'short' });
  };

  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    formatRelativeTime,
    formatTimeAgo,
    formatTimeShort,
    formatFullDate
  };
};

/**
 * Smart pluralization helper for different languages
 */
export const useSmartPluralization = () => {
  const getPluralizationKey = (count: number, locale: string = 'en'): string => {
    // English pluralization rules
    if (locale === 'en') {
      return count === 1 ? 'one' : 'other';
    }

    // Dutch pluralization rules
    if (locale === 'nl') {
      return count === 1 ? 'one' : 'other';
    }

    // French pluralization rules (more complex)
    if (locale === 'fr') {
      if (count === 0) return 'zero';
      if (count === 1) return 'one';
      return 'other';
    }

    // Default fallback
    return count === 1 ? 'one' : 'other';
  };

  return { getPluralizationKey };
};

/**
 * Context-aware action formatting
 * Adapts actions based on user context and language
 */
export const useContextualActions = () => {
  const t = useTranslations('comments.actions');

  const getActionText = (
    action: string,
    context: {
      isOwner?: boolean;
      isLiked?: boolean;
      count?: number;
      locale?: string;
    } = {}
  ): string => {
    const { isOwner, isLiked, count = 0 } = context;

    switch (action) {
      case 'like':
        return isLiked ? t('unlike') : t('like');

      case 'edit':
        return isOwner ? t('edit') : '';

      case 'delete':
        return isOwner ? t('delete') : '';

      case 'reply':
        return t('reply');

      case 'share':
        return t('share');

      case 'report':
        return !isOwner ? t('report') : '';

      default:
        return t(action);
    }
  };

  const getActionIcon = (
    action: string,
    context: {
      isLiked?: boolean;
      isPinned?: boolean;
    } = {}
  ): string => {
    const { isLiked, isPinned } = context;

    const iconMap: Record<string, string> = {
      like: isLiked ? 'solar:heart-bold' : 'solar:heart-linear',
      reply: 'solar:chat-round-linear',
      share: 'solar:share-linear',
      edit: 'solar:pen-linear',
      delete: 'solar:trash-bin-linear',
      report: 'solar:flag-linear',
      pin: isPinned ? 'solar:bookmark-bold' : 'solar:bookmark-linear'
    };

    return iconMap[action] || 'solar:more-linear';
  };

  return { getActionText, getActionIcon };
};

/**
 * Smart count formatting for stats
 */
export const useSmartCountFormat = () => {
  const formatCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) {
      const k = Math.floor(count / 100) / 10;
      return k % 1 === 0 ? `${Math.floor(k)}K` : `${k}K`;
    }
    const m = Math.floor(count / 100000) / 10;
    return m % 1 === 0 ? `${Math.floor(m)}M` : `${m}M`;
  };

  const formatCountWithLabel = (
    count: number,
    labelKey: string,
    t: (key: string, values?: any) => string
  ): string => {
    if (count === 0) return '';

    const formattedCount = formatCount(count);
    return t(labelKey, { count });
  };

  return { formatCount, formatCountWithLabel };
};

/**
 * Mention parsing and formatting
 */
export const useMentionFormatting = () => {
  const parseMentions = (
    text: string | undefined | null
  ): {
    text: string;
    mentions: Array<{ username: string; startIndex: number; endIndex: number }>;
  } => {
    // Handle undefined, null, or empty text safely
    if (!text || typeof text !== 'string') {
      return { text: '', mentions: [] };
    }

    const mentionRegex = /@(\w+)/g;
    const mentions: Array<{ username: string; startIndex: number; endIndex: number }> = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push({
        username: match[1] || '',
        startIndex: match.index || 0,
        endIndex: (match.index || 0) + match[0].length
      });
    }

    return { text, mentions };
  };

  const formatMentionsToHTML = (text: string | undefined | null): string => {
    // Handle undefined, null, or empty text safely
    if (!text || typeof text !== 'string') {
      return '';
    }

    return text.replace(
      /@(\w+)/g,
      '<span class="text-primary font-medium hover:underline cursor-pointer" data-mention="$1">@$1</span>'
    );
  };

  return { parseMentions, formatMentionsToHTML };
};
