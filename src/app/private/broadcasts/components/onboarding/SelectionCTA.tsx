'use client';

import React from 'react';

import { Button, Card, CardBody, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import type { SelectionCTAProps } from '../../types';

export function SelectionCTA({
  selectedNames,
  minSelect = 5,
  isPending = false,
  onShuffle = () => {},
  onClear = () => {},
  onConfirm = () => {},
}: SelectionCTAProps) {
  const t = useTranslations('broadcasts.onboarding');

  return (
    <div className='fixed bottom-3 inset-x-4 z-20 mx-auto max-w-4xl'>
      <Card className='shadow-medium border-default-200'>
        <CardBody className='p-3 sm:p-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='min-w-0 flex-1'>
              <p className='text-sm text-foreground'>
                {t('selectTopics', { minSelect })}
                <span className='sr-only'>Minimum topic selection required</span>
              </p>
              <div className='mt-2 flex items-center gap-2 overflow-x-auto'>
                {selectedNames.length === 0 ? (
                  <p className='text-xs text-foreground-600'>{t('noTopicsSelected')}</p>
                ) : (
                  <>
                    {selectedNames.slice(0, 6).map((name) => (
                      <Chip 
                        key={name} 
                        variant='flat' 
                        size='sm' 
                        color='secondary'
                        className='flex-shrink-0'
                      >
                        {name}
                      </Chip>
                    ))}
                    {selectedNames.length > 6 && (
                      <Chip 
                        variant='bordered' 
                        size='sm'
                        className='flex-shrink-0'
                      >
                        {t('moreTopics', { count: selectedNames.length - 6 })}
                      </Chip>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Tooltip content={t('shuffleTooltip')} placement='top'>
                <Button
                  variant='flat'
                  size='sm'
                  onPress={onShuffle}
                  isDisabled={isPending}
                  startContent={<Icon icon='solar:shuffle-linear' className='h-4 w-4' />}
                >
                  {t('shuffleButton')}
                </Button>
              </Tooltip>

              <Button
                variant='light'
                size='sm'
                onPress={onClear}
                isDisabled={selectedNames.length === 0 || isPending}
              >
                {t('clearButton')}
              </Button>

              <Button
                color='primary'
                size='sm'
                onPress={onConfirm}
                isDisabled={selectedNames.length < minSelect || isPending}
                isLoading={isPending}
                endContent={!isPending && <Icon icon='solar:arrow-right-linear' className='h-4 w-4' />}
                className='bg-gradient-to-r from-primary to-secondary'
              >
                {t('confirmButton')}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}