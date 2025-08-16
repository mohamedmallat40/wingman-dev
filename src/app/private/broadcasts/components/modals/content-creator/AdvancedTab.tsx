'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Select, SelectItem, Switch, Divider, Input } from '@heroui/react';

import type { AdvancedTabProps } from './types';

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ control }) => {
  const t = useTranslations('broadcasts');
  return (
    <div className="space-y-6 py-4">
      {/* Visibility Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        <h4 className="font-semibold">{t('forms.advanced.privacyVisibility')}</h4>

        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder={t('placeholders.whoCanSee')}
              selectedKeys={[field.value]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                field.onChange(selected);
              }}
            >
              <SelectItem
                key="public"
                startContent={
                  <Icon icon="solar:global-linear" className="h-4 w-4" />
                }
              >
{t('forms.advanced.visibility.public')}
              </SelectItem>
              <SelectItem
                key="followers"
                startContent={
                  <Icon
                    icon="solar:users-group-rounded-linear"
                    className="h-4 w-4"
                  />
                }
              >
{t('forms.advanced.visibility.followers')}
              </SelectItem>
              <SelectItem
                key="private"
                startContent={
                  <Icon icon="solar:lock-linear" className="h-4 w-4" />
                }
              >
{t('forms.advanced.visibility.private')}
              </SelectItem>
            </Select>
          )}
        />

        <div className="space-y-3">
          <Controller
            name="allowComments"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('forms.advanced.allowComments')}</p>
                  <p className="text-foreground-500 text-sm">
{t('forms.advanced.descriptions.allowComments')}
                  </p>
                </div>
                <Switch isSelected={field.value} onValueChange={field.onChange} />
              </div>
            )}
          />

          <Controller
            name="allowSharing"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('forms.advanced.allowSharing')}</p>
                  <p className="text-foreground-500 text-sm">
{t('forms.advanced.descriptions.allowSharing')}
                  </p>
                </div>
                <Switch isSelected={field.value} onValueChange={field.onChange} />
              </div>
            )}
          />

          <Controller
            name="contentWarning"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('forms.advanced.contentWarning')}</p>
                  <p className="text-foreground-500 text-sm">
{t('forms.advanced.descriptions.contentWarning')}
                  </p>
                </div>
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  color="warning"
                />
              </div>
            )}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
      </motion.div>

      {/* Schedule Publishing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="space-y-4"
      >
        <h4 className="font-semibold">{t('forms.advanced.publishingOptions')}</h4>

        <Controller
          name="scheduleDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="datetime-local"
              placeholder={t('placeholders.scheduleLater')}
              startContent={
                <Icon icon="solar:calendar-linear" className="h-4 w-4" />
              }
              value={
                field.value
                  ? new Date(field.value).toISOString().slice(0, 16)
                  : ''
              }
              onValueChange={(value) => {
                field.onChange(value ? new Date(value) : undefined);
              }}
            />
          )}
        />
      </motion.div>
    </div>
  );
};