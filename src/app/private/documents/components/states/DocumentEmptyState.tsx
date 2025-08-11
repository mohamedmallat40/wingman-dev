import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { ANIMATIONS } from '../../constants';

interface DocumentEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  illustration?: string;
  className?: string;
}

const DocumentEmptyState: React.FC<DocumentEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionIcon = 'solar:document-add-linear',
  onAction,
  illustration = 'solar:document-text-linear',
  className = ''
}) => {
  const t = useTranslations('documents');

  return (
    <motion.div
      className={`mt-10 flex flex-col items-center text-center ${className}`}
      {...ANIMATIONS.cardEnter}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className='mb-6'
      >
        <Icon icon={illustration} className='text-primary mx-auto block h-24 w-24' />
      </motion.div>

      <motion.h2
        className='text-foreground mb-2 text-2xl font-bold'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {title || t('emptyState.title')}
      </motion.h2>

      <motion.p
        className='text-default-600 dark:text-default-400 mb-6 max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {description || t('emptyState.description')}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button
            color='primary'
            size='lg'
            startContent={<Icon icon={actionIcon} className='h-5 w-5' />}
            onPress={onAction}
            className='font-medium shadow-lg transition-all duration-300 hover:shadow-xl'
          >
            {actionLabel || t('emptyState.uploadButton')}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DocumentEmptyState;
