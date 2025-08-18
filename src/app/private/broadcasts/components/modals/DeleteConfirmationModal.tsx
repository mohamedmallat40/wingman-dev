'use client';

import React from 'react';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

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
  title,
  description,
  confirmText,
  cancelText
}) => {
  const t = useTranslations('broadcasts');
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='md'
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
        <ModalHeader className='flex items-center gap-3 px-6 py-4'>
          <div className='bg-danger/10 rounded-full p-2'>
            <Icon icon='solar:trash-bin-minimalistic-bold' className='text-danger h-5 w-5' />
          </div>
          <div>
            <h3 className='text-foreground text-lg font-semibold'>
              {title || t('post.delete.title')}
            </h3>
          </div>
        </ModalHeader>

        <ModalBody className='px-6 py-4'>
          <p className='text-foreground-600 leading-relaxed'>
            {description || t('post.delete.description')}
          </p>

          <div className='bg-danger/5 border-danger/20 mt-4 rounded-lg border p-4'>
            <div className='flex items-start gap-3'>
              <Icon
                icon='solar:danger-circle-linear'
                className='text-danger mt-0.5 h-5 w-5 flex-shrink-0'
              />
              <div>
                <p className='text-danger mb-1 text-sm font-medium'>Warning</p>
                <p className='text-danger-600 text-sm'>
                  This action is permanent and cannot be reversed. All data associated with this
                  post will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className='px-6 py-4'>
          <div className='flex w-full justify-end gap-3'>
            <Button
              variant='flat'
              color='default'
              onPress={onClose}
              isDisabled={isLoading}
              className='min-w-20'
            >
              {cancelText || t('post.delete.cancel')}
            </Button>
            <Button
              color='danger'
              onPress={handleConfirm}
              isLoading={isLoading}
              isDisabled={isLoading}
              className='min-w-20'
              startContent={
                !isLoading ? (
                  <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                ) : undefined
              }
            >
              {isLoading ? t('common.loading') : confirmText || t('post.delete.confirm')}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
