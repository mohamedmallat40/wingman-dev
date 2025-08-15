import type { BreadcrumbItem, TabConfig } from '../types';

import { type TeamDetailsTab } from '../types';

export const TEAM_DETAIL_TABS: TabConfig[] = [
  {
    key: 'tools',
    label: 'Tools',
    icon: 'solar:widget-2-bold'
  },
  {
    key: 'members',
    label: 'Members',
    icon: 'solar:users-group-rounded-bold'
  },
  {
    key: 'projects',
    label: 'Projects',
    icon: 'solar:folder-with-files-bold'
  }
];

// ============================================================================
// BREADCRUMB CONFIGURATION
// ============================================================================

export const TEAM_DETAILS_BREADCRUMB_CONFIG: Record<string, BreadcrumbItem> = {
  HOME: {
    label: 'Dashboard',
    icon: 'solar:home-2-linear',
    href: '/dashboard'
  },
  TALENT_POOL: {
    label: 'Talent Pool',
    icon: 'solar:users-group-rounded-linear',
    href: '/talent-pool'
  },
  TEAMS: {
    label: 'Teams',
    icon: 'solar:users-group-rounded-linear',
    href: '/talent-pool?tab=teams'
  }
};

// ============================================================================
// TEAM COLORS
// ============================================================================

export const TEAM_COLORS = [
  { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Green', value: '#10B981', class: 'bg-green-500' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
  { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Orange', value: '#F97316', class: 'bg-orange-500' },
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' },
  { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' }
];

// ============================================================================
// PROJECT STATUS CONFIGURATION
// ============================================================================

export const PROJECT_STATUS_CONFIG = {
  PLANNING: {
    label: 'Planning',
    color: 'secondary',
    icon: 'solar:clock-circle-bold'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'primary',
    icon: 'solar:play-circle-bold'
  },
  ON_HOLD: {
    label: 'On Hold',
    color: 'warning',
    icon: 'solar:pause-circle-bold'
  },
  COMPLETED: {
    label: 'Completed',
    color: 'success',
    icon: 'solar:check-circle-bold'
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'danger',
    icon: 'solar:close-circle-bold'
  }
};

// ============================================================================
// PROJECT PRIORITY CONFIGURATION
// ============================================================================

export const PROJECT_PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    color: 'default',
    icon: 'solar:arrow-down-bold'
  },
  MEDIUM: {
    label: 'Medium',
    color: 'warning',
    icon: 'solar:minus-bold'
  },
  HIGH: {
    label: 'High',
    color: 'danger',
    icon: 'solar:arrow-up-bold'
  },
  URGENT: {
    label: 'Urgent',
    color: 'danger',
    icon: 'solar:double-alt-arrow-up-bold'
  }
};

// ============================================================================
// USER AVAILABILITY STATUS CONFIGURATION
// ============================================================================

export const AVAILABILITY_STATUS_CONFIG = {
  AVAILABLE: {
    label: 'Available',
    color: 'success',
    icon: 'solar:check-circle-bold'
  },
  BUSY: {
    label: 'Busy',
    color: 'warning',
    icon: 'solar:clock-circle-bold'
  },
  UNAVAILABLE: {
    label: 'Unavailable',
    color: 'danger',
    icon: 'solar:close-circle-bold'
  }
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

export const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const STAGGER_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const STAGGER_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Breadcrumb configuration
export const BREADCRUMB_CONFIG = {
  HOME: {
    label: 'Home',
    icon: 'solar:home-linear',
    href: '/private/dashboard'
  },
  TALENT_POOL: {
    label: 'Talent Pool',
    icon: 'solar:users-group-rounded-linear',
    href: '/private/talent-pool'
  },
  TEAMS: {
    label: 'Teams',
    icon: 'solar:users-group-two-rounded-linear',
    href: '/private/talent-pool?tab=teams'
  }
} as const;

// Tab configuration
export const TAB_CONFIG: Record<TeamDetailsTab, TabConfig> = {
  overview: {
    key: 'overview',
    label: 'Overview',
    icon: 'solar:document-text-linear'
  },
  members: {
    key: 'members',
    label: 'Members',
    icon: 'solar:users-group-rounded-linear'
  },
  tools: {
    key: 'tools',
    label: 'Tools',
    icon: 'solar:settings-linear'
  },
  projects: {
    key: 'projects',
    label: 'Projects',
    icon: 'solar:folder-linear'
  }
} as const;

// Default tab order
export const TAB_ORDER: TeamDetailsTab[] = ['overview', 'members', 'tools', 'projects'];

// Animation variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 }
  }
} as const;

// Status colors
export const STATUS_COLORS = {
  active: 'success',
  completed: 'primary',
  paused: 'warning',
  cancelled: 'danger'
} as const;

// Availability status colors
export const AVAILABILITY_COLORS = {
  available: 'success',
  busy: 'warning',
  unavailable: 'danger'
} as const;
