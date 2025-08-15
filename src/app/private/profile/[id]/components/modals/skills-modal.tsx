'use client';

import React, { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { type Skill } from 'modules/profile/types';
import { set } from 'zod';

import ConfirmDeleteModal from '@/app/private/components/confirm-delete';
import wingManApi from '@/lib/axios';

import { type SKILL_LEVELS } from '../../utils/profile-styles';

interface AvailableSkill {
  id: string;
  key: string;
  type?: string;
}

interface SkillsModalProperties {
  isOpen: boolean;
  onClose: () => void;
  userSkills: Skill[];
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

const SkillsModal: React.FC<SkillsModalProperties> = ({
  isOpen,
  onClose,
  userSkills,
  onSuccess,
  addToast
}) => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<AvailableSkill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedSkillKey, setSelectedSkillKey] = useState('');

  const [skillToDelete, setSkillToDelete] = useState<{
    skill: Skill | null;
    isOpen: boolean;
  }>({ skill: null, isOpen: false });

  useEffect(() => {
    if (isOpen) {
      setSelectedSkills([...userSkills]);
      fetchAvailableSkills();
    }
  }, [isOpen, userSkills]);

  const fetchAvailableSkills = async () => {
    setIsLoadingSkills(true);
    try {
      const response = await wingManApi.get('/skills');
      setAvailableSkills(response.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      addToast('Failed to load available skills', 'error');
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const getSkillColor = (index: number) => {
    const colors = ['primary', 'secondary', 'success', 'warning'] as const;
    return colors[index % colors.length];
  };

  const handleAddSkill = () => {
    if (!selectedSkillKey) return;

    const availableSkill = availableSkills.find((skill) => skill.id === selectedSkillKey);
    if (!availableSkill) return;

    const exists = selectedSkills.some((skill) => skill.key === availableSkill.key);
    if (exists) {
      addToast('Skill already added', 'error');
      return;
    }

    const newSkill: Skill = {
      id: selectedSkillKey,
      key: availableSkill.key,
      type: availableSkill.type as 'NORMAL' | 'SOFT'
    };

    setSelectedSkills((previous) => [...previous, newSkill]);
    setSelectedSkillKey('');
    setSearchValue('');
  };

  const handleRemoveSkill = (skillKey: string) => {
    setSelectedSkills((previous) => previous.filter((skill) => skill.key !== skillKey));
    setSkillToDelete({
      skill: selectedSkills.find((skill) => skill.key === skillKey),
      isOpen: true
    });
  };
  const confirmDeleteSkill = async () => {
    if (!skillToDelete.skill?.id) return;
    const skillToPatch = selectedSkills.map((skill) => skill.id);
    try {
      await wingManApi.patch(`/users/me`, { skills: skillToPatch });
      addToast('Skill deleted successfully', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error deleting skill:', error);

      addToast(errorMessage, 'error');
    }
  };
  const handleUpdateSkillLevel = (skillKey: string, level: keyof typeof SKILL_LEVELS) => {
    setSelectedSkills((previous) =>
      previous.map((skill) => (skill.key === skillKey ? { ...skill, level } : skill))
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Get skill IDs from the available skills based on selected skill names
      const skillIds = selectedSkills
        .map((selectedSkill) => {
          const availableSkill = availableSkills.find((skill) => skill.key === selectedSkill.key);
          return availableSkill?.id;
        })
        .filter(Boolean); // This removes undefined values

      // Update user skills by patching the skills array
      await wingManApi.patch('/users/me', {
        skills: skillIds
      });

      addToast('Skills updated successfully', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating skills:', error);

      let errorMessage = 'Failed to update skills';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSkills([]);
    setSelectedSkillKey('');
    setSearchValue('');
    onClose();
  };

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.key.toLowerCase().includes(searchValue.toLowerCase()) &&
      !selectedSkills.some((selected) => selected.key === skill.key)
  );

  const hasChanges = () => {
    if (selectedSkills.length !== userSkills.length) return true;

    return selectedSkills.some((selected) => {
      const original = userSkills.find((skill) => skill.key === selected.key);
      return !original || original.level !== selected.level;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='3xl'
      scrollBehavior='inside'
      isDismissable={!isLoading}
      closeButton={!isLoading}
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='bg-success/20 rounded-xl p-2'>
            <Icon icon='solar:medal-star-linear' className='text-success h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>Manage Skills</h2>
            <p className='text-foreground-500 text-sm'>
              Add, remove, or update your skills and proficiency levels
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className='space-y-6'>
            {/* Add new skill section */}
            <div className='space-y-3'>
              <h3 className='text-lg font-medium'>Add Skills</h3>
              <div className='flex gap-2'>
                <Autocomplete
                  label='Search skills'
                  placeholder='Type to search for skills...'
                  className='flex-1'
                  selectedKey={selectedSkillKey}
                  onSelectionChange={(key) => {
                    setSelectedSkillKey(key as string);
                  }}
                  inputValue={searchValue}
                  onInputChange={setSearchValue}
                  isLoading={isLoadingSkills}
                  isDisabled={isLoading}
                >
                  {filteredSkills.map((skill) => (
                    <AutocompleteItem key={skill.id}>
                      <div className='flex w-full items-center justify-between'>
                        <span>{skill.key}</span> {/* Use skill.name */}
                        {skill.category && (
                          <span className='text-tiny text-foreground-400'>{skill.category}</span>
                        )}
                      </div>
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Button
                  color='success'
                  onPress={handleAddSkill}
                  isDisabled={!selectedSkillKey || isLoading}
                  startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Selected skills section */}
            <div className='space-y-3'>
              <h3 className='text-lg font-medium'>Your Skills ({selectedSkills.length})</h3>

              {selectedSkills.length > 0 ? (
                <div className='max-h-60 space-y-3 overflow-y-auto'>
                  {selectedSkills.map((skill, index) => (
                    <div
                      key={skill.key} // Use skill.key instead of skill.id
                      className='bg-default-50 flex items-center justify-between rounded-lg p-3'
                    >
                      <div className='flex items-center gap-3'>
                        <Chip color={getSkillColor(index)} variant='flat' size='sm'>
                          {skill.key}
                        </Chip>
                        <span className='text-tiny text-foreground-400'>{skill.type}</span>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Button
                          isIconOnly
                          size='sm'
                          color='danger'
                          variant='light'
                          onPress={() => {
                            handleRemoveSkill(skill.key);
                          }}
                          isDisabled={isLoading}
                        >
                          <Icon icon='solar:trash-bin-trash-linear' className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center py-8 text-center'>
                  <div>
                    <Icon
                      icon='solar:medal-star-linear'
                      className='text-default-300 mx-auto mb-3 h-12 w-12'
                    />
                    <p className='text-foreground-500'>
                      No skills selected. Add some skills above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant='light' onPress={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!hasChanges()}
            startContent={
              isLoading ? undefined : <Icon icon='solar:check-linear' className='h-4 w-4' />
            }
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
      <ConfirmDeleteModal
        isOpen={skillToDelete.isOpen}
        onClose={() => {
          setSkillToDelete({ language: null, isOpen: false });
        }}
        onConfirm={confirmDeleteSkill}
        title='Delete skill'
        message={`Are you sure you want to delete ${skillToDelete.skill?.key} skill?`}
        itemName={skillToDelete.skill?.key}
      />
    </Modal>
  );
};

export default SkillsModal;
