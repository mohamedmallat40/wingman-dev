
'use client';

import { useState, useMemo } from 'react';
import { useSkills } from '@/app/private/skills/hooks/useSkills';
import { useCreateSkill } from '@/app/private/skills/hooks/useCreateSkill';
import { type Skill } from '@/app/private/skills/types';
import { Button, Input, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SkillsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();

  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    return skills.filter((skill) =>
      skill.key.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [skills, inputValue]);

  const handleSelectSkill = (skillId: string) => {
    if (!value.includes(skillId)) {
      onChange([...value, skillId]);
    }
    setInputValue('');
  };

  const handleCreateSkill = async () => {
    if (inputValue.trim() === '') return;

    const existingSkill = skills?.find(
      (skill) => skill.key.toLowerCase() === inputValue.toLowerCase()
    );

    if (existingSkill) {
      handleSelectSkill(existingSkill.id);
      return;
    }

    try {
      const newSkill = await createSkill.mutateAsync({ key: inputValue });
      handleSelectSkill(newSkill.id);
    } catch (error) {
      console.error('Error creating skill:', error);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    onChange(value.filter((id) => id !== skillId));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex gap-2">
          <Input
            placeholder="Enter skill and press Enter"
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateSkill()}
            startContent={<Icon icon="solar:tag-outline" className="text-success h-4 w-4" />}
          />
          <Button
            color="primary"
            variant="flat"
            onPress={handleCreateSkill}
            isDisabled={!inputValue.trim()}
          >
            Add
          </Button>
        </div>
        <span className="text-xs text-default-500">{value.length}/10 skills</span>
      </div>

      {isLoading && <div>Loading skills...</div>}

      {inputValue && filteredSkills.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Suggestions</h5>
          <div className="flex flex-wrap gap-2">
            {filteredSkills.map((skill) => (
              <Chip
                key={skill.id}
                variant="bordered"
                className="cursor-pointer"
                onClick={() => handleSelectSkill(skill.id)}
              >
                {skill.key}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((skillId) => {
            const skill = skills?.find((s) => s.id === skillId);
            return (
              <Chip
                key={skillId}
                onClose={() => handleRemoveSkill(skillId)}
                variant="flat"
                color="primary"
                startContent={<Icon icon="solar:tag-linear" className="h-3 w-3" />}
              >
                {skill ? skill.key : 'Loading...'}
              </Chip>
            );
          })}
        </div>
      )}
    </div>
  );
};
