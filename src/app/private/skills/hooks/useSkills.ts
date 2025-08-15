
import { useQuery } from '@tanstack/react-query';
import { getSkills } from '../services/skills.service';

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: false
  });
};
