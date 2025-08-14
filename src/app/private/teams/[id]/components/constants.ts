import { type TabConfig, type TeamDetailsTab } from '../types';

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

// Team colors mapping
export const TEAM_COLORS = {
  primary: 'bg-primary-100 text-primary-600',
  secondary: 'bg-secondary-100 text-gray-300',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  danger: 'bg-danger-100 text-danger-600',
  default: 'bg-default-100 text-default-600'
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
