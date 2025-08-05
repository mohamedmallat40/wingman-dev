// Export all Talent Pool components for easy importing

export { default as TalentCard } from './TalentCard';
export { default as GroupCard } from './GroupCard';
export { default as HeroTabs } from './HeroTabs';
export { default as FreelancerList } from './FreelancerList';
export { default as AgencyList } from './AgencyList';
export { default as TeamList } from './TeamList';

// Re-export types for convenience
export type {
  User,
  Group,
  TalentType,
  TalentPoolFilters,
  TalentCardProps,
  TeamCardProps,
  UserResponse,
  TeamResponse,
  PaginationMeta
} from '../types';
