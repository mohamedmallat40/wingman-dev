'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react';

import { getBaseUrl } from '@/lib/utils/utilities';
import { SmartMediaPreview } from '../../ui/SmartMediaPreview';
import type { PreviewSectionProps } from './types';

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  watchedTitle,
  watchedContent,
  watchedTopics,
  watchedSkills,
  availableTopics,
  mediaFiles,
  setMediaFiles,
  wordCount,
  readTime,
  profileLoading,
  currentUser
}) => {
  return (
    <div className="sticky top-0 space-y-4">
      <h4 className="text-foreground flex items-center gap-2 font-semibold">
        <Icon icon="solar:eye-linear" className="h-4 w-4" />
        Live Preview
      </h4>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="bg-background overflow-hidden border-0 shadow-xl ring-1 shadow-black/5 ring-black/5 dark:shadow-black/20 dark:ring-white/10">
          <CardBody className="p-0">
            {/* Header */}
            <div className="flex items-start gap-3 p-6 pb-4">
              {profileLoading ? (
                <>
                  <div className="bg-default-200 h-12 w-12 animate-pulse rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-default-200 h-4 w-32 animate-pulse rounded" />
                    <div className="bg-default-200 h-3 w-24 animate-pulse rounded" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar
                    size="md"
                    src={
                      currentUser?.profileImage
                        ? `${getBaseUrl()}/upload/${currentUser.profileImage}`
                        : undefined
                    }
                    name={
                      currentUser
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : 'User'
                    }
                    showFallback
                    className="ring-primary/20 ring-2"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="text-foreground truncate font-semibold">
                        {currentUser
                          ? `${currentUser.firstName} ${currentUser.lastName}`
                          : 'Your Name'}
                      </h4>
                      <Icon
                        icon="solar:verified-check-bold"
                        className="text-primary h-4 w-4 flex-shrink-0"
                      />
                    </div>
                    <div className="text-foreground-500 flex items-center gap-1 text-xs">
                      <span>
                        @
                        {currentUser
                          ? `${currentUser.firstName}_${currentUser.lastName}`
                          : 'username'}
                      </span>
                      <span>•</span>
                      <span>just now</span>
                      <Icon icon="solar:global-linear" className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-foreground-400 hover:text-foreground-600"
                  >
                    <Icon icon="solar:menu-dots-bold" className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Content */}
            <div className="px-6">
              {watchedTitle && (
                <h2 className="text-foreground mb-3 text-xl leading-tight font-bold">
                  {watchedTitle}
                </h2>
              )}

              {watchedContent ? (
                <div className="text-foreground mb-4 leading-relaxed whitespace-pre-wrap">
                  {watchedContent}
                </div>
              ) : (
                <div className="text-foreground-400 mb-4 italic">
                  Your content will appear here...
                </div>
              )}

              {/* Topics */}
              {watchedTopics && watchedTopics.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {watchedTopics.map((topicId, index) => {
                    const topic = availableTopics.find((t) => t.id === topicId);
                    if (!topic) return null;
                    return (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="bg-primary/10 text-primary border-primary/20"
                        startContent={
                          <Icon
                            icon={topic.icon || 'solar:hashtag-linear'}
                            className="h-3 w-3"
                          />
                        }
                      >
                        {topic.title}
                      </Chip>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Media Preview with Smart Grid */}
            {mediaFiles.length > 0 && (
              <div className="mb-4 px-6">
                <div className="space-y-3">
                  <h6 className="text-foreground-600 text-sm font-medium">
                    Media Attachments
                  </h6>
                  <SmartMediaPreview files={mediaFiles} onFilesChange={setMediaFiles} />
                </div>
              </div>
            )}

            {/* Engagement Bar */}
            <div className="border-divider border-t px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button
                    size="sm"
                    variant="light"
                    startContent={
                      <Icon icon="solar:heart-linear" className="h-4 w-4" />
                    }
                    className="text-foreground-500 hover:text-danger hover:bg-danger/10"
                  >
                    Like
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    startContent={
                      <Icon icon="solar:chat-round-linear" className="h-4 w-4" />
                    }
                    className="text-foreground-500 hover:text-primary hover:bg-primary/10"
                  >
                    Comment
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    startContent={
                      <Icon icon="solar:share-linear" className="h-4 w-4" />
                    }
                    className="text-foreground-500 hover:text-success hover:bg-success/10"
                  >
                    Share
                  </Button>
                </div>
                <div className="text-foreground-400 flex items-center gap-2 text-xs">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Floating indicator */}
        <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 rounded-full px-2 py-1 text-xs font-medium shadow-lg">
          Preview
        </div>
      </motion.div>
    </div>
  );
};