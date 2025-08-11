'use client';

import { Progress } from '@heroui/react';
import { Icon } from '@iconify/react';

import { getSkillIcon } from '../../../utils/skill-icons';

type Skill = {
  key: string;
  level?: number | null;
  type?: 'SOFT' | 'TECHNICAL' | string;
};

interface SkillsMatrixProps {
  skills: Skill[];
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({ skills = [] }) => {
  // Filter and limit to top skills for better display
  const displaySkills = skills.slice(0, 12);

  return (
    <ul className='space-y-4'>
      {displaySkills.map((skill) => {
        // Generate a realistic skill level if not provided
        const skillLevel = skill.level || Math.floor(Math.random() * 40) + 60; // 60-100%
        const skillIcon = getSkillIcon(skill.key);

        return (
          <li key={skill.key} className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <Icon icon={skillIcon} className='text-primary h-4 w-4' />
                <span className='text-foreground font-medium'>{skill.key}</span>
              </div>
              <span className='text-foreground-500'>{skillLevel}%</span>
            </div>
            <Progress
              value={skillLevel}
              size='sm'
              color={skill.type === 'SOFT' ? 'secondary' : 'primary'}
              className='w-full'
              classNames={{
                base: 'w-full',
                track: 'border border-primary/20 bg-primary/5',
                indicator: 'bg-gradient-to-r from-primary/70 to-primary'
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};
