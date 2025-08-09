'use client';

import React, { useEffect, useState } from 'react';

import {
  Avatar,
  Button,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { getImageUrl } from '@/lib/utils/utilities';

import { type User } from '../../types';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface AssignTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAssignTags?: (userId: string, tagIds: string[]) => void;
}

const AssignTagsModal: React.FC<AssignTagsModalProps> = ({
  isOpen,
  onClose,
  user,
  onAssignTags
}) => {
  const t = useTranslations();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Mock tags data - replace with actual API call
  const mockTags: Tag[] = [
    { id: '1', name: 'Frontend Developer', color: '#3B82F6' },
    { id: '2', name: 'React Expert', color: '#10B981' },
    { id: '3', name: 'TypeScript', color: '#8B5CF6' },
    { id: '4', name: 'Node.js', color: '#059669' },
    { id: '5', name: 'UI/UX Designer', color: '#F59E0B' },
    { id: '6', name: 'Senior Level', color: '#DC2626' },
    { id: '7', name: 'Remote Work', color: '#6366F1' },
    { id: '8', name: 'Available Now', color: '#84CC16' },
    { id: '9', name: 'Full Stack', color: '#0EA5E9' },
    { id: '10', name: 'Team Lead', color: '#EC4899' }
  ];

  const tagColors = [
    '#3B82F6',
    '#10B981',
    '#8B5CF6',
    '#059669',
    '#F59E0B',
    '#DC2626',
    '#6366F1',
    '#84CC16',
    '#0EA5E9',
    '#EC4899'
  ];

  useEffect(() => {
    if (isOpen && user) {
      // Simulate fetching available tags
      setAvailableTags(mockTags);
    }
  }, [isOpen, user]);

  const handleTagToggle = (tagId: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTags(newSelected);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreatingTag(true);
    try {
      // Simulate tag creation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)] || '#3B82F6';
      const newTag: Tag = {
        id: `new-${Date.now()}`,
        name: newTagName.trim(),
        color: randomColor
      };

      setAvailableTags((prev) => [newTag, ...prev]);
      setSelectedTags((prev) => new Set([...prev, newTag.id]));
      setNewTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleSave = async () => {
    if (!user || selectedTags.size === 0) return;

    setIsLoading(true);
    try {
      await onAssignTags?.(user.id, Array.from(selectedTags));
      onClose();
    } catch (error) {
      console.error('Error assigning tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTags(new Set());
    setNewTagName('');
    onClose();
  };

  const getSelectedTagsData = () => {
    return availableTags.filter((tag) => selectedTags.has(tag.id));
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='xl'
      backdrop='blur'
      placement='center'
      scrollBehavior='inside'
      classNames={{
        base: 'bg-background dark:bg-content1',
        backdrop: 'bg-black/50 backdrop-blur-sm'
      }}
    >
      <ModalContent className='w-full max-w-xl rounded-[24px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'>
        <ModalHeader className='flex flex-col items-center pt-8 pb-6'>
          <div className='text-center'>
            <div className='mb-4'>
              <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px]'>
                <Icon icon='solar:tag-linear' className='text-primary h-8 w-8' />
              </div>
            </div>
            <h2 className='text-foreground mb-2 text-2xl font-bold tracking-[0.02em]'>
              {t('talentPool.modals.assignTags.title')}
            </h2>
            <p className='text-default-500 font-normal tracking-[0.02em]'>
              {t('talentPool.modals.assignTags.subtitle')}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className='gap-4 px-6'>
          {/* User Info */}
          <div className='bg-default-100 dark:bg-default-50 border-default-200 dark:border-default-100 flex items-center gap-3 rounded-[16px] border p-4'>
            <Avatar
              src={user.profileImage ? getImageUrl(user.profileImage) : undefined}
              name={`${user.firstName} ${user.lastName}`}
              className='h-12 w-12'
            />
            <div>
              <p className='text-foreground font-semibold'>
                {user.firstName} {user.lastName}
              </p>
              <p className='text-small text-default-500'>{user.profession || user.kind}</p>
            </div>
          </div>

          {/* Selected Tags Preview */}
          {selectedTags.size > 0 && (
            <>
              <Divider />
              <div className='space-y-2'>
                <h3 className='text-small text-foreground font-medium'>
                  {t('talentPool.modals.assignTags.selectedTags')} ({selectedTags.size})
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {getSelectedTagsData().map((tag) => (
                    <Chip
                      key={tag.id}
                      size='sm'
                      variant='flat'
                      onClose={() => handleTagToggle(tag.id)}
                      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                      startContent={<Icon icon='solar:hashtag-linear' className='h-3 w-3' />}
                    >
                      {tag.name}
                    </Chip>
                  ))}
                </div>
              </div>
            </>
          )}

          <Divider />

          {/* Create New Tag */}
          <div className='space-y-3'>
            <h3 className='text-medium font-semibold'>
              {t('talentPool.modals.assignTags.createNewTag')}
            </h3>
            <div className='flex gap-2'>
              <Input
                value={newTagName}
                onValueChange={setNewTagName}
                placeholder={t('talentPool.modals.assignTags.newTagPlaceholder')}
                size='sm'
                classNames={{
                  inputWrapper:
                    'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] bg-default-100 dark:bg-default-50',
                  input:
                    'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400'
                }}
                startContent={
                  <Icon icon='solar:hashtag-linear' className='text-default-400 h-4 w-4' />
                }
              />
              <Button
                size='sm'
                color='primary'
                variant='flat'
                onPress={handleCreateTag}
                isLoading={isCreatingTag}
                disabled={!newTagName.trim()}
                startContent={
                  !isCreatingTag ? <Icon icon='solar:add-circle-bold' className='h-4 w-4' /> : null
                }
              >
                {t('common.create')}
              </Button>
            </div>
          </div>

          <Divider />

          {/* Available Tags */}
          <div className='space-y-3'>
            <h3 className='text-medium font-semibold'>
              {t('talentPool.modals.assignTags.availableTags')}
            </h3>

            <div className='flex max-h-60 flex-wrap gap-2 overflow-y-auto p-2'>
              {availableTags.map((tag) => (
                <Chip
                  key={tag.id}
                  size='sm'
                  variant={selectedTags.has(tag.id) ? 'solid' : 'bordered'}
                  className='cursor-pointer transition-all hover:scale-105'
                  style={
                    selectedTags.has(tag.id)
                      ? { backgroundColor: tag.color, color: 'white' }
                      : { borderColor: tag.color, color: tag.color }
                  }
                  startContent={<Icon icon='solar:hashtag-linear' className='h-3 w-3' />}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </Chip>
              ))}
            </div>

            {availableTags.length === 0 && (
              <div className='text-default-500 p-4 text-center'>
                <Icon icon='solar:tag-linear' className='text-default-300 mx-auto mb-2 h-12 w-12' />
                <p className='text-small'>{t('talentPool.modals.assignTags.noTags')}</p>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter className='justify-end pt-4 pb-8'>
          <div className='flex gap-3'>
            <Button
              className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
              variant='bordered'
              onPress={handleClose}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              className='h-12 rounded-[16px] font-bold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
              color='primary'
              onPress={handleSave}
              isLoading={isLoading}
              disabled={selectedTags.size === 0}
              startContent={
                !isLoading ? <Icon icon='solar:check-linear' className='h-5 w-5' /> : null
              }
            >
              {t('common.save')} ({selectedTags.size})
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignTagsModal;
