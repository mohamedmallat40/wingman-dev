'use client';

import React from 'react';

import type { FooterActionsProps } from './types';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const FooterActions: React.FC<FooterActionsProps> = ({
  onSaveDraft,
  onClearForm,
  onClose,
  onSubmit,
  isSavingDraft,
  isPublishing,
  isValid,
  isUploading,
  isDirty,
  hasFormChanges,
  persistedFormData,
  initialData,
  isEditMode
}) => {
  const tCommon = useTranslations('common');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className='flex w-full items-center justify-between'
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className='flex gap-2'
      >
        <Button
          variant='flat'
          onPress={onSaveDraft}
          isLoading={isSavingDraft}
          startContent={!isSavingDraft && <Icon icon='solar:diskette-linear' className='h-4 w-4' />}
          className='transition-transform duration-200 hover:scale-105'
        >
          {tCommon('save')} Draft
        </Button>
        {(persistedFormData || isDirty) && (
          <Button
            variant='light'
            color='danger'
            onPress={() => {
              onClearForm();
              onClose();
            }}
            startContent={<Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />}
            className='transition-transform duration-200 hover:scale-105'
          >
            Discard
          </Button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className='flex gap-2'
      >
        <Button
          variant='light'
          onPress={onClose}
          className='transition-transform duration-200 hover:scale-105'
        >
          {tCommon('cancel')}
        </Button>
        <Button
          color='primary'
          onPress={onSubmit}
          isLoading={isPublishing}
          isDisabled={!isValid || isUploading || (isEditMode && !hasFormChanges)}
          startContent={
            !isPublishing && <Icon icon='solar:send-square-linear' className='h-4 w-4' />
          }
          className='transition-all duration-300 hover:scale-105 hover:shadow-lg'
        >
          {isEditMode ? 'Update Post' : 'Publish Post'}
        </Button>
      </motion.div>
    </motion.div>
  );
};
