import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSkill as createSkillService } from '../services/skills.service';

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSkillService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    }
  });
};
