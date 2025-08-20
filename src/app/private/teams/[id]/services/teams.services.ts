import wingManApi from '@/lib/axios';

import { type Group } from '../types';

export const teamService = {
  getTeamById: async (teamId: string): Promise<Group> => {
    try {
      const response = await wingManApi.get(`/groups/${teamId}`);
      return response.data as Group;
    } catch {
      throw new Error('Failed to fetch team details');
    }
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    try {
      await wingManApi.delete(`/groups/group/${teamId}`);
    } catch {
      throw new Error('Failed to delete team');
    }
  }
};
