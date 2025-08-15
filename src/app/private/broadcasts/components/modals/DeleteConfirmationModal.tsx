'use client';

import React from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Delete Post',
  description = 'Are you sure you want to delete this post? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      classNames={{
        base: 'bg-content1',
        backdrop: 'bg-black/50',
        header: 'border-b border-divider',
        footer: 'border-t border-divider'
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut'
            }
          },
          exit: {
            y: -10,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: 'easeIn'
            }
          }
        }
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 py-4 px-6">
          <div className="bg-danger/10 rounded-full p-2">
            <Icon 
              icon="solar:trash-bin-minimalistic-bold" 
              className="h-5 w-5 text-danger" 
            />
          </div>
          <div>
            <h3 className="text-foreground text-lg font-semibold">
              {title}
            </h3>
          </div>
        </ModalHeader>

        <ModalBody className="px-6 py-4">
          <p className="text-foreground-600 leading-relaxed">
            {description}
          </p>
          
          <div className="mt-4 p-4 bg-danger/5 border border-danger/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon 
                icon="solar:danger-circle-linear" 
                className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" 
              />
              <div>
                <p className="text-danger text-sm font-medium mb-1">
                  Warning
                </p>
                <p className="text-danger-600 text-sm">
                  This action is permanent and cannot be reversed. All data associated with this post will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-4">
          <div className="flex gap-3 w-full justify-end">
            <Button
              variant="flat"
              color="default"
              onPress={onClose}
              isDisabled={isLoading}
              className="min-w-20"
            >
              {cancelText}
            </Button>
            <Button
              color="danger"
              onPress={handleConfirm}
              isLoading={isLoading}
              isDisabled={isLoading}
              className="min-w-20"
              startContent={
                !isLoading ? (
                  <Icon icon="solar:trash-bin-minimalistic-linear" className="h-4 w-4" />
                ) : undefined
              }
            >
              {isLoading ? 'Deleting...' : confirmText}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};