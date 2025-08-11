import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { ANIMATIONS } from '../../constants';

interface DocumentErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: string;
  onRetry?: () => void;
  error?: Error | null;
  className?: string;
}

const DocumentErrorState: React.FC<DocumentErrorStateProps> = ({
  title,
  description,
  actionLabel,
  actionIcon = 'solar:refresh-linear',
  onRetry,
  error,
  className = ''
}) => {
  const t = useTranslations('documents');

  return (
    <motion.div
      className={`mt-10 flex flex-col items-center text-center ${className}`}
      {...ANIMATIONS.cardEnter}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className='mb-6'
      >
        <Icon icon='solar:danger-triangle-bold' className='text-danger mx-auto block h-24 w-24' />
      </motion.div>

      <motion.h2
        className='text-foreground mb-2 text-2xl font-bold'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {title || t('errorState.title')}
      </motion.h2>

      <motion.p
        className='text-default-600 dark:text-default-400 mb-4 max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {description || t('errorState.description')}
      </motion.p>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className='mb-6 max-w-md'
        >
          <details className='text-left'>
            <summary className='text-default-500 hover:text-default-700 cursor-pointer text-sm transition-colors'>
              View error details
            </summary>
            <div className='bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800/30 mt-2 rounded-lg border p-3'>
              <code className='text-danger-600 dark:text-danger-400 text-xs break-all'>
                {error.message}
              </code>
            </div>
          </details>
        </motion.div>
      )}

      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button
            color='danger'
            variant='bordered'
            size='lg'
            startContent={<Icon icon={actionIcon} className='h-5 w-5' />}
            onPress={onRetry}
            className='hover:bg-danger-50 dark:hover:bg-danger-900/20 font-medium transition-all duration-300'
          >
            {actionLabel || t('errorState.retryButton')}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DocumentErrorState;
