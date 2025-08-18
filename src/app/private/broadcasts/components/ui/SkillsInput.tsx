'use client';

import { useMemo, useState } from 'react';

import { Autocomplete, AutocompleteItem, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { useCreateSkill } from '@/app/private/skills/hooks/useCreateSkill';
import { useSkills } from '@/app/private/skills/hooks/useSkills';
import { type Skill } from '@/app/private/skills/types';

interface SkillsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ value, onChange }) => {
  const t = useTranslations('broadcasts');
  const [inputValue, setInputValue] = useState('');
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();

  const availableSkills = useMemo(() => {
    if (!skills) return [];
    return skills;
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (!inputValue) return availableSkills;
    return availableSkills.filter((skill) =>
      skill.key.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [availableSkills, inputValue]);

  const selectedSkills = useMemo(() => {
    return availableSkills.filter((skill) => value.includes(skill.id));
  }, [availableSkills, value]);

  const handleSelectionChange = (key: any) => {
    if (!key || value.includes(key)) return;
    if (value.length < 10) {
      onChange([...value, key]);
    }
    setInputValue('');
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();

      // Check if skill already exists
      const existingSkill = availableSkills.find(
        (skill) => skill.key.toLowerCase() === inputValue.toLowerCase()
      );

      if (existingSkill) {
        handleSelectionChange(existingSkill.id);
        return;
      }

      // Create new skill
      if (value.length < 10) {
        try {
          const newSkill = await createSkill.mutateAsync({ key: inputValue.trim() });
          onChange([...value, newSkill.id]);
          setInputValue('');
        } catch (error) {
          console.error('Error creating skill:', error);
        }
      }
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    onChange(value.filter((id) => id !== skillId));
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-1'>
        <Autocomplete
          placeholder={t('placeholders.searchSkills')}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSelectionChange={handleSelectionChange}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          description={t('create.fields.skills.count', { current: value.length, max: 10 })}
          startContent={<Icon icon='solar:tag-circle-outline' className='text-success h-4 w-4' />}
          classNames={{
            base: 'w-full',
            listboxWrapper: 'max-h-64'
          }}
        >
          {[
            ...filteredSkills.map((skill) => (
              <AutocompleteItem
                key={skill.id}
                textValue={skill.key}
                startContent={<Icon icon='solar:tag-linear' className='h-4 w-4' />}
                classNames={{
                  base: 'hover:bg-success-50 dark:hover:bg-success-900/50 transition-colors duration-200'
                }}
              >
                {skill.key}
              </AutocompleteItem>
            )),
            ...(inputValue && filteredSkills.length === 0
              ? [
                  <AutocompleteItem
                    key='create-new'
                    textValue={t('create.fields.skills.createNew', { skill: inputValue })}
                    startContent={
                      <Icon icon='solar:add-circle-linear' className='text-success h-4 w-4' />
                    }
                    classNames={{
                      base: 'text-success hover:bg-success-50 dark:hover:bg-success-900/50'
                    }}
                  >
                    {t('create.fields.skills.createNew', { skill: inputValue })}
                  </AutocompleteItem>
                ]
              : [])
          ]}
        </Autocomplete>
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedSkills.map((skill) => (
            <Chip
              key={skill.id}
              variant='flat'
              color='success'
              size='sm'
              onClose={() => handleRemoveSkill(skill.id)}
              startContent={<Icon icon='solar:tag-linear' className='h-3 w-3' />}
              classNames={{
                base: 'hover:bg-success-100 dark:hover:bg-success-900 transition-colors',
                closeButton:
                  'text-default-500 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20'
              }}
            >
              {skill.key}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};
