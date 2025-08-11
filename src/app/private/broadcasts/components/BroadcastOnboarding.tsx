'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { allTopics } from '../data/topics';
import type { Topic } from '../types';
import { BROADCAST_CONSTANTS } from '../constants';
import { TopicSelector, GradientBG } from './onboarding';

interface BroadcastOnboardingProps {
  onComplete: (selectedTopics: Topic[]) => void;
}

export default function BroadcastOnboarding({ onComplete }: BroadcastOnboardingProps) {
  const t = useTranslations('broadcasts.onboarding');
  
  const handleConfirm = (selectedIds: string[]) => {
    const selectedTopics = allTopics.filter(topic => selectedIds.includes(topic.id));
    onComplete(selectedTopics);
  };

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      <GradientBG />
      
      <div className='relative z-10 p-4 sm:p-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-8 sm:mb-12'>
            <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-4'>
              {t('title')}
            </h1>
            <p className='text-foreground-600 text-base sm:text-lg mb-6 max-w-2xl mx-auto'>
              {t('subtitle')}
            </p>
          </div>

          <TopicSelector
            topics={allTopics}
            minSelect={BROADCAST_CONSTANTS.MIN_TOPIC_SELECTION}
            rowCount={BROADCAST_CONSTANTS.DEFAULT_ROW_COUNT}
            durationSeconds={BROADCAST_CONSTANTS.DEFAULT_ANIMATION_DURATION}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}