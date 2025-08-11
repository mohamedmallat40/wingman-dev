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
    <div className='from-background to-default-50 dark:to-default-900/20 min-h-screen bg-gradient-to-b'>
      <div className='container mx-auto flex min-h-screen items-center justify-center px-4'>
        <Card className='border-danger/20 w-full max-w-md shadow-lg'>
          <CardBody className='p-8 text-center'>
            <div className='mb-6'>
              <div className='bg-danger/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
                <Icon icon='solar:user-broken' className='text-danger h-8 w-8' />
              </div>
              <h1 className='text-foreground mb-2 text-2xl font-bold'>
                {t('talentPool.profile.error.title')}
              </h1>
              <p className='text-foreground-500 leading-relaxed'>{error}</p>
            </div>

            <div className='space-y-3'>
              <Button
                color='primary'
                size='lg'
                startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
                onPress={onRetry}
                className='w-full'
              >
                {t('common.retry')}
              </Button>

              <Button
                variant='light'
                size='lg'
                startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
                onPress={onBack}
                className='w-full'
              >
                {t('common.back')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ErrorState;
