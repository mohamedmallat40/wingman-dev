// ============================================================================
// TALENT POOL COMPONENTS - ORGANIZED EXPORTS
// ============================================================================

// Card Components
export * from './cards';

// List Components
export * from './lists';

// Filter Components
export * from './filters';

// Modal Components
export * from './modals';

// Navigation Components
export * from './navigation';

// State Components
export * from './states';

// List container exports with old names
export {
  FreelancerListContainer as OptimizedFreelancerList,
  AgencyListContainer as OptimizedAgencyList,
  TeamListContainer as OptimizedTeamList
} from './lists';

// Re-export types for convenience
export type {
  User,
  Group,
  TalentType,
  TalentPoolFilters,
  TalentCardProperties,
  TeamCardProperties,
  UserResponse,
  TeamResponse,
  PaginationMeta,
  UserKind,
  WorkType,
  PaymentType,
  AvailabilityStatus,
  Currency
} from '../types';

// Export aliases for backward compatibility
export type { TalentCardProperties as TalentCardProps } from '../types';
export type { TeamCardProperties as TeamCardProps } from '../types';

// Re-export utilities
export * from '../utils/talent-utilities';
