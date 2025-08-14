'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Tab,
  Tabs,
  Textarea,
  Tooltip
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { MediaUpload, type MediaFile } from '@/components/ui/file-upload/MediaUpload';
import MediaGrid, { type MediaItem } from '@/components/ui/media/MediaGrid';

import { useCreatePost, useSaveDraft, useUploadMedia, useTopics } from '../../hooks';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { getBaseUrl } from '@/lib/utils/utilities';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { type BroadcastPost } from '../../types';

// Utility functions
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const extractHashtags = (content: string): string[] => {
  const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
  return hashtags.map((tag) => tag.slice(1)); // Remove # symbol
};

// Enhanced schema with comprehensive validation
const createBroadcastSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(20, 'Content must be at least 20 characters')
    .max(10000, 'Content cannot exceed 10,000 characters'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  topics: z.array(z.string()).max(3, 'Maximum 3 topics allowed').default([]),
  visibility: z.enum(['public', 'private', 'followers']).default('public'),
  allowComments: z.boolean().default(true),
  allowSharing: z.boolean().default(true),
  scheduleDate: z.date().optional(),
  thumbnailAlt: z.string().optional(),
  contentWarning: z.boolean().default(false),
  sensitive: z.boolean().default(false)
});

type BroadcastFormData = z.infer<typeof createBroadcastSchema>;

interface EnhancedContentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (post: Partial<BroadcastPost>) => void;
  onSaveDraft: (draft: Partial<BroadcastPost>) => void;
  initialData?: Partial<BroadcastPost>;
  className?: string;
}


