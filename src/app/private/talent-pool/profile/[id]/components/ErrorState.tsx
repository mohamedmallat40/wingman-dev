'use client';

import React from 'react';

import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onBack }) => {
  const t = useTranslations();

  return (
    <div className='from-background to-default-50 dark:to-default-900/20 flex min-h-screen items-center justify-center bg-gradient-to-b p-4'>
      <Card className='w-full max-w-md'>
        <CardBody className='p-8 text-center'>
          <div className='mb-6'>
            <Icon
              icon='solar:danger-triangle-linear'
              className='text-danger mx-auto mb-4 h-16 w-16'
            />
            <h1 className='text-foreground mb-2 text-xl font-semibold'>
              {t('talentPool.profile.error.title')}
            </h1>
            <p className='text-foreground-600'>
              {error === 'User not found'
                ? t('talentPool.profile.error.userNotFound')
                : t('talentPool.profile.error.generic')}
            </p>
          </div>

          <div className='space-y-3'>
            <Button
              color='primary'
              onPress={onRetry}
              startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
              className='w-full'
            >
              {t('common.retry')}
            </Button>

            <Button
              variant='light'
              onPress={onBack}
              startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
              className='w-full'
            >
              {t('common.back')}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ErrorState;
