'use client';

import React, { memo } from 'react';

import type { TalentPoolFilters } from '../../types';

import AgencyList from './AgencyList';
// Import existing list components
import FreelancerList from './FreelancerList';
import TeamList from './TeamList';

interface CommonListProps {
  filters: TalentPoolFilters;
  searchQuery?: string;
  onViewProfile: (userId: string) => void;
  onConnect: (userId: string) => void;
}

interface FreelancerListProps extends CommonListProps {
  onCountChange: (count: number) => void;
}

interface AgencyListProps extends CommonListProps {
  onCountChange: (count: number) => void;
}

interface TeamListProps {
  filters: TalentPoolFilters;
  searchQuery?: string;
  onViewTeam: (teamId: string) => void;
  onJoinTeam: (teamId: string) => void;
  onCountChange: (count: number) => void;
}

// Performance-optimized list components with memo() for efficient re-renders
export const FreelancerListContainer = memo<FreelancerListProps>(
  FreelancerList,
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
      prevProps.searchQuery === nextProps.searchQuery &&
      prevProps.onViewProfile === nextProps.onViewProfile &&
      prevProps.onConnect === nextProps.onConnect &&
      prevProps.onCountChange === nextProps.onCountChange
    );
  }
);

export const AgencyListContainer = memo<AgencyListProps>(AgencyList, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.onViewProfile === nextProps.onViewProfile &&
    prevProps.onConnect === nextProps.onConnect &&
    prevProps.onCountChange === nextProps.onCountChange
  );
});

export const TeamListContainer = memo<TeamListProps>(TeamList, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.onViewTeam === nextProps.onViewTeam &&
    prevProps.onJoinTeam === nextProps.onJoinTeam &&
    prevProps.onCountChange === nextProps.onCountChange
  );
});
// Set display names for better debugging
FreelancerListContainer.displayName = 'FreelancerListContainer';
AgencyListContainer.displayName = 'AgencyListContainer';
TeamListContainer.displayName = 'TeamListContainer';
