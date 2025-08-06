'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  titleKey?: string;
  descriptionKey?: string;
  onRetry: () => void;
  retryButtonTextKey?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  titleKey = 'talentPool.errorStates.freelancers.title',
  descriptionKey = 'talentPool.errorStates.freelancers.description',
  onRetry,
  retryButtonTextKey = 'talentPool.errorStates.tryAgain'
}) => {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='py-16 text-center'
    >
      <div className='mb-6'>
        <Icon icon='solar:danger-circle-linear' className='text-danger-300 mx-auto mb-4 h-24 w-24' />
        <h3 className='text-default-700 mb-2 text-xl font-semibold'>{t(titleKey)}</h3>
        <p className='text-default-500 mx-auto max-w-md'>{t(descriptionKey)}</p>
      </div>
      <Button
        color='danger'
        variant='flat'
        startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
        onPress={onRetry}
      >
        {t(retryButtonTextKey)}
      </Button>
    </motion.div>
  );
};

export default ErrorState;