const EnhancedContentCreator: React.FC<EnhancedContentCreatorProps> = ({
  isOpen,
  onClose,
  onPublish,
  onSaveDraft,
  initialData,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('ERRORS');

  // Persistent state for form data - declare first
  const [persistedFormData, setPersistedFormData] = useState<Partial<BroadcastFormData> | null>(null);
  const [persistedMediaFiles, setPersistedMediaFiles] = useState<MediaFile[]>([]);
  const [persistedTagInput, setPersistedTagInput] = useState('');

  const { preferences } = useBroadcastStore();
  const createPostMutation = useCreatePost();
  const saveDraftMutation = useSaveDraft();
  const uploadMediaMutation = useUploadMedia();
  const { profile: currentUser, isLoading: profileLoading } = useBasicProfile();
  const { data: topicsData, isLoading: topicsLoading } = useTopics();
  
  // Error translation helper
  const getErrorMessage = (error: any): { title: string; description: string } => {
    // Check if it's a network error
    if (!navigator.onLine) {
      return {
        title: tErrors('offline'),
        description: tErrors('offline')
      };
    }

    // Handle HTTP status codes
    const status = error?.response?.status;
    switch (status) {
      case 400:
        return {
          title: tErrors('badRequest'),
          description: tErrors('badRequest')
        };
      case 401:
        return {
          title: tErrors('unauthorized'),
          description: tErrors('unauthorized')
        };
      case 403:
        return {
          title: tErrors('forbidden'),
          description: tErrors('forbidden')
        };
      case 404:
        return {
          title: tErrors('notFound'),
          description: tErrors('notFound')
        };
      case 408:
        return {
          title: tErrors('timeout'),
          description: tErrors('timeout')
        };
      case 413:
        return {
          title: tErrors('contentTooLong'),
          description: tErrors('contentTooLong')
        };
      case 422:
        return {
          title: tErrors('invalidData'),
          description: tErrors('invalidData')
        };
      case 429:
        return {
          title: tErrors('tooManyRequests'),
          description: tErrors('tooManyRequests')
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          title: tErrors('serverError'),
          description: tErrors('serverError')
        };
      default:
        // Check for specific error context
        if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
          return {
            title: tErrors('networkError'),
            description: tErrors('networkError')
          };
        }
        
        // Generic fallback
        return {
          title: tErrors('internalError'),
          description: tErrors('internalError')
        };
    }
  };

  // Form handling with react-hook-form and zod validation
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
    reset,
    clearErrors,
    setError
  } = useForm<BroadcastFormData>({
    resolver: zodResolver(createBroadcastSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      tags: initialData?.tags || [],
      topics: initialData?.topic ? [initialData.topic.id] : [],
      visibility: 'public',
      allowComments: true,
      allowSharing: true,
      contentWarning: false,
      sensitive: false
    },
    mode: 'onChange'
  });

  // Watch form fields for real-time updates
  const watchedContent = watch('content');
  const watchedTitle = watch('title');
  const watchedTags = watch('tags');
  const watchedTopics = watch('topics');

  // Component state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Post type configurations


  // Get topics from API data - use topics directly
  const availableTopics = React.useMemo(() => {
    if (!topicsData) return [];
    const topics = Array.isArray(topicsData) ? topicsData : topicsData.data || [];
    return topics;
  }, [topicsData]);

  // Restore persisted state when modal opens
  useEffect(() => {
    if (isOpen && persistedFormData) {
      // Reset form with persisted data
      reset({
        title: persistedFormData.title || '',
        content: persistedFormData.content || '',
        tags: persistedFormData.tags || [],
        topics: persistedFormData.topics || [],
        visibility: persistedFormData.visibility || 'public',
        allowComments: persistedFormData.allowComments ?? true,
        allowSharing: persistedFormData.allowSharing ?? true,
        contentWarning: persistedFormData.contentWarning ?? false,
        sensitive: persistedFormData.sensitive ?? false,
        scheduleDate: persistedFormData.scheduleDate
      });
      
      // Restore other state
      setMediaFiles(persistedMediaFiles);
      setTagInput(persistedTagInput);
    }
  }, [isOpen, persistedFormData, persistedMediaFiles, persistedTagInput, reset]);

  // Utility functions

  // Media handling with new component
  const handleMediaFilesChange = useCallback((files: MediaFile[]) => {
    setMediaFiles(files);
  }, []);

  // Tag handling functions
  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (!trimmedTag) return;

    const currentTags = getValues('tags');
    if (currentTags.includes(trimmedTag)) {
      // Tag already exists - silently ignore
      return;
    }

    if (currentTags.length >= 10) {
      // Maximum tags reached - silently ignore
      return;
    }

    setValue('tags', [...currentTags, trimmedTag], { shouldValidate: true });
    setTagInput('');
  }, [tagInput, getValues, setValue]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      const currentTags = getValues('tags');
      setValue(
        'tags',
        currentTags.filter((tag) => tag !== tagToRemove),
        { shouldValidate: true }
      );
    },
    [getValues, setValue]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  // Form submission handlers
  const onSubmit = async (data: BroadcastFormData) => {
    try {
      // Prepare post data
      const postData = {
        ...data,
        type: 'text', // Default post type
        tags: [...data.tags, ...extractHashtags(data.content)],
        readTime: calculateReadTime(data.content),
        wordCount: data.content.trim().split(/\s+/).length,
        // Handle topics - take the first topic for backward compatibility with topic field
        topic: data.topics && data.topics.length > 0 ? {
          id: data.topics[0],
          name: availableTopics.find(t => t.id === data.topics[0])?.title || '',
          icon: availableTopics.find(t => t.id === data.topics[0])?.icon || 'solar:hashtag-linear'
        } : undefined,
        // Store all selected topics
        selectedTopics: data.topics || []
      };

      // Add media data if present
      if (mediaFiles.length > 0) {
        postData.media = {
          type: mediaFiles.some((f) => f.type === 'video')
            ? 'video'
            : mediaFiles.length > 1
              ? 'gallery'
              : 'image',
          files: mediaFiles.map((f) => f.file),
          urls: mediaFiles.filter((f) => f.url).map((f) => f.url),
          captions: mediaFiles.map((f) => f.caption).filter(Boolean),
          altTexts: mediaFiles.map((f) => f.altText).filter(Boolean)
        };
        // Update post type based on media
        postData.type = mediaFiles.some((f) => f.type === 'video')
          ? 'video'
          : mediaFiles.length > 1
            ? 'gallery'
            : 'image';
      }

      await createPostMutation.mutateAsync(postData);

      try {
        addToast({
          title: t('create.success.title'),
          description: t('create.success.description'),
          color: 'success'
        });
      } catch (e) {
        // Toast notification failed but post was published successfully
      }
      onPublish(postData);
      handleClearForm();
      onClose();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      
      try {
        addToast({
          title: errorMessage.title,
          description: errorMessage.description,
          color: 'danger'
        });
      } catch (e) {
        // Toast notification failed - post publish error already handled
      }
    }
  };

  const handleSaveDraft = async () => {
    try {
      const formData = getValues();
      const draftData = {
        ...formData,
        id: initialData?.id,
        timestamp: new Date().toISOString(),
        isDraft: true
      };

      await saveDraftMutation.mutateAsync(draftData);
      
      try {
        addToast({
          title: t('create.draft.success'),
          description: t('create.draft.successDescription'),
          color: 'success'
        });
      } catch (e) {
        // Toast notification failed but draft was saved successfully
      }
      
      onSaveDraft(draftData);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      
      try {
        addToast({
          title: tErrors('draftSaveFailed'),
          description: errorMessage.description,
          color: 'danger'
        });
      } catch (e) {
        // Toast notification failed - draft save error already handled
      }
    }
  };

  const handleClose = useCallback(() => {
    // Persist current form data before closing
    const currentFormData = getValues();
    setPersistedFormData(currentFormData);
    setPersistedMediaFiles(mediaFiles);
    setPersistedTagInput(tagInput);

    // Don't clean up previews or reset form - keep everything for next time
    // Only close the modal
    onClose();
  }, [getValues, mediaFiles, tagInput, onClose]);

  // Separate function for completely clearing the form (for after publish/discard)
  const handleClearForm = useCallback(() => {
    // Clean up previews
    mediaFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    persistedMediaFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    reset();
    setMediaFiles([]);
    setTagInput('');
    setActiveTab('content');
    setUploadProgress(0);
    setPersistedFormData(null);
    setPersistedMediaFiles([]);
    setPersistedTagInput('');
  }, [mediaFiles, persistedMediaFiles, reset]);

  // Computed values
  const wordCount = useMemo(() => {
    return watchedContent ? watchedContent.trim().split(/\s+/).length : 0;
  }, [watchedContent]);

  const readTime = useMemo(() => {
    return watchedContent ? calculateReadTime(watchedContent) : 0;
  }, [watchedContent]);

  const isPublishing = createPostMutation.isPending;
  const isSavingDraft = saveDraftMutation.isPending;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size='5xl'
        scrollBehavior='inside'
        classNames={{
          base: `${className} max-w-7xl w-[90vw]`,
          backdrop: 'bg-black/50 backdrop-blur-sm',
          wrapper: 'pointer-events-auto',
          body: 'py-6',
          header: 'border-b border-divider',
          footer: 'border-t border-divider'
        }}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-2 pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Icon icon='solar:pen-new-square-linear' className='text-primary h-6 w-6' />
                </div>
                <div>
                  <h2 className='text-foreground text-xl font-semibold'>
                    {initialData ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <p className='text-foreground-500 text-sm'>{t('description')}</p>
                </div>
              </div>

            </div>

            {/* Progress indicator */}
            {isUploading && (
              <Progress
                value={uploadProgress}
                color='primary'
                size='sm'
                label='Uploading media...'
                showValueLabel
              />
            )}
          </ModalHeader>

          <ModalBody>
            <div className='grid h-full grid-cols-1 gap-8 lg:grid-cols-5'>
              {/* Form Section - Left side (3/5 width) */}
              <div className='lg:col-span-3'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    variant='underlined'
                    classNames={{
                      tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                      cursor: 'w-full bg-primary',
                      tab: 'max-w-fit px-0 h-12',
                      tabContent: 'group-data-[selected=true]:text-primary'
                    }}
                  >
                    <Tab
                      key='content'
                      title={
                        <div className='flex items-center gap-2'>
                          <Icon icon='solar:document-text-linear' className='h-4 w-4' />
                          Content
                        </div>
                      }
                    >
                      <div className='space-y-6 py-4'>
                        {/* Title */}
                        <Controller
                          name='title'
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              {...field}
                              placeholder='Enter an engaging title...'
                              startContent={
                                <Icon icon='solar:text-field-linear' className='h-4 w-4' />
                              }
                              isInvalid={!!fieldState.error}
                              errorMessage={fieldState.error?.message}
                              description={`${field.value?.length || 0}/200 characters`}
                              classNames={{
                                input: 'text-lg'
                              }}
                            />
                          )}
                        />

                        {/* Topics Selection */}
                        <Controller
                          name='topics'
                          control={control}
                          render={({ field, fieldState }) => (
                            <div className='space-y-3'>
                              <div className='flex items-center justify-between'>
                                <label className='text-foreground text-sm font-medium'>
                                  Topics (Max 3)
                                </label>
                                <span className='text-foreground-500 text-xs'>
                                  {field.value?.length || 0}/3 selected
                                </span>
                              </div>
                              
                              <Select
                                placeholder='Select topics for your post'
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
                                startContent={<Icon icon='solar:hashtag-circle-linear' className='h-4 w-4' />}
                                renderValue={(items) => {
                                  return (
                                    <div className="flex flex-wrap gap-2">
                                      {items.map((item) => {
                                        const topic = availableTopics.find(t => t.id === item.key);
                                        return (
                                          <Chip
                                            key={item.key}
                                            variant="flat"
                                            size="sm"
                                            onClose={() => {
                                              const newTopics = field.value.filter((id: string) => id !== item.key);
                                              field.onChange(newTopics);
                                            }}
                                            startContent={topic?.icon ? <Icon icon={topic.icon} className="h-3 w-3" /> : <Icon icon="solar:hashtag-linear" className="h-3 w-3" />}
                                            classNames={{
                                              base: "hover:bg-secondary-100 dark:hover:bg-secondary-900 transition-colors",
                                              closeButton: "text-default-500 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20"
                                            }}
                                          >
                                            {topic?.title || 'Loading...'}
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
                                    value={topic.id}
                                    textValue={topic.title}
                                    startContent={<Icon icon={topic.icon || 'solar:hashtag-linear'} className='h-4 w-4' />}
                                    description={topic.description}
                                    classNames={{
                                      base: "hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors duration-200"
                                    }}
                                  >
                                    {topic.title}
                                  </SelectItem>
                                ))}
                              </Select>

                              {/* Additional info about selected topics */}
                              {field.value && field.value.length > 0 && (
                                <div className='text-sm text-foreground-500'>
                                  {field.value.length} topic{field.value.length !== 1 ? 's' : ''} selected
                                </div>
                              )}
                            </div>
                          )}
                        />

                        {/* Content */}
                        <Controller
                          name='content'
                          control={control}
                          render={({ field, fieldState }) => (
                            <Textarea
                              {...field}
                              placeholder='Share your thoughts, insights, or story...'
                              minRows={8}
                              maxRows={20}
                              description={`${wordCount} words • ${readTime} min read`}
                              isInvalid={!!fieldState.error}
                              errorMessage={fieldState.error?.message}
                            />
                          )}
                        />

                        {/* Tags Section */}
                        <div className='space-y-4'>
                          {/* Tag Input */}
                          <div className='flex gap-2'>
                            <Input
                              placeholder='Enter tag and press Enter'
                              value={tagInput}
                              onValueChange={setTagInput}
                              onKeyDown={handleKeyPress}
                              startContent={<Icon icon='solar:hashtag-linear' className='h-4 w-4' />}
                              description={`${watchedTags.length}/10 tags`}
                            />
                            <Button
                              color='primary'
                              variant='flat'
                              onPress={handleAddTag}
                              isDisabled={!tagInput.trim() || watchedTags.length >= 10}
                            >
                              Add
                            </Button>
                          </div>

                          {/* Current Tags Display */}
                          {watchedTags.length > 0 && (
                            <div className='space-y-3'>
                              <h5 className='font-medium text-sm'>Current Tags</h5>
                              <div className='flex flex-wrap gap-2'>
                                {watchedTags.map((tag, index) => (
                                  <Chip
                                    key={index}
                                    onClose={() => handleRemoveTag(tag)}
                                    variant='flat'
                                    color='primary'
                                    startContent={
                                      <Icon icon='solar:hashtag-linear' className='h-3 w-3' />
                                    }
                                  >
                                    {tag}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Popular Tags Suggestions */}
                          <div className='space-y-3'>
                            <h5 className='font-medium text-sm'>Popular Tags</h5>
                            <div className='flex flex-wrap gap-2'>
                              {[
                                'javascript',
                                'react',
                                'nextjs',
                                'typescript',
                                'css',
                                'design',
                                'ui-ux'
                              ].map((tag) => (
                                <Chip
                                  key={tag}
                                  variant='bordered'
                                  className='cursor-pointer'
                                  onClick={() => {
                                    if (!watchedTags.includes(tag) && watchedTags.length < 10) {
                                      setValue('tags', [...watchedTags, tag], {
                                        shouldValidate: true
                                      });
                                    }
                                  }}
                                >
                                  #{tag}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>

                    <Tab
                      key='media'
                      title={
                        <div className='flex items-center gap-2'>
                          <Icon icon='solar:gallery-linear' className='h-4 w-4' />
                          Media
                          {mediaFiles.length > 0 && (
                            <Badge content={mediaFiles.length} color='primary' size='sm' />
                          )}
                        </div>
                      }
                    >
                      <div className='space-y-6 py-4'>
                        {/* Media Upload Controls */}
                        <MediaUpload
                          files={mediaFiles}
                          onFilesChange={handleMediaFilesChange}
                          maxFiles={10}
                          maxFileSize={100 * 1024 * 1024}
                          acceptedTypes={['image/*', 'video/*', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi']}
                          isUploading={isUploading}
                        />

                      </div>
                    </Tab>

                    <Tab
                      key='advanced'
                      title={
                        <div className='flex items-center gap-2'>
                          <Icon icon='solar:settings-linear' className='h-4 w-4' />
                          Advanced
                        </div>
                      }
                    >
                      <div className='space-y-6 py-4'>
                        {/* Visibility Settings */}
                        <div className='space-y-4'>
                          <h4 className='font-semibold'>Privacy & Visibility</h4>

                          <Controller
                            name='visibility'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                placeholder='Who can see this post?'
                                selectedKeys={[field.value]}
                                onSelectionChange={(keys) => {
                                  const selected = Array.from(keys)[0] as string;
                                  field.onChange(selected);
                                }}
                              >
                                <SelectItem
                                  key='public'
                                  startContent={
                                    <Icon icon='solar:global-linear' className='h-4 w-4' />
                                  }
                                >
                                  Public - Everyone can see
                                </SelectItem>
                                <SelectItem
                                  key='followers'
                                  startContent={
                                    <Icon
                                      icon='solar:users-group-rounded-linear'
                                      className='h-4 w-4'
                                    />
                                  }
                                >
                                  Followers only
                                </SelectItem>
                                <SelectItem
                                  key='private'
                                  startContent={
                                    <Icon icon='solar:lock-linear' className='h-4 w-4' />
                                  }
                                >
                                  Private - Only you
                                </SelectItem>
                              </Select>
                            )}
                          />

                          <div className='space-y-3'>
                            <Controller
                              name='allowComments'
                              control={control}
                              render={({ field }) => (
                                <div className='flex items-center justify-between'>
                                  <div>
                                    <p className='font-medium'>Allow Comments</p>
                                    <p className='text-foreground-500 text-sm'>
                                      Let people comment on your post
                                    </p>
                                  </div>
                                  <Switch
                                    isSelected={field.value}
                                    onValueChange={field.onChange}
                                  />
                                </div>
                              )}
                            />

                            <Controller
                              name='allowSharing'
                              control={control}
                              render={({ field }) => (
                                <div className='flex items-center justify-between'>
                                  <div>
                                    <p className='font-medium'>Allow Sharing</p>
                                    <p className='text-foreground-500 text-sm'>
                                      Let people share your post
                                    </p>
                                  </div>
                                  <Switch
                                    isSelected={field.value}
                                    onValueChange={field.onChange}
                                  />
                                </div>
                              )}
                            />

                            <Controller
                              name='contentWarning'
                              control={control}
                              render={({ field }) => (
                                <div className='flex items-center justify-between'>
                                  <div>
                                    <p className='font-medium'>Content Warning</p>
                                    <p className='text-foreground-500 text-sm'>
                                      Mark if content might be sensitive
                                    </p>
                                  </div>
                                  <Switch
                                    isSelected={field.value}
                                    onValueChange={field.onChange}
                                    color='warning'
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        <Divider />

                        {/* Schedule Publishing */}
                        <div className='space-y-4'>
                          <h4 className='font-semibold'>Publishing Options</h4>

                          <Controller
                            name='scheduleDate'
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type='datetime-local'
                                placeholder='Schedule for later (optional)'
                                startContent={
                                  <Icon icon='solar:calendar-linear' className='h-4 w-4' />
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
                        </div>
                      </div>
                    </Tab>

                  </Tabs>
                </form>
              </div>

              {/* Preview Section - Right side (2/5 width) */}
              <div className='lg:col-span-2'>
                <div className='sticky top-0 space-y-4'>
                  <h4 className='text-foreground flex items-center gap-2 font-semibold'>
                    <Icon icon='solar:eye-linear' className='h-4 w-4' />
                    Live Preview
                  </h4>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className='relative'
                  >
                    <Card className='overflow-hidden border-0 bg-background shadow-xl shadow-black/5 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/10'>
                      <CardBody className='p-0'>
                        {/* Header */}
                        <div className='flex items-start gap-3 p-6 pb-4'>
                          {profileLoading ? (
                            <>
                              <div className='h-12 w-12 rounded-full bg-default-200 animate-pulse' />
                              <div className='flex-1 space-y-2'>
                                <div className='h-4 w-32 bg-default-200 rounded animate-pulse' />
                                <div className='h-3 w-24 bg-default-200 rounded animate-pulse' />
                              </div>
                            </>
                          ) : (
                            <>
                              <Avatar 
                                size='md' 
                                src={currentUser?.profileImage ? `${getBaseUrl()}/upload/${currentUser.profileImage}` : undefined}
                                name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
                                showFallback
                                className='ring-2 ring-primary/20'
                              />
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-1'>
                                  <h4 className='font-semibold text-foreground truncate'>
                                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Your Name'}
                                  </h4>
                                  <Icon icon="solar:verified-check-bold" className="h-4 w-4 text-primary flex-shrink-0" />
                                </div>
                                <div className='flex items-center gap-1 text-xs text-foreground-500'>
                                  <span>@{currentUser ? `${currentUser.firstName}_${currentUser.lastName}` : 'username'}</span>
                                  <span>•</span>
                                  <span>just now</span>
                                  <Icon icon="solar:global-linear" className="h-3 w-3 ml-1" />
                                </div>
                              </div>
                              <Button
                                isIconOnly
                                size='sm'
                                variant='light'
                                className='text-foreground-400 hover:text-foreground-600'
                              >
                                <Icon icon="solar:menu-dots-bold" className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Content */}
                        <div className='px-6'>
                          {watchedTitle && (
                            <h2 className='text-xl font-bold text-foreground mb-3 leading-tight'>
                              {watchedTitle}
                            </h2>
                          )}

                          {watchedContent ? (
                            <div className='text-foreground mb-4 leading-relaxed whitespace-pre-wrap'>
                              {watchedContent}
                            </div>
                          ) : (
                            <div className='text-foreground-400 italic mb-4'>
                              Your content will appear here...
                            </div>
                          )}

                          {/* Topics */}
                          {watchedTopics && watchedTopics.length > 0 && (
                            <div className='flex flex-wrap gap-2 mb-4'>
                              {watchedTopics.map((topicId, index) => {
                                const topic = availableTopics.find(t => t.id === topicId);
                                if (!topic) return null;
                                return (
                                  <Chip 
                                    key={index} 
                                    size='sm' 
                                    variant='flat' 
                                    color='primary'
                                    className='bg-primary/10 text-primary border-primary/20'
                                    startContent={<Icon icon={topic.icon || 'solar:hashtag-linear'} className='h-3 w-3' />}
                                  >
                                    {topic.title}
                                  </Chip>
                                );
                              })}
                            </div>
                          )}

                          {/* Tags */}
                          {watchedTags.length > 0 && (
                            <div className='flex flex-wrap gap-1 mb-4'>
                              {watchedTags.slice(0, 5).map((tag, index) => (
                                <span key={index} className='text-primary hover:text-primary-600 cursor-pointer font-medium text-sm'>
                                  #{tag}
                                </span>
                              ))}
                              {watchedTags.length > 5 && (
                                <span className='text-foreground-400 text-sm'>
                                  +{watchedTags.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Media Preview */}
                        {mediaFiles.length > 0 && (
                          <div className='mb-4'>
                            <MediaGrid 
                              media={mediaFiles.map(file => ({
                                id: file.id,
                                type: file.type,
                                url: file.preview,
                                caption: file.caption,
                                altText: file.altText,
                                thumbnail: file.type === 'video' ? file.preview : undefined
                              }))}
                              showCaptions={false}
                              interactive={true}
                              showRemoveButton={true}
                              onRemove={(id) => {
                                const updatedFiles = mediaFiles.filter(file => file.id !== id);
                                setMediaFiles(updatedFiles);
                              }}
                              className='rounded-none'
                            />
                          </div>
                        )}

                        {/* Engagement Bar */}
                        <div className='px-6 py-3 border-t border-divider'>
                          <div className='flex items-center justify-between text-foreground-500 text-sm mb-3'>
                            <div className='flex items-center gap-4'>
                              <span className='flex items-center gap-1'>
                                <Icon icon="solar:heart-bold" className="h-4 w-4 text-danger" />
                                <span>42</span>
                              </span>
                              <span className='flex items-center gap-1'>
                                <Icon icon="solar:chat-round-bold" className="h-4 w-4" />
                                <span>8</span>
                              </span>
                              <span className='flex items-center gap-1'>
                                <Icon icon="solar:share-bold" className="h-4 w-4" />
                                <span>3</span>
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Icon icon="solar:eye-linear" className="h-4 w-4" />
                              <span>1.2k views</span>
                            </div>
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-6'>
                              <Button
                                size='sm'
                                variant='light'
                                startContent={<Icon icon="solar:heart-linear" className="h-4 w-4" />}
                                className='text-foreground-500 hover:text-danger hover:bg-danger/10'
                              >
                                Like
                              </Button>
                              <Button
                                size='sm'
                                variant='light'
                                startContent={<Icon icon="solar:chat-round-linear" className="h-4 w-4" />}
                                className='text-foreground-500 hover:text-primary hover:bg-primary/10'
                              >
                                Comment
                              </Button>
                              <Button
                                size='sm'
                                variant='light'
                                startContent={<Icon icon="solar:share-linear" className="h-4 w-4" />}
                                className='text-foreground-500 hover:text-success hover:bg-success/10'
                              >
                                Share
                              </Button>
                            </div>
                            <div className='flex items-center gap-2 text-xs text-foreground-400'>
                              <span>{wordCount} words</span>
                              <span>•</span>
                              <span>{readTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Floating indicator */}
                    <div className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium shadow-lg'>
                      Preview
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='pt-4'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex gap-2'>
                <Button
                  variant='flat'
                  onPress={handleSaveDraft}
                  isLoading={isSavingDraft}
                  startContent={
                    !isSavingDraft && <Icon icon='solar:diskette-linear' className='h-4 w-4' />
                  }
                >
                  {tCommon('save')} Draft
                </Button>
                {(persistedFormData || isDirty) && (
                  <Button
                    variant='light'
                    color='danger'
                    onPress={() => {
                      handleClearForm();
                      onClose();
                    }}
                    startContent={<Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />}
                  >
                    Discard
                  </Button>
                )}
              </div>

              <div className='flex gap-2'>
                <Button variant='light' onPress={handleClose}>
                  {tCommon('cancel')}
                </Button>
                <Button
                  color='primary'
                  onPress={handleSubmit(onSubmit)}
                  isLoading={isPublishing}
                  isDisabled={!isValid || isUploading}
                  startContent={
                    !isPublishing && <Icon icon='solar:send-square-linear' className='h-4 w-4' />
                  }
                >
                  {initialData ? 'Update Post' : 'Publish Post'}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EnhancedContentCreator;
