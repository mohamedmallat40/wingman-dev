'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { MediaFile } from '@/components/ui/file-upload/MediaUpload';
import type { BroadcastFormData, ContentCreatorProps } from './content-creator/types';

import {
  Badge,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Tab,
  Tabs
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { useCreatePost, useSaveDraft, useTopics } from '../../hooks';
import { type BroadcastPost } from '../../types';
import { AdvancedTab } from './content-creator/AdvancedTab';
// Import extracted components and utilities
import { ContentTab } from './content-creator/ContentTab';
import { FooterActions } from './content-creator/FooterActions';
import { MediaTab } from './content-creator/MediaTab';
import { PreviewSection } from './content-creator/PreviewSection';
import { createBroadcastSchema } from './content-creator/types';
import { calculateReadTime, getErrorMessage } from './content-creator/utils';

const ContentCreator: React.FC<ContentCreatorProps> = ({
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

  const createPostMutation = useCreatePost();
  const saveDraftMutation = useSaveDraft();
  const { profile: currentUser, isLoading: profileLoading } = useBasicProfile();
  const { data: topicsData, isLoading: topicsLoading } = useTopics();

  // Form handling with react-hook-form and zod validation
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid, isDirty },
    reset
  } = useForm<BroadcastFormData>({
    resolver: zodResolver(createBroadcastSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.description || '',
      skills: initialData?.skills?.map((skill) => skill.id) || [],
      topics: initialData?.topics?.map((topic) => topic.id) || [],
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

  // Get topics from API data - use topics directly
  const availableTopics = React.useMemo(() => {
    if (!topicsData) return [];
    return Array.isArray(topicsData) ? topicsData : [];
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

  // Form submission handlers
  const onSubmit = async (data: BroadcastFormData) => {
    try {
      // Prepare post data with only required fields
      const postData = {
        title: data.title,
        description: data.content, // Send content as description
        topics: data.topics || [], // Array of topic UUIDs
        skills: data.skills || [], // Array of skill UUIDs
        attachments: [] as string[] // Array of filenames from successful uploads
      };

      // Add media filenames from uploaded files
      if (mediaFiles.length > 0) {
        // Get filenames from successfully uploaded files
        const uploadedFilenames = mediaFiles
          .filter((file) => file.uploaded && file.filename)
          .map((file) => file.filename!);

        postData.attachments = uploadedFilenames;
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
      const errorMessage = getErrorMessage(error, tErrors);

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
      const errorMessage = getErrorMessage(error, tErrors);

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
                      <ContentTab
                        control={control}
                        errors={errors}
                        availableTopics={availableTopics}
                        topicsLoading={topicsLoading}
                        watchedContent={watchedContent}
                        wordCount={wordCount}
                        readTime={readTime}
                      />
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
                      <MediaTab
                        mediaFiles={mediaFiles}
                        setMediaFiles={setMediaFiles}
                        isUploading={isUploading}
                      />
                    </Tab>

                    <Tab
                      key='advanced'
                      title={
                        <div className='flex items-center gap-2 opacity-50'>
                          <Icon icon='solar:settings-linear' className='h-4 w-4' />
                          Advanced
                          <span className='bg-default-100 text-default-500 rounded-full px-2 py-0.5 text-xs'>
                            Soon
                          </span>
                        </div>
                      }
                    >
                      <AdvancedTab control={control} />
                    </Tab>
                  </Tabs>
                </form>
              </div>

              {/* Preview Section - Right side (2/5 width) */}
              <div className='lg:col-span-2'>
                <PreviewSection
                  watchedTitle={watchedTitle}
                  watchedContent={watchedContent}
                  watchedTopics={watchedTopics}
                  watchedSkills={watchedSkills}
                  availableTopics={availableTopics}
                  mediaFiles={mediaFiles}
                  setMediaFiles={setMediaFiles}
                  wordCount={wordCount}
                  readTime={readTime}
                  profileLoading={profileLoading}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='pt-4'>
            <FooterActions
              onSaveDraft={handleSaveDraft}
              onClearForm={handleClearForm}
              onClose={handleClose}
              onSubmit={handleSubmit(onSubmit)}
              isSavingDraft={isSavingDraft}
              isPublishing={isPublishing}
              isValid={isValid}
              isUploading={isUploading}
              isDirty={isDirty}
              persistedFormData={persistedFormData}
              initialData={initialData}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ContentCreator;
