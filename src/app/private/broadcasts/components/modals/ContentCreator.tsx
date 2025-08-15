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

import { useCreatePost, useUpdatePost, useSaveDraft, useTopics } from '../../hooks';
import { type BroadcastPost } from '../../types';
import { type CreatePostData } from '../../services/broadcast.service';
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
  const updatePostMutation = useUpdatePost();
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
  const watchedVisibility = watch('visibility');
  const watchedAllowComments = watch('allowComments');
  const watchedAllowSharing = watch('allowSharing');
  const watchedContentWarning = watch('contentWarning');
  const watchedSensitive = watch('sensitive');
  const watchedScheduleDate = watch('scheduleDate');

  // Component state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [activeTab, setActiveTab] = useState('content');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Determine if we're in edit mode
  const isEditMode = Boolean(initialData?.id);

  // Check if form has meaningful changes from initial data
  const hasFormChanges = React.useMemo(() => {
    if (!isEditMode) return isDirty; // For create mode, use standard isDirty
    
    if (!initialData) return false;
    
    // Compare current form values with initial data
    const currentTitle = watchedTitle || '';
    const currentContent = watchedContent || '';
    const currentSkills = watchedSkills || [];
    const currentTopics = watchedTopics || [];
    
    const initialTitle = initialData.title || '';
    const initialContent = initialData.description || '';
    const initialSkills = initialData.skills?.map(skill => skill.id) || [];
    const initialTopics = initialData.topics?.map(topic => topic.id) || [];
    
    // Compare text fields
    if (currentTitle !== initialTitle) return true;
    if (currentContent !== initialContent) return true;
    
    // Compare arrays (skills and topics)
    if (currentSkills.length !== initialSkills.length) return true;
    if (currentTopics.length !== initialTopics.length) return true;
    
    if (!currentSkills.every(skill => initialSkills.includes(skill))) return true;
    if (!currentTopics.every(topic => initialTopics.includes(topic))) return true;
    
    // Compare media files
    const currentAttachmentCount = mediaFiles.length;
    const initialAttachmentCount = initialData.attachments?.length || 0;
    if (currentAttachmentCount !== initialAttachmentCount) return true;
    
    // If media files exist, compare filenames
    if (mediaFiles.length > 0 && initialData.attachments) {
      const currentFilenames = mediaFiles
        .filter(file => file.uploaded && file.filename)
        .map(file => file.filename!)
        .sort();
      const initialFilenames = [...initialData.attachments].sort();
      
      if (currentFilenames.length !== initialFilenames.length) return true;
      if (!currentFilenames.every((filename, index) => filename === initialFilenames[index])) {
        return true;
      }
    }
    
    return false;
  }, [isEditMode, isDirty, initialData, watchedTitle, watchedContent, watchedSkills, watchedTopics, mediaFiles]);

  // Get topics from API data - use topics directly
  const availableTopics = React.useMemo(() => {
    if (!topicsData) return [];
    return Array.isArray(topicsData) ? topicsData : [];
  }, [topicsData]);

  // Initialize form with initial data (for edit mode) or persisted data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode - initialize with post data
        reset({
          title: initialData.title || '',
          content: initialData.description || '',
          skills: initialData.skills?.map((skill) => skill.id) || [],
          topics: initialData.topics?.map((topic) => topic.id) || [],
          visibility: 'public',
          allowComments: true,
          allowSharing: true,
          contentWarning: false,
          sensitive: false
        });

        // Convert attachments to MediaFile objects for editing
        if (initialData.attachments && initialData.attachments.length > 0) {
          const editMediaFiles: MediaFile[] = initialData.attachments.map((filename, index) => ({
            id: `edit-${index}`,
            type: filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg)$/) ? 'image' : 'video',
            file: new File([], filename.split('/').pop() || filename), // Create dummy file object
            name: filename.split('/').pop() || filename,
            url: `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${filename}`,
            preview: `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${filename}`,
            size: 0,
            uploadProgress: 100,
            uploaded: true, // Mark as uploaded since these are existing files
            filename: filename, // Store the actual filename for API calls
            altText: initialData.title || ''
          }));
          setMediaFiles(editMediaFiles);
        } else {
          setMediaFiles([]);
        }
      } else if (persistedFormData) {
        // Create mode - restore persisted data
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
    }
  }, [isOpen, initialData, persistedFormData, persistedMediaFiles, reset]);

  // Form submission handlers
  const onSubmit = async (data: BroadcastFormData) => {
    try {
      // Prepare complete post data for API
      const postData: CreatePostData = {
        title: data.title,
        description: data.content, // Send content as description
        topics: data.topics || [], // Array of topic UUIDs
        skills: data.skills || [], // Array of skill UUIDs
        attachments: [] as string[] // Array of filenames from successful uploads
      };

      // Add media filenames from uploaded files (includes both new uploads and existing files)
      if (mediaFiles.length > 0) {
        // Get filenames from successfully uploaded files and existing attachments
        const uploadedFilenames = mediaFiles
          .filter((file) => file.uploaded && file.filename)
          .map((file) => file.filename!);

        postData.attachments = uploadedFilenames;
      }

      if (isEditMode && initialData?.id) {
        // Update existing post
        await updatePostMutation.mutateAsync({ 
          postId: initialData.id, 
          postData 
        });

        try {
          addToast({
            title: t('create.success.updateTitle'),
            description: t('create.success.updateDescription'),
            color: 'success'
          });
        } catch (e) {
          // Toast notification failed but post was updated successfully
        }
        
        // For edit mode, don't call onPublish to avoid duplicate API calls
        handleClearForm();
        onClose();
      } else {
        // Create new post
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
        
        // For create mode, don't call onPublish to avoid duplicate API calls
        handleClearForm();
        onClose();
      }
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

  const isPublishing = isEditMode ? updatePostMutation.isPending : createPostMutation.isPending;
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
          header: 'border-none pb-6 rounded-t-[24px]',
          footer:
            'border-none pt-6 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm rounded-b-[24px]'
        }}
      >
        <ModalContent className="rounded-[24px] overflow-hidden">
          <ModalHeader className='flex flex-col gap-2 pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Icon icon='solar:pen-new-square-linear' className='text-primary h-6 w-6' />
                </div>
                <div>
                  <h2 className='text-foreground text-xl font-semibold'>
                    {initialData ? t('create.editTitle') : t('create.title')}
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
                label={t('create.uploadProgress')}
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
                          title: t('create.advancedOptions'),
                          description: t('create.advancedOptions'),
                          color: 'primary'
                        });
                        return;
                      }
                      setActiveTab(key as string);
                    }}
                    variant='underlined'
                    classNames={{
                      tabList: 'gap-6 w-full relative rounded-none p-0',
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
                          <span className='bg-default-100 text-default-500 rounded-md px-2 py-0.5 text-xs'>
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
              hasFormChanges={hasFormChanges}
              persistedFormData={persistedFormData}
              initialData={initialData}
              isEditMode={isEditMode}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ContentCreator;
