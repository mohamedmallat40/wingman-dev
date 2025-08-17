'use client';

import { useCallback, useEffect, useState } from 'react';
import { type Group } from '../types';
import { teamService } from '../services/teams.services';

interface UseTeamDetailsReturn {
  team: Group | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeamDetails = (teamId: string): UseTeamDetailsReturn => {
  const [team, setTeam] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamDetails = useCallback(async () => {
    if (!teamId?.trim()) {
      setError('Team ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const teamData = await teamService.getTeamById(teamId);
      setTeam(teamData);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch team details';
      setError(errorMessage);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  const refetch = useCallback(async () => {
    await fetchTeamDetails();
  }, [fetchTeamDetails]);

  useEffect(() => {
    void fetchTeamDetails();
  }, [fetchTeamDetails]);

  return {
    team,
    loading,
    error,
    refetch
  };
};