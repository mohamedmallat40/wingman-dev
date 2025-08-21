'use client';

import React, { memo } from 'react';

import type { TalentPoolFilters } from '../../types';

import AgencyList from './AgencyList';
// Import existing list components
import FreelancerList from './FreelancerList';
import TeamList from './TeamList';

interface CommonListProperties {
  filters: TalentPoolFilters;
  searchQuery?: string;
  onViewProfile: (userId: string) => void;
  onConnect: (userId: string) => void;
}

interface FreelancerListProperties extends CommonListProperties {
  onCountChange: (count: number) => void;
}

interface AgencyListProperties extends CommonListProperties {
  onCountChange: (count: number) => void;
}

interface TeamListProperties {
  filters: TalentPoolFilters;
  searchQuery?: string;
  onViewTeam: (teamId: string) => void;
  onJoinTeam: (teamId: string) => void;
  onCountChange: (count: number) => void;
}

// Performance-optimized list components with memo() for efficient re-renders
export const FreelancerListContainer = memo<FreelancerListProperties>(
  FreelancerList,
  (previousProperties, nextProperties) => {
    return (
      JSON.stringify(previousProperties.filters) === JSON.stringify(nextProperties.filters) &&
      previousProperties.searchQuery === nextProperties.searchQuery &&
      previousProperties.onViewProfile === nextProperties.onViewProfile &&
      previousProperties.onConnect === nextProperties.onConnect &&
      previousProperties.onCountChange === nextProperties.onCountChange
    );
  }
);

export const AgencyListContainer = memo<AgencyListProperties>(
  AgencyList,
  (previousProperties, nextProperties) => {
    return (
      JSON.stringify(previousProperties.filters) === JSON.stringify(nextProperties.filters) &&
      previousProperties.searchQuery === nextProperties.searchQuery &&
      previousProperties.onViewProfile === nextProperties.onViewProfile &&
      previousProperties.onConnect === nextProperties.onConnect &&
      previousProperties.onCountChange === nextProperties.onCountChange
    );
  }
);

export const TeamListContainer = memo<TeamListProperties>(
  TeamList,
  (previousProperties, nextProperties) => {
    return (
      JSON.stringify(previousProperties.filters) === JSON.stringify(nextProperties.filters) &&
      previousProperties.searchQuery === nextProperties.searchQuery &&
      previousProperties.onViewTeam === nextProperties.onViewTeam &&
      previousProperties.onJoinTeam === nextProperties.onJoinTeam &&
      previousProperties.onCountChange === nextProperties.onCountChange
    );
  }
);
// Set display names for better debugging
FreelancerListContainer.displayName = 'FreelancerListContainer';
AgencyListContainer.displayName = 'AgencyListContainer';
TeamListContainer.displayName = 'TeamListContainer';
