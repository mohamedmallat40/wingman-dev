'use client';

import React from 'react';

import type { ContentTabProps } from './types';

import { Chip, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { SkillsInput } from '@/app/private/broadcasts/components/ui/SkillsInput';
import { MentionsTextarea } from '@/app/private/broadcasts/components/ui/MentionsTextarea';

export const ContentTab: React.FC<ContentTabProps> = ({
  control,
  errors,
  availableTopics,
  topicsLoading,
  watchedContent,
  watchedLink,
  wordCount,
  readTime,
  setValue,
  watchedTaggedUsers = []
}) => {
  const t = useTranslations('broadcasts');

  return (
    <div className='space-y-6 py-4'>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Controller
          name='title'
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={t('placeholders.engagingTitle')}
              startContent={
                <Icon icon='solar:text-field-outline' className='text-primary h-4 w-4' />
              }
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              description={`${field.value?.length || 0}/200 characters`}
              classNames={{
                inputWrapper:
                  'border-0 data-[hover=true]:border-0 group-data-[focus=true]:border-0 group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-primary/10 rounded-md bg-default-100/50 dark:bg-default-50/50 p-4 transition-all duration-300 shadow-sm hover:shadow-md group-data-[focus=true]:shadow-lg',
                input:
                  'text-foreground font-normal tracking-[0.01em] placeholder:text-default-400 text-base transition-all duration-200'
              }}
            />
          )}
        />
      </motion.div>

      {/* Topics Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Controller
          name='topics'
          control={control}
          render={({ field, fieldState }) => (
            <div className='space-y-1'>
              <Select
                placeholder={t('placeholders.selectTopics')}
                selectionMode='multiple'
                selectedKeys={new Set(field.value || [])}
                onSelectionChange={(keys) => {
                  const selectedArray = Array.from(keys) as string[];
                  if (selectedArray.length <= 3) {
                    field.onChange(selectedArray);
                  }
                }}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                isLoading={topicsLoading}
                description={`${field.value?.length || 0}/3 topics`}
                startContent={
                  <Icon icon='solar:hashtag-circle-outline' className='text-secondary h-4 w-4' />
                }
                renderValue={(items) => {
                  return (
                    <div className='flex flex-wrap gap-2'>
                      {items.map((item) => {
                        const topic = availableTopics.find((t) => t.id === item.key);
                        return (
                          <Chip
                            key={item.key}
                            variant='flat'
                            size='sm'
                            onClose={() => {
                              const newTopics = field.value.filter((id: string) => id !== item.key);
                              field.onChange(newTopics);
                            }}
                            startContent={
                              topic?.icon ? (
                                <Icon icon={topic.icon} className='h-3 w-3' />
                              ) : (
                                <Icon icon='solar:hashtag-linear' className='h-3 w-3' />
                              )
                            }
                            classNames={{
                              base: 'hover:bg-secondary-100 dark:hover:bg-secondary-900 transition-colors',
                              closeButton:
                                'text-default-500 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20'
                            }}
                          >
                            {topic?.title || t('fallbacks.loading')}
                          </Chip>
                        );
                      })}
                    </div>
                  );
                }}
              >
                {availableTopics.map((topic) => (
                  <SelectItem
                    key={topic.id}
                    textValue={topic.title}
                    startContent={
                      <Icon icon={topic.icon || 'solar:hashtag-linear'} className='h-4 w-4' />
                    }
                    description={topic.description}
                    classNames={{
                      base: 'hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors duration-200'
                    }}
                  >
                    {topic.title}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
        />
      </motion.div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Controller
          name='skills'
          control={control}
          render={({ field }) => <SkillsInput value={field.value} onChange={field.onChange} />}
        />
      </motion.div>

      {/* Link Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Controller
          name='link'
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={t('placeholders.addLink')}
              startContent={
                <Icon
                  icon='solar:link-broken-minimalistic-linear'
                  className='text-success h-4 w-4'
                />
              }
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              description={
                field.value && !fieldState.error
                  ? t('ui.linkPreviewValidUrl')
                  : t('ui.linkPreviewEnterValid')
              }
              classNames={{
                inputWrapper:
                  'border-0 data-[hover=true]:border-0 group-data-[focus=true]:border-0 group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-success/10 rounded-md bg-default-100/50 dark:bg-default-50/50 p-4 transition-all duration-300 shadow-sm hover:shadow-md group-data-[focus=true]:shadow-lg',
                input:
                  'text-foreground font-normal tracking-[0.01em] placeholder:text-default-400 text-base transition-all duration-200'
              }}
            />
          )}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Controller
          name='content'
          control={control}
          render={({ field, fieldState }) => (
            <MentionsTextarea
              value={field.value || ''}
              onChange={(value) => {
                field.onChange(value);
              }}
              onTaggedUsersChange={(userIds) => {
                // Update tagged users in the form when mentions are added
                if (setValue) {
                  setValue('taggedUsers', userIds);
                }
              }}
              placeholder={t('placeholders.shareThoughts')}
              minRows={10}
              maxRows={25}
              description={`${wordCount} words • ${readTime} min read`}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              enableMentions={true}
              classNames={{
                inputWrapper:
                  'border-0 data-[hover=true]:border-0 group-data-[focus=true]:border-0 group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-primary/10 rounded-md bg-default-100/50 dark:bg-default-50/50 p-4 transition-all duration-300 shadow-sm hover:shadow-md group-data-[focus=true]:shadow-lg',
                input:
                  'text-foreground font-normal tracking-[0.01em] placeholder:text-default-400 text-base leading-relaxed transition-all duration-200 resize-none'
              }}
            />
          )}
        />
      </motion.div>
    </div>
  );
};
