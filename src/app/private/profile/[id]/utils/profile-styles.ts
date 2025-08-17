import { cn } from '@/lib/utils';

export { cn };

/**
 * Profile-specific styling utilities that complement HeroUI
 * Uses HeroUI's semantic colors and design tokens
 */

/**
 * Profile section configurations using HeroUI colors
 */
export const PROFILE_SECTIONS = {
  about: {
    color: 'default' as const,
    icon: 'solar:user-linear'
  },
  experience: {
    color: 'primary' as const,
    icon: 'solar:case-minimalistic-linear'
  },
  education: {
    color: 'secondary' as const,
    icon: 'solar:diploma-linear'
  },
  skills: {
    color: 'success' as const,
    icon: 'solar:medal-star-linear'
  },
  languages: {
    color: 'warning' as const,
    icon: 'solar:global-linear'
  },
  socialAccounts: {
    color: 'secondary' as const,
    icon: 'solar:share-linear'
  }
} as const;

/**
 * Social platform configurations with brand colors
 */
export const SOCIAL_PLATFORMS = {
  linkedin: {
    icon: 'solar:linkedin-linear',
    brandColor: '#0077B5',
    hoverClass: 'hover:bg-[#0077B5]/10'
  },
  github: {
    icon: 'solar:code-square-linear',
    brandColor: '#333333',
    hoverClass: 'hover:bg-default-100'
  },
  twitter: {
    icon: 'solar:twitter-linear',
    brandColor: '#1DA1F2',
    hoverClass: 'hover:bg-[#1DA1F2]/10'
  },
  instagram: {
    icon: 'solar:camera-linear',
    brandColor: '#E4405F',
    hoverClass: 'hover:bg-[#E4405F]/10'
  },
  facebook: {
    icon: 'solar:facebook-linear',
    brandColor: '#1877F2',
    hoverClass: 'hover:bg-[#1877F2]/10'
  },
  youtube: {
    icon: 'solar:videocamera-record-linear',
    brandColor: '#FF0000',
    hoverClass: 'hover:bg-[#FF0000]/10'
  },
  tiktok: {
    icon: 'solar:music-note-linear',
    brandColor: '#000000',
    hoverClass: 'hover:bg-default-100'
  },
  behance: {
    icon: 'solar:palette-linear',
    brandColor: '#1769FF',
    hoverClass: 'hover:bg-[#1769FF]/10'
  },
  dribbble: {
    icon: 'solar:basketball-linear',
    brandColor: '#EA4C89',
    hoverClass: 'hover:bg-[#EA4C89]/10'
  },
  medium: {
    icon: 'solar:pen-new-square-linear',
    brandColor: '#00AB6C',
    hoverClass: 'hover:bg-[#00AB6C]/10'
  },
  portfolio: {
    icon: 'solar:folder-open-linear',
    brandColor: '#6366F1',
    hoverClass: 'hover:bg-[#6366F1]/10'
  },
  other: {
    icon: 'solar:link-linear',
    brandColor: 'currentColor',
    hoverClass: 'hover:bg-default-100'
  }
} as const;

/**
 * Language proficiency levels using HeroUI colors
 */
export const LANGUAGE_LEVELS = {
  NATIVE: { color: 'success' as const, percentage: 100 },
  FLUENT: { color: 'success' as const, percentage: 95 },
  PROFESSIONAL: { color: 'primary' as const, percentage: 85 },
  CONVERSATIONAL: { color: 'secondary' as const, percentage: 70 },
  INTERMEDIATE: { color: 'warning' as const, percentage: 55 },
  BEGINNER: { color: 'default' as const, percentage: 35 },
  ELEMENTARY: { color: 'default' as const, percentage: 20 }
} as const;

/**
 * Skill levels using HeroUI colors
 */
export const SKILL_LEVELS = {
  EXPERT: { color: 'success' as const, percentage: 95 },
  ADVANCED: { color: 'primary' as const, percentage: 80 },
  INTERMEDIATE: { color: 'warning' as const, percentage: 60 },
  BEGINNER: { color: 'default' as const, percentage: 35 }
} as const;

export const SKILL_LEVEL_NAMES = {
  EXPERT: 'Expert',
  ADVANCED: 'Advanced',
  INTERMEDIATE: 'Intermediate',
  BEGINNER: 'Beginner'
} as const;

/**
 * Availability status using HeroUI colors
 */
export const AVAILABILITY_STATUS = {
  AVAILABLE: { color: 'success' as const, pulse: true },
  BUSY: { color: 'warning' as const, pulse: false },
  UNAVAILABLE: { color: 'danger' as const, pulse: false }
} as const;

/**
 * Connection status using HeroUI colors
 */
export const CONNECTION_STATUS = {
  connected: {
    color: 'success' as const,
    icon: 'solar:check-circle-linear',
    label: 'Connected'
  },
  pending: {
    color: 'warning' as const,
    icon: 'solar:clock-circle-linear',
    label: 'Pending'
  },
  notConnected: {
    color: 'default' as const,
    icon: 'solar:user-plus-linear',
    label: 'Connect'
  }
} as const;

/**
 * Common animation classes
 */
export const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  bounce: 'animate-bounce-gentle',
  pulse: 'animate-pulse',
  spin: 'animate-spin'
} as const;

/**
 * Responsive grid utilities
 */
export const getResponsiveGrid = (columns: 1 | 2 | 3 | 4 = 2) => {
  const grids = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };
  return `grid ${grids[columns]} gap-4`;
};

/**
 * Spacing utilities
 */
export const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
  const spacing = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };
  return spacing[size];
};

/**
 * Get social platform icon with brand styling
 */
export const getSocialIcon = (platform: keyof typeof SOCIAL_PLATFORMS) => {
  return SOCIAL_PLATFORMS[platform];
};

/**
 * Get section configuration
 */
export const getSectionConfig = (section: keyof typeof PROFILE_SECTIONS) => {
  return PROFILE_SECTIONS[section];
};

/**
 * Type definitions for better TypeScript support
 */
export type HeroUIColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type HeroUISize = 'sm' | 'md' | 'lg';
export type HeroUIVariant = 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;
export type ProfileSection = keyof typeof PROFILE_SECTIONS;
