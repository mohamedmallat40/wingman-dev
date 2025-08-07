'use client';

import React, { memo } from 'react';

import type { TalentPoolFilters } from '../types';

import AgencyList from './AgencyList';
// Import existing list components
import FreelancerList from './FreelancerList';
import TeamList from './TeamList';

interface CommonListProps {
  filters: TalentPoolFilters;
  onViewProfile: (userId: string) => void;
  onConnect: (userId: string) => void;
}

interface OptimizedFreelancerListProps extends CommonListProps {
  onCountChange: (count: number) => void;
}

interface OptimizedAgencyListProps extends CommonListProps {
  onCountChange: (count: number) => void;
}

interface OptimizedTeamListProps {
  filters: TalentPoolFilters;
  onViewTeam: (teamId: string) => void;
  onJoinTeam: (teamId: string) => void;
  onCountChange: (count: number) => void;
}

// Memoized components to prevent unnecessary re-renders
export const OptimizedFreelancerList = memo<OptimizedFreelancerListProps>(
  FreelancerList,
  (prevProps, nextProps) => {
    // Custom comparison logic - only re-render if filters actually changed
    return (
      JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
      prevProps.onViewProfile === nextProps.onViewProfile &&
      prevProps.onConnect === nextProps.onConnect &&
      prevProps.onCountChange === nextProps.onCountChange
    );
  }
);

export const OptimizedAgencyList = memo<OptimizedAgencyListProps>(
  AgencyList,
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
      prevProps.onViewProfile === nextProps.onViewProfile &&
      prevProps.onConnect === nextProps.onConnect &&
      prevProps.onCountChange === nextProps.onCountChange
    );
  }
);

export const OptimizedTeamList = memo<OptimizedTeamListProps>(TeamList, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
    prevProps.onViewTeam === nextProps.onViewTeam &&
    prevProps.onJoinTeam === nextProps.onJoinTeam &&
    prevProps.onCountChange === nextProps.onCountChange
  );
});

// Set display names for better debugging
OptimizedFreelancerList.displayName = 'OptimizedFreelancerList';
OptimizedAgencyList.displayName = 'OptimizedAgencyList';
OptimizedTeamList.displayName = 'OptimizedTeamList';
