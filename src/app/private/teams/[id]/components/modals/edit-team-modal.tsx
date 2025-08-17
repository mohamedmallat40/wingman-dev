import React, { useEffect, useState } from 'react';

import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';

import wingManApi from '@/lib/axios';

import { type Group, type Skill } from '../../types';

interface EditTeamModalProperties {
  isOpen: boolean;
  onClose: () => void;
  team: Group;
  onSave: () => void;
}

// Mock skills service - replace with your actual service
const getSkills = async (): Promise<Skill[]> => {
  // Replace with your actual skills API call
  const response = await wingManApi.get('/skills');
  return response.data;
};

const updateTeam = async (teamId: string, data: Group) => {
    // TODO: Implement ivalidate query
  const response = await wingManApi.put(`/groups`, data);

  if (!response.ok) {
    throw new Error('Failed to update team');
  }

  return response.data;
};

export const EditTeamModal: React.FC<EditTeamModalProperties> = ({
  isOpen,
  onClose,
  team,
  onSave
}) => {
  const [formData, setFormData] = useState({
    groupName: team.groupName,
    tagline: team.tagline || '',
    type: team.type == 'private' ? true : false,
    skills: team.skills.map((skill) => skill.id)
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set(team.skills.map((skill) => skill.id))
  );

  // Fetch available skills
  const { data: availableSkills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  // Reset form when team changes
  useEffect(() => {
    setFormData({
      groupName: team.groupName,
      tagline: team.tagline || '',
      type: team.type == 'private' ? true : false,
      skills: team.skills.map((skill) => skill.id)
    });
    setSelectedSkills(new Set(team.skills.map((skill) => skill.id)));
  }, [team]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleSkillSelectionChange = (keys: Set<string>) => {
    setSelectedSkills(keys);
    setFormData((previous) => ({
      ...previous,
      skills: [...keys]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Only make API call if there are changes
      if (Object.keys(formData).length > 0) {
        const requestData = {
          ...formData,
          color: '',
          icon: '',
          type: formData.type ? 'private' : 'public',
          id: team.id
        };
        await updateTeam(team.id, requestData);
        onSave(); // Trigger refetch
      }

      onClose();
    } catch (error) {
      console.error('Failed to update team:', error);
      // Handle error - you might want to show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedSkillsDisplay = () => {
    const selected = availableSkills.filter((skill) => selectedSkills.has(skill.id));
    return selected.map((skill) => (
      <Chip
        key={skill.id}
        onClose={() => {
          const newSelected = new Set(selectedSkills);
          newSelected.delete(skill.id);
          handleSkillSelectionChange(newSelected);
        }}
        variant='flat'
        color='primary'
        size='sm'
      >
        {skill.key}
      </Chip>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' scrollBehavior='inside' placement='center'>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <Icon icon='solar:pen-linear' className='h-5 w-5' />
            Edit Team Details
          </div>
          <p className='text-sm font-normal text-gray-600'>
            Update your team information and settings
          </p>
        </ModalHeader>

        <ModalBody className='py-4'>
          <div className='space-y-6'>
            {/* Team Name */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Team Name *</label>
              <Input
                value={formData.groupName}
                onChange={(e) => {
                  handleInputChange('groupName', e.target.value);
                }}
                placeholder='Enter team name'
                variant='bordered'
                isRequired
              />
            </div>

            {/* Tagline */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Tagline</label>
              <Textarea
                value={formData.tagline}
                onChange={(e) => {
                  handleInputChange('tagline', e.target.value);
                }}
                placeholder='Brief description of your team'
                variant='bordered'
                minRows={2}
                maxRows={4}
              />
            </div>

            {/* Skills */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Skills</label>
              <Select
                placeholder='Select team skills'
                variant='bordered'
                selectionMode='multiple'
                selectedKeys={selectedSkills}
                onSelectionChange={handleSkillSelectionChange}
                classNames={{
                  trigger: 'min-h-[60px]'
                }}
              >
                {availableSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.key}
                  </SelectItem>
                ))}
              </Select>

              {/* Selected Skills Display */}
              {selectedSkills.size > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>{getSelectedSkillsDisplay()}</div>
              )}
            </div>

            {/* Public/Private Toggle */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Visibility</label>
              <div className='flex items-center justify-between rounded-lg border border-gray-200 p-3'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>
                    {formData.public ? 'Public Team' : 'Private Team'}
                  </p>
                  <p className='text-xs text-gray-600'>
                    {formData.public
                      ? 'Anyone can discover and request to join this team'
                      : 'Only invited members can join this team'}
                  </p>
                </div>
                <Switch
                  isSelected={formData.type}
                  onValueChange={(value) => {
                    handleInputChange('type', value);
                  }}
                  color='primary'
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant='light' onPress={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSave}
            isLoading={isLoading}
            isDisabled={!formData.groupName.trim()}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
