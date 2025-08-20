import React from 'react';

import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/ui';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const t = useTranslations('setup.welcome');

  return (
    <div className='space-y-8 text-center'>
      <div className='space-y-4'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100'>
          <CheckCircle className='h-10 w-10 text-blue-600' />
        </div>

        <h1 className='text-3xl font-bold text-gray-200'>{t('title')}</h1>

        <p className='mx-auto max-w-md text-lg text-gray-600'>{t('description')}</p>
      </div>
      <div className='inline-flex space-y-2'>
        <div className='mr-2 text-lg font-medium text-gray-200'>{t('label')}</div>
        <LanguageSwitcher /> {/* this shows the flag of the current language */} 
      </div>{' '}
      <button
        onClick={onNext}
        className='bg-default-600 inline-flex items-center space-x-2 rounded-lg px-8 py-3 font-medium text-gray-500 transition-colors hover:bg-blue-700 hover:text-white'
      >
        <span>{t('getStarted')}</span>
        <ArrowRight className='h-4 w-4' />
      </button>
      <p className='text-sm text-gray-500'>{t('timeRequired')}</p>
    </div>
  );
}
