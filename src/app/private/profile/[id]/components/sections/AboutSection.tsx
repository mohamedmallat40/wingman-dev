'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { type ProfileUser } from '../../types';
import { cn } from '../../utils/profile-styles';

interface AboutSectionProps {
  user: ProfileUser;
  isOwnProfile: boolean;
  onUpdate: (data: { aboutMe: string }) => Promise<void>;
  isLoading?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  user,
  isOwnProfile,
  onUpdate,
  isLoading = false
}) => {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(user.aboutMe || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!aboutText.trim()) return;
    
    setIsSaving(true);
    try {
      await onUpdate({ aboutMe: aboutText });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update about section:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setAboutText(user.aboutMe || '');
    setIsEditing(false);
  };

  const isEmpty = !user.aboutMe?.trim();

  return (
    <Card className={cn(
      'transition-all duration-200',
      isLoading && 'animate-pulse'
    )}>
      <CardHeader className='pb-3'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-default-100'>
              <Icon icon='solar:user-linear' className='h-5 w-5 text-default-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                {t('profileLocales.sections.about.title')}
              </h3>
              <p className='text-sm text-default-500'>
                {t('profileLocales.sections.about.description')}
              </p>
            </div>
          </div>
          
          {isOwnProfile && !isEditing && (
            <Button
              isIconOnly
              size='sm'
              variant='light'
              onPress={() => setIsEditing(true)}
              className='text-default-500 hover:text-primary'
            >
              <Icon icon='solar:pen-linear' className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {isEditing ? (
          <div className='space-y-4'>
            <Textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder={t('profileLocales.sections.about.placeholder')}
              minRows={4}
              maxRows={8}
              className='w-full'
            />
            <div className='flex gap-2 justify-end'>
              <Button
                size='sm'
                variant='light'
                onPress={handleCancel}
                isDisabled={isSaving}
              >
                {t('profileLocales.actions.cancel')}
              </Button>
              <Button
                size='sm'
                color='primary'
                onPress={handleSave}
                isLoading={isSaving}
                isDisabled={!aboutText.trim() || aboutText === user.aboutMe}
              >
                {t('profileLocales.actions.save')}
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {isEmpty ? (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-default-100'>
                  <Icon icon='solar:document-text-linear' className='h-8 w-8 text-default-400' />
                </div>
                <p className='text-sm text-default-500 mb-2'>
                  {t('profileLocales.sections.about.empty')}
                </p>
                {isOwnProfile && (
                  <Button
                    size='sm'
                    variant='flat'
                    color='primary'
                    onPress={() => setIsEditing(true)}
                    startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
                  >
                    {t('profileLocales.sections.about.addPrompt')}
                  </Button>
                )}
              </div>
            ) : (
              <div className='prose prose-sm max-w-none dark:prose-invert'>
                <p className='text-foreground leading-relaxed whitespace-pre-wrap'>
                  {user.aboutMe}
                </p>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};