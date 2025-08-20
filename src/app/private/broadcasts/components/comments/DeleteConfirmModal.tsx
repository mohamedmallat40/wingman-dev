'use client';

import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const t = useTranslations('comments');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="bg-danger/10 rounded-full p-2">
            <Icon icon="solar:trash-bin-minimalistic-linear" className="h-5 w-5 text-danger" />
          </div>
          <span className="text-foreground">Delete Comment</span>
        </ModalHeader>
        
        <ModalBody className="py-6">
          <p className="text-foreground-600">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="light" 
            onPress={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            color="danger" 
            onPress={onConfirm}
            isLoading={isLoading}
            startContent={
              !isLoading && <Icon icon="solar:trash-bin-minimalistic-linear" className="h-4 w-4" />
            }
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};