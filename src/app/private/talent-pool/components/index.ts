// Export all Talent Pool components for easy importing

export { default as TalentCard } from './TalentCard';
export { default as GroupCard } from './GroupCard';
export { default as HeroTabs } from './HeroTabs';
export { default as FreelancerList } from './FreelancerList';
export { default as AgencyList } from './AgencyList';
export { default as TeamList } from './TeamList';
export { default as CountryFilter } from './CountryFilter';
export { default as AvailabilityFilter } from './AvailabilityFilter';
export { default as ExperienceLevelFilter } from './ExperienceLevelFilter';
export { default as ProfessionFilter } from './ProfessionFilter';
export { default as SearchAndFilters } from './SearchAndFilters';

// Export shared components
export * from './shared';

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
  PaginationMeta,
  UserKind,
  WorkType,
  PaymentType,
  AvailabilityStatus,
  Currency
} from '../types';

// Re-export utilities
export * from '../utils/talent-utils';
