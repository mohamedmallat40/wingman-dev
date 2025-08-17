import { wingManApi } from '@/lib/axios';

import { API_ROUTES } from '../../../../lib/api-routes';
import { type Skill } from '../types';

export const getSkills = async () => {
  const response = await wingManApi.get<Skill[]>(API_ROUTES.profile.skills.getAll);
  return response.data;
};

export const createSkill = async (skill: { key: string }) => {
  const response = await wingManApi.post<Skill>(API_ROUTES.profile.skills.create, skill);
  return response.data;
};
