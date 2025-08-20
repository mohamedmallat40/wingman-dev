import type { TalentType } from '../types';

// Tab configuration constants
export const TALENT_POOL_TABS = {
  FREELANCERS: 'freelancers' as const,
  AGENCIES: 'agencies' as const,
  TEAMS: 'teams' as const
} as const;

export const TAB_CONFIG = {
  [TALENT_POOL_TABS.FREELANCERS]: {
    label: 'Freelancers',
    icon: 'solar:user-linear',
    mobileIcon: 'solar:user-linear',
    description: 'Individual professionals'
  },
  [TALENT_POOL_TABS.AGENCIES]: {
    label: 'Agencies',
    icon: 'solar:buildings-linear',
    mobileIcon: 'solar:buildings-linear',
    description: 'Professional agencies'
  },
  [TALENT_POOL_TABS.TEAMS]: {
    label: 'Teams',
    icon: 'solar:users-group-rounded-linear',
    mobileIcon: 'solar:users-group-rounded-linear',
    description: 'Collaborative groups'
  }
} as const;

// Navigation and breadcrumb constants
export const BREADCRUMB_CONFIG = {
  HOME: {
    label: 'Home',
    href: '/private/dashboard',
    icon: 'solar:home-linear'
  },
  TALENT_POOL: {
    label: 'Talent Pool',
    href: '/private/talent-pool',
    icon: 'solar:users-group-rounded-linear'
  }
} as const;

export const TAB_BREADCRUMB_LABELS: Record<TalentType, string> = {
  freelancers: 'Freelancers',
  agencies: 'Agencies',
  teams: 'Teams'
} as const;

export const TAB_BREADCRUMB_ICONS: Record<TalentType, string> = {
  freelancers: 'solar:user-linear',
  agencies: 'solar:buildings-linear',
  teams: 'solar:users-group-rounded-linear'
} as const;

// Action items configuration
interface ActionItemConfig {
  key: string;
  label: string;
  icon: string;
  color: 'primary' | 'secondary';
  variant: 'solid' | 'flat';
  priority: 'primary' | 'secondary';
  tooltip: string;
}

export const ACTION_ITEMS: ActionItemConfig[] = [
  /* {
    key: 'invite',
    label: 'Invite',
    icon: 'solar:user-plus-linear',
    color: 'primary',
    variant: 'solid',
    priority: 'primary',
    tooltip: 'Invite new talent'
  }, */
  {
    key: 'create-team',
    label: 'Create Team',
    icon: 'solar:users-group-rounded-linear',
    color: 'secondary',
    variant: 'flat',
    priority: 'secondary',
    tooltip: 'Create new team'
  }
];

// Filter panel animation constants
export const FILTER_ANIMATION = {
  DURATION: 0.25,
  EASE: [0.4, 0.0, 0.2, 1] as const,
  OPACITY_DURATION: 0.15
} as const;

// Search debounce constants
export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 1
} as const;

// Performance constants
export const PERFORMANCE_CONFIG = {
  ITEMS_PER_PAGE: 12,
  PREFETCH_THRESHOLD: 5
} as const;
