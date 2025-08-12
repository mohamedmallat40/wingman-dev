'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { SKILL_LEVELS, cn } from '../../utils/profile-styles';

interface Skill {
  key: string;
  type?: string;
  level?: keyof typeof SKILL_LEVELS;
}

interface SkillsSectionProps {
  skills: Skill[];
  isOwnProfile: boolean;
  onUpdate: (skills: Skill[]) => Promise<void>;
  isLoading?: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  isOwnProfile,
  onUpdate,
  isLoading = false
}) => {
  const t = useTranslations();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    const skillToAdd: Skill = {
      key: newSkill.trim(),
      type: 'TECHNICAL'
    };

    setIsSaving(true);
    try {
      await onUpdate([...skills, skillToAdd]);
      setNewSkill('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add skill:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill.key !== skillToRemove);
    
    setIsSaving(true);
    try {
      await onUpdate(updatedSkills);
    } catch (error) {
      console.error('Failed to remove skill:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getSkillColor = (index: number) => {
    const colors = ['primary', 'secondary', 'success', 'warning'] as const;
    return colors[index % colors.length];
  };

  const isEmpty = skills.length === 0;

  return (
    <Card className={cn(
      'transition-all duration-200',
      isLoading && 'animate-pulse'
    )}>
      <CardHeader className='pb-3'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-success/10'>
              <Icon icon='solar:medal-star-linear' className='h-5 w-5 text-success' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                Skills ({skills.length})
              </h3>
              <p className='text-sm text-default-500'>
                Your technical and professional skills
              </p>
            </div>
          </div>
          
          {isOwnProfile && !isAdding && (
            <Button
              isIconOnly
              size='sm'
              variant='light'
              color='success'
              onPress={() => setIsAdding(true)}
            >
              <Icon icon='solar:add-circle-linear' className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        <div className='space-y-4'>
          {isAdding && (
            <div className='flex gap-2'>
              <Input
                placeholder="Enter skill name"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className='flex-1'
                size='sm'
              />
              <Button
                size='sm'
                color='success'
                onPress={handleAddSkill}
                isLoading={isSaving}
                isDisabled={!newSkill.trim()}
              >
                Add
              </Button>
              <Button
                size='sm'
                variant='light'
                onPress={() => {
                  setIsAdding(false);
                  setNewSkill('');
                }}
                isDisabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}

          {isEmpty && !isAdding ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10'>
                <Icon icon='solar:medal-star-linear' className='h-8 w-8 text-success/60' />
              </div>
              <p className='text-sm text-default-500 mb-2'>
                No skills added yet
              </p>
              {isOwnProfile && (
                <Button
                  size='sm'
                  variant='flat'
                  color='success'
                  onPress={() => setIsAdding(true)}
                  startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
                >
                  Add your first skill
                </Button>
              )}
            </div>
          ) : (
            <div className='flex flex-wrap gap-2'>
              {skills.map((skill, index) => (
                <Chip
                  key={skill.key}
                  color={getSkillColor(index)}
                  variant='flat'
                  className='transition-all duration-200 hover:scale-105'
                  onClose={isOwnProfile ? () => handleRemoveSkill(skill.key) : undefined}
                >
                  {skill.key}
                  {skill.level && (
                    <span className='ml-1 text-xs opacity-75'>
                      ({skill.level.toLowerCase()})
                    </span>
                  )}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};