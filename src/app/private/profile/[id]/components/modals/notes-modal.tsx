import React, { useState } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

import wingManApi from '@/lib/axios';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
  addToast
}) => {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) {
      addToast('Note content is required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await wingManApi.post(`/notes/${userId}`, {
        note: note.trim()
      });

      addToast('Note added successfully', 'success');
      onSuccess();
      setNote('');
      onClose();
    } catch (error: any) {
      console.error('Error adding note:', error);

      let errorMessage = 'Failed to add note';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to add notes.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='2xl'>
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='bg-info/20 rounded-xl p-2'>
            <Icon icon='solar:notes-linear' className='text-info h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold'>Add Note</h2>
            <p className='text-foreground-500 text-sm'>Add a personal note or observation</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <Textarea
              label='Note'
              placeholder='Write your note here...'
              value={note}
              onValueChange={setNote}
              minRows={4}
              maxRows={8}
              variant='bordered'
              classNames={{
                input: 'resize-none',
                inputWrapper: 'border-default-200 hover:border-info/50 focus-within:border-info'
              }}
            />
            <p className='text-tiny text-foreground-400'>{note.length}/1000 characters</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='light' onPress={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color='primary'
            onPress={handleSubmit}
            isLoading={isLoading}
            startContent={!isLoading && <Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
          >
            Add Note
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
