'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Select, SelectItem, Switch, Divider, Input } from '@heroui/react';

import type { AdvancedTabProps } from './types';

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ control }) => {
  return (
    <div className="space-y-6 py-4">
      {/* Visibility Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        <h4 className="font-semibold">Privacy & Visibility</h4>

        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Who can see this post?"
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
                Public - Everyone can see
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
                Followers only
              </SelectItem>
              <SelectItem
                key="private"
                startContent={
                  <Icon icon="solar:lock-linear" className="h-4 w-4" />
                }
              >
                Private - Only you
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
                  <p className="font-medium">Allow Comments</p>
                  <p className="text-foreground-500 text-sm">
                    Let people comment on your post
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
                  <p className="font-medium">Allow Sharing</p>
                  <p className="text-foreground-500 text-sm">
                    Let people share your post
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
                  <p className="font-medium">Content Warning</p>
                  <p className="text-foreground-500 text-sm">
                    Mark if content might be sensitive
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
        <h4 className="font-semibold">Publishing Options</h4>

        <Controller
          name="scheduleDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="datetime-local"
              placeholder="Schedule for later (optional)"
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