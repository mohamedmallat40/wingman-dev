'use client';

import React, { useState } from 'react';

import {
  Avatar,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { getImageUrl } from '@/lib/utils/utilities';

import { type User } from '../../types';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSaveNote?: (userId: string, note: string) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, user, onSaveNote }) => {
  const t = useTranslations();
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !note.trim()) return;

    setIsLoading(true);
    try {
      await onSaveNote?.(user.id, note.trim());
      setNote('');
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNote('');
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='lg'
      backdrop='blur'
      placement='center'
      classNames={{
        base: 'bg-background dark:bg-content1',
        backdrop: 'bg-black/50 backdrop-blur-sm'
      }}
    >
      <ModalContent className='w-full max-w-lg rounded-[24px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'>
        <ModalHeader className='flex flex-col items-center pt-8 pb-6'>
          <div className='text-center'>
            <div className='mb-4'>
              <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px]'>
                <Icon icon='solar:document-text-linear' className='text-primary h-8 w-8' />
              </div>
            </div>
            <h2 className='text-foreground mb-2 text-2xl font-bold tracking-[0.02em]'>
              {t('talentPool.modals.addNote.title')}
            </h2>
            <p className='text-default-500 font-normal tracking-[0.02em]'>
              {t('talentPool.modals.addNote.subtitle')}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className='px-6'>
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

          <Divider />

          {/* Note Input */}
          <div className='space-y-2'>
            <label className='text-small text-foreground font-medium'>
              {t('talentPool.modals.addNote.noteLabel')}
            </label>
            <Textarea
              value={note}
              onValueChange={setNote}
              placeholder={t('talentPool.modals.addNote.notePlaceholder')}
              minRows={4}
              maxRows={8}
              classNames={{
                base: 'w-full',
                inputWrapper:
                  'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] bg-default-100 dark:bg-default-50',
                input:
                  'resize-none text-foreground font-normal tracking-[0.02em] placeholder:text-default-400'
              }}
            />
            <p className='text-tiny text-default-400'>
              {note.length}/500 {t('talentPool.modals.addNote.charactersRemaining')}
            </p>
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
              disabled={!note.trim() || note.length > 500}
              startContent={
                !isLoading ? <Icon icon='solar:check-linear' className='h-5 w-5' /> : null
              }
            >
              {t('common.save')}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddNoteModal;
