'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { MediaFile } from '@/components/ui/file-upload/MediaUpload';

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
  Progress,
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
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SkillsInput } from '@/app/private/broadcasts/components/ui/SkillsInput';
import { MediaUpload } from '@/components/ui/file-upload/MediaUpload';
import { getBaseUrl } from '@/lib/utils/utilities';

import { useCreatePost, useSaveDraft, useTopics, useUploadMedia } from '../../hooks';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { type BroadcastPost } from '../../types';

// Utility functions
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Image Carousel Modal Component
interface ImageCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: MediaFile[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageCarouselModal: React.FC<ImageCarouselModalProps> = ({
  isOpen,
  onClose,
  files,
  currentIndex,
  onIndexChange
}) => {
  const handlePrevious = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : files.length - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex < files.length - 1 ? currentIndex + 1 : 0);
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    },
    [currentIndex, files.length]
  );

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, handleKeyDown]);

  const currentFile = files[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='5xl'
      placement='center'
      classNames={{
        base: 'bg-black/90 backdrop-blur-lg',
        backdrop: 'bg-black/80',
        wrapper: 'items-center justify-center',
        body: 'p-0',
        header: 'border-none',
        footer: 'border-none bg-black/50'
      }}
    >
      <ModalContent>
        <ModalHeader className='flex items-center justify-between p-4'>
          <div className='text-white'>
            <h3 className='text-lg font-semibold'>
              {currentIndex + 1} of {files.length}
            </h3>
            {currentFile?.caption && <p className='text-sm text-white/70'>{currentFile.caption}</p>}
          </div>
          <Button
            isIconOnly
            variant='light'
            onPress={onClose}
            className='text-white hover:bg-white/10'
          >
            <Icon icon='solar:close-circle-linear' className='h-6 w-6' />
          </Button>
        </ModalHeader>

        <ModalBody className='flex items-center justify-center p-4'>
          <div className='relative flex h-full w-full items-center justify-center'>
            {files.length > 1 && (
              <Button
                isIconOnly
                variant='flat'
                onPress={handlePrevious}
                className='absolute left-4 z-10 bg-black/50 text-white hover:bg-black/70'
                size='lg'
              >
                <Icon icon='solar:arrow-left-linear' className='h-6 w-6' />
              </Button>
            )}

            <div className='flex max-h-full max-w-full items-center justify-center'>
              {currentFile?.type === 'image' ? (
                <img
                  src={currentFile.preview}
                  alt={currentFile.altText || 'Preview'}
                  className='max-h-[80vh] max-w-full rounded-lg object-contain'
                />
              ) : (
                <video
                  src={currentFile?.preview}
                  controls
                  className='max-h-[80vh] max-w-full rounded-lg object-contain'
                />
              )}
            </div>

            {files.length > 1 && (
              <Button
                isIconOnly
                variant='flat'
                onPress={handleNext}
                className='absolute right-4 z-10 bg-black/50 text-white hover:bg-black/70'
                size='lg'
              >
                <Icon icon='solar:arrow-right-linear' className='h-6 w-6' />
              </Button>
            )}
          </div>
        </ModalBody>

        <ModalFooter className='p-4'>
          {files.length > 1 && (
            <div className='flex max-w-full justify-center gap-2 overflow-x-auto'>
              {files.map((file, index) => (
                <button
                  key={file.id}
                  onClick={() => onIndexChange(index)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    index === currentIndex
                      ? 'border-primary scale-110'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  {file.type === 'image' ? (
                    <img
                      src={file.preview}
                      alt='Thumbnail'
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-black/70'>
                      <Icon icon='solar:play-bold' className='h-4 w-4 text-white' />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Smart Media Preview Component
interface SmartMediaPreviewProps {
  files: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
}

const SmartMediaPreview: React.FC<SmartMediaPreviewProps> = ({ files, onFilesChange }) => {
  const [carouselOpen, setCarouselOpen] = React.useState(false);
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const handleRemoveFile = (fileToRemove: MediaFile) => {
    const updatedFiles = files.filter((file) => file.id !== fileToRemove.id);
    onFilesChange(updatedFiles);
  };

  const handleImageClick = (index: number) => {
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

  if (files.length === 0) return null;

  return (
    <div className='w-full'>
      <ImageCarouselModal
        isOpen={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        files={files}
        currentIndex={carouselIndex}
        onIndexChange={setCarouselIndex}
      />

      <div className='grid grid-cols-2 gap-2'>
        {files.map((file, index) => (
          <div
            key={file.id}
            className='group relative cursor-pointer'
            onClick={() => handleImageClick(index)}
          >
            <div className='bg-default-100 relative overflow-hidden rounded-lg'>
              {file.type === 'image' ? (
                <img
                  src={file.preview}
                  alt={file.altText || 'Preview'}
                  className='h-32 w-full object-cover'
                />
              ) : (
                <div className='relative h-32 w-full'>
                  <video src={file.preview} className='h-full w-full object-cover' muted />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                    <Icon icon='solar:play-bold' className='h-6 w-6 text-white' />
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20'>
                <div className='rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Icon icon='solar:eye-bold' className='h-4 w-4 text-white' />
                </div>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(file);
              }}
              className='bg-danger absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100'
            >
              <Icon icon='solar:close-circle-bold' className='h-3 w-3 text-white' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
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
  skills: z.array(z.string()).max(10, 'Maximum 10 skills allowed'),
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
  const [persistedFormData, setPersistedFormData] = useState<Partial<BroadcastFormData> | null>(
    null
  );
  const [persistedMediaFiles, setPersistedMediaFiles] = useState<MediaFile[]>([]);

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
      content: initialData?.description || '',
      skills: initialData?.skills?.map(skill => skill.id) || [],
      topics: initialData?.topics?.map(topic => topic.id) || [],
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
  const watchedSkills = watch('skills');
  const watchedTopics = watch('topics');

  // Component state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

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
        skills: persistedFormData.skills || [],
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
    }
  }, [isOpen, persistedFormData, persistedMediaFiles, reset]);

  // Utility functions

  // Media handling with new component
  const handleMediaFilesChange = useCallback((files: MediaFile[]) => {
    setMediaFiles(files);
  }, []);

  // Form submission handlers
  const onSubmit = async (data: BroadcastFormData) => {
    try {
      // Prepare post data with only required fields
      const postData = {
        title: data.title,
        description: data.content, // Send content as description
        topics: data.topics || [], // Array of topic UUIDs
        skills: data.skills || [], // Array of skill UUIDs
        media: [] as string[] // Array of filenames from successful uploads
      };

      // Add media filenames from uploaded files
      if (mediaFiles.length > 0) {
        // Get filenames from successfully uploaded files
        const uploadedFilenames = mediaFiles
          .filter(file => file.uploaded && file.filename)
          .map(file => file.filename!);
        
        console.log('Media files:', mediaFiles);
        console.log('Uploaded filenames:', uploadedFilenames);
        
        postData.media = uploadedFilenames;
      }
      
      console.log('Final post data:', postData);

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

    // Don't clean up previews or reset form - keep everything for next time
    // Only close the modal
    onClose();
  }, [getValues, mediaFiles, onClose]);

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
    setActiveTab('content');
    setUploadProgress(0);
    setPersistedFormData(null);
    setPersistedMediaFiles([]);
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
          base: `${className} max-w-6xl w-[95vw] rounded-[24px] shadow-[0px_16px_32px_rgba(0,0,0,0.12)]`,
          backdrop: 'bg-black/60 backdrop-blur-md',
          wrapper: 'pointer-events-auto',
          body: 'py-8 px-8',
          header: 'border-none pb-6',
          footer:
            'border-none pt-6 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm'
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
                    onSelectionChange={(key) => {
                      if (key === 'advanced') {
                        addToast({
                          title: 'Coming Soon',
                          description: 'Advanced features are coming soon!',
                          color: 'primary'
                        });
                        return;
                      }
                      setActiveTab(key as string);
                    }}
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
                                placeholder='Enter an engaging title that captures attention...'
                                startContent={
                                  <Icon
                                    icon='solar:text-field-outline'
                                    className='text-primary h-4 w-4'
                                  />
                                }
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                description={`${field.value?.length || 0}/200 characters`}
                                classNames={{
                                  inputWrapper:
                                    'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-primary/10 rounded-[16px] bg-default-100/50 dark:bg-default-50/50 p-4 transition-all duration-300 shadow-sm hover:shadow-md group-data-[focus=true]:shadow-lg',
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
                                  description={`${field.value?.length || 0}/3 topics`}
                                  startContent={
                                    <Icon icon='solar:hashtag-circle-outline' className='text-secondary h-4 w-4' />
                                  }
                                  renderValue={(items) => {
                                    return (
                                      <div className='flex flex-wrap gap-2'>
                                        {items.map((item) => {
                                          const topic = availableTopics.find(
                                            (t) => t.id === item.key
                                          );
                                          return (
                                            <Chip
                                              key={item.key}
                                              variant='flat'
                                              size='sm'
                                              onClose={() => {
                                                const newTopics = field.value.filter(
                                                  (id: string) => id !== item.key
                                                );
                                                field.onChange(newTopics);
                                              }}
                                              startContent={
                                                topic?.icon ? (
                                                  <Icon icon={topic.icon} className='h-3 w-3' />
                                                ) : (
                                                  <Icon
                                                    icon='solar:hashtag-linear'
                                                    className='h-3 w-3'
                                                  />
                                                )
                                              }
                                              classNames={{
                                                base: 'hover:bg-secondary-100 dark:hover:bg-secondary-900 transition-colors',
                                                closeButton:
                                                  'text-default-500 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20'
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
                                      startContent={
                                        <Icon
                                          icon={topic.icon || 'solar:hashtag-linear'}
                                          className='h-4 w-4'
                                        />
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
                            render={({ field }) => (
                              <SkillsInput value={field.value} onChange={field.onChange} />
                            )}
                          />
                        </motion.div>

                        {/* Content */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <Controller
                            name='content'
                            control={control}
                            render={({ field, fieldState }) => (
                              <Textarea
                                {...field}
                                placeholder='Share your thoughts, insights, stories, or creative content with the world. What would you like to express today?'
                                minRows={10}
                                maxRows={25}
                                description={`${wordCount} words • ${readTime} min read`}
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                classNames={{
                                  inputWrapper:
                                    'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-primary/10 rounded-[16px] bg-default-100/50 dark:bg-default-50/50 p-4 transition-all duration-300 shadow-sm hover:shadow-md group-data-[focus=true]:shadow-lg',
                                  input:
                                    'text-foreground font-normal tracking-[0.01em] placeholder:text-default-400 text-base leading-relaxed transition-all duration-200 resize-none'
                                }}
                              />
                            )}
                          />
                        </motion.div>
                      </div>
                    </Tab>

                    <Tab
                      key='media'
                      title={
                        <div className='flex items-center gap-2'>
                          <Icon icon='solar:gallery-linear' className='h-4 w-4' />
                          Media
                          {mediaFiles.length > 0 && (
                            <Badge content={mediaFiles.length} color='primary' size='sm'>
                              <span></span>
                            </Badge>
                          )}
                        </div>
                      }
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className='space-y-6 py-4'
                      >
                        {/* Media Upload Controls */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <MediaUpload
                            files={mediaFiles}
                            onFilesChange={(files) => {
                              if (typeof files === 'function') {
                                setMediaFiles(files);
                              } else {
                                setMediaFiles(files);
                              }
                            }}
                            maxFiles={10}
                            maxFileSize={100 * 1024 * 1024}
                            acceptedTypes={[
                              'image/*',
                              'video/*',
                              '.jpg',
                              '.jpeg',
                              '.png',
                              '.gif',
                              '.mp4',
                              '.mov',
                              '.avi'
                            ]}
                            isUploading={isUploading}
                          />
                        </motion.div>

                      </motion.div>
                    </Tab>

                    <Tab
                      key='advanced'
                      title={
                        <div className='flex items-center gap-2 opacity-50'>
                          <Icon icon='solar:settings-linear' className='h-4 w-4' />
                          Advanced
                          <span className='text-xs bg-default-100 text-default-500 px-2 py-0.5 rounded-full'>Soon</span>
                        </div>
                      }
                    >
                      <div className='space-y-6 py-4'>
                        {/* Visibility Settings */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className='space-y-4'
                        >
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
                                  <Switch isSelected={field.value} onValueChange={field.onChange} />
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
                                  <Switch isSelected={field.value} onValueChange={field.onChange} />
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
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <Divider />
                        </motion.div>

                        {/* Schedule Publishing */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                          className='space-y-4'
                        >
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
                        </motion.div>
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
                    <Card className='bg-background overflow-hidden border-0 shadow-xl ring-1 shadow-black/5 ring-black/5 dark:shadow-black/20 dark:ring-white/10'>
                      <CardBody className='p-0'>
                        {/* Header */}
                        <div className='flex items-start gap-3 p-6 pb-4'>
                          {profileLoading ? (
                            <>
                              <div className='bg-default-200 h-12 w-12 animate-pulse rounded-full' />
                              <div className='flex-1 space-y-2'>
                                <div className='bg-default-200 h-4 w-32 animate-pulse rounded' />
                                <div className='bg-default-200 h-3 w-24 animate-pulse rounded' />
                              </div>
                            </>
                          ) : (
                            <>
                              <Avatar
                                size='md'
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
                                className='ring-primary/20 ring-2'
                              />
                              <div className='min-w-0 flex-1'>
                                <div className='mb-1 flex items-center gap-2'>
                                  <h4 className='text-foreground truncate font-semibold'>
                                    {currentUser
                                      ? `${currentUser.firstName} ${currentUser.lastName}`
                                      : 'Your Name'}
                                  </h4>
                                  <Icon
                                    icon='solar:verified-check-bold'
                                    className='text-primary h-4 w-4 flex-shrink-0'
                                  />
                                </div>
                                <div className='text-foreground-500 flex items-center gap-1 text-xs'>
                                  <span>
                                    @
                                    {currentUser
                                      ? `${currentUser.firstName}_${currentUser.lastName}`
                                      : 'username'}
                                  </span>
                                  <span>•</span>
                                  <span>just now</span>
                                  <Icon icon='solar:global-linear' className='ml-1 h-3 w-3' />
                                </div>
                              </div>
                              <Button
                                isIconOnly
                                size='sm'
                                variant='light'
                                className='text-foreground-400 hover:text-foreground-600'
                              >
                                <Icon icon='solar:menu-dots-bold' className='h-4 w-4' />
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Content */}
                        <div className='px-6'>
                          {watchedTitle && (
                            <h2 className='text-foreground mb-3 text-xl leading-tight font-bold'>
                              {watchedTitle}
                            </h2>
                          )}

                          {watchedContent ? (
                            <div className='text-foreground mb-4 leading-relaxed whitespace-pre-wrap'>
                              {watchedContent}
                            </div>
                          ) : (
                            <div className='text-foreground-400 mb-4 italic'>
                              Your content will appear here...
                            </div>
                          )}

                          {/* Topics */}
                          {watchedTopics && watchedTopics.length > 0 && (
                            <div className='mb-4 flex flex-wrap gap-2'>
                              {watchedTopics.map((topicId, index) => {
                                const topic = availableTopics.find((t) => t.id === topicId);
                                if (!topic) return null;
                                return (
                                  <Chip
                                    key={index}
                                    size='sm'
                                    variant='flat'
                                    color='primary'
                                    className='bg-primary/10 text-primary border-primary/20'
                                    startContent={
                                      <Icon
                                        icon={topic.icon || 'solar:hashtag-linear'}
                                        className='h-3 w-3'
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
                          <div className='mb-4 px-6'>
                            <div className='space-y-3'>
                              <h6 className='text-foreground-600 text-sm font-medium'>
                                Media Attachments
                              </h6>
                              <SmartMediaPreview files={mediaFiles} onFilesChange={setMediaFiles} />
                            </div>
                          </div>
                        )}

                        {/* Engagement Bar */}
                        <div className='border-divider border-t px-6 py-3'>
                          <div className='text-foreground-500 mb-3 flex items-center justify-between text-sm'>
                            <div className='flex items-center gap-4'>
                              <span className='flex items-center gap-1'>
                                <Icon icon='solar:heart-bold' className='text-danger h-4 w-4' />
                                <span>42</span>
                              </span>
                              <span className='flex items-center gap-1'>
                                <Icon icon='solar:chat-round-bold' className='h-4 w-4' />
                                <span>8</span>
                              </span>
                              <span className='flex items-center gap-1'>
                                <Icon icon='solar:share-bold' className='h-4 w-4' />
                                <span>3</span>
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Icon icon='solar:eye-linear' className='h-4 w-4' />
                              <span>1.2k views</span>
                            </div>
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-6'>
                              <Button
                                size='sm'
                                variant='light'
                                startContent={
                                  <Icon icon='solar:heart-linear' className='h-4 w-4' />
                                }
                                className='text-foreground-500 hover:text-danger hover:bg-danger/10'
                              >
                                Like
                              </Button>
                              <Button
                                size='sm'
                                variant='light'
                                startContent={
                                  <Icon icon='solar:chat-round-linear' className='h-4 w-4' />
                                }
                                className='text-foreground-500 hover:text-primary hover:bg-primary/10'
                              >
                                Comment
                              </Button>
                              <Button
                                size='sm'
                                variant='light'
                                startContent={
                                  <Icon icon='solar:share-linear' className='h-4 w-4' />
                                }
                                className='text-foreground-500 hover:text-success hover:bg-success/10'
                              >
                                Share
                              </Button>
                            </div>
                            <div className='text-foreground-400 flex items-center gap-2 text-xs'>
                              <span>{wordCount} words</span>
                              <span>•</span>
                              <span>{readTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Floating indicator */}
                    <div className='bg-primary text-primary-foreground absolute -top-2 -right-2 rounded-full px-2 py-1 text-xs font-medium shadow-lg'>
                      Preview
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='pt-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className='flex w-full items-center justify-between'
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className='flex gap-2'
              >
                <Button
                  variant='flat'
                  onPress={handleSaveDraft}
                  isLoading={isSavingDraft}
                  startContent={
                    !isSavingDraft && <Icon icon='solar:diskette-linear' className='h-4 w-4' />
                  }
                  className='transition-transform duration-200 hover:scale-105'
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
                    startContent={
                      <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                    }
                    className='transition-transform duration-200 hover:scale-105'
                  >
                    Discard
                  </Button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className='flex gap-2'
              >
                <Button
                  variant='light'
                  onPress={handleClose}
                  className='transition-transform duration-200 hover:scale-105'
                >
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
                  className='transition-all duration-300 hover:scale-105 hover:shadow-lg'
                >
                  {initialData ? 'Update Post' : 'Publish Post'}
                </Button>
              </motion.div>
            </motion.div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EnhancedContentCreator;
