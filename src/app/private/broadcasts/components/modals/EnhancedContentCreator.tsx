'use client';

import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Avatar,
  Button,
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
  Textarea,
  Progress,
  Card,
  CardBody,
  Tabs,
  Tab,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
  Badge,
  Spacer,
  Switch
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCreatePost, useSaveDraft, useUploadMedia } from '../../hooks';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { type BroadcastPost } from '../../types';
import { calculateReadTime, extractHashtags, generatePostId } from '../../utils/broadcast-utils';
import { toast } from '@heroui/toast';

// Enhanced schema with comprehensive validation
const createBroadcastSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string()
    .min(1, 'Content is required')
    .min(20, 'Content must be at least 20 characters')
    .max(10000, 'Content cannot exceed 10,000 characters'),
  type: z.enum(['article', 'video', 'image', 'poll', 'quote', 'gallery', 'link']),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  topicId: z.string().optional(),
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

interface MediaFile {
  file: File;
  preview: string;
  id: string;
  type: 'image' | 'video';
  caption?: string;
  altText?: string;
  uploadProgress?: number;
  uploaded?: boolean;
  url?: string;
  error?: string;
}

interface PollOption {
  id: string;
  text: string;
  emoji?: string;
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
  
  const { preferences } = useBroadcastStore();
  const createPostMutation = useCreatePost();
  const saveDraftMutation = useSaveDraft();
  const uploadMediaMutation = useUploadMedia();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
      type: initialData?.type || 'article',
      category: initialData?.category || '',
      priority: initialData?.priority || 'normal',
      tags: initialData?.tags || [],
      topicId: initialData?.topic?.id || undefined,
      visibility: 'public',
      allowComments: true,
      allowSharing: true,
      contentWarning: false,
      sensitive: false
    },
    mode: 'onChange'
  });

  // Watch form fields for real-time updates
  const watchedType = watch('type');
  const watchedContent = watch('content');
  const watchedTitle = watch('title');
  const watchedTags = watch('tags');

  // Component state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);
  const [linkPreview, setLinkPreview] = useState<{
    url: string;
    title: string;
    description: string;
    image: string;
    domain: string;
  } | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [autoSave, setAutoSave] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    const timer = setTimeout(() => {
      if (watchedTitle || watchedContent) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [watchedTitle, watchedContent, autoSave, isDirty]);

  // Post type configurations
  const postTypes = [
    { 
      key: 'article', 
      label: t('post.types.article'), 
      icon: 'solar:document-text-linear',
      description: 'Write a detailed article or blog post',
      color: 'primary'
    },
    { 
      key: 'video', 
      label: t('post.types.video'), 
      icon: 'solar:videocamera-linear',
      description: 'Share a video with your audience',
      color: 'secondary'
    },
    { 
      key: 'image', 
      label: t('post.types.image'), 
      icon: 'solar:camera-linear',
      description: 'Post an image or photo',
      color: 'success'
    },
    { 
      key: 'gallery',
      label: 'Gallery',
      icon: 'solar:gallery-linear',
      description: 'Share multiple images in a gallery',
      color: 'warning'
    },
    { 
      key: 'poll', 
      label: t('post.types.poll'), 
      icon: 'solar:chart-2-linear',
      description: 'Create a poll for community feedback',
      color: 'danger'
    },
    { 
      key: 'quote', 
      label: t('post.types.quote'), 
      icon: 'solar:quote-up-linear',
      description: 'Share an inspirational quote',
      color: 'default'
    },
    { 
      key: 'link', 
      label: 'Link', 
      icon: 'solar:link-linear',
      description: 'Share a link with preview',
      color: 'primary'
    }
  ];

  const categories = [
    { key: 'ai', label: t('categories.ai'), icon: 'solar:atom-linear' },
    { key: 'development', label: t('categories.development'), icon: 'solar:code-linear' },
    { key: 'design', label: t('categories.design'), icon: 'solar:palette-linear' },
    { key: 'business', label: t('categories.business'), icon: 'solar:case-round-linear' },
    { key: 'marketing', label: t('categories.marketing'), icon: 'solar:chart-2-linear' },
    { key: 'freelance', label: t('categories.freelance'), icon: 'solar:user-heart-linear' },
    { key: 'tech', label: t('categories.tech'), icon: 'solar:planet-4-linear' },
    { key: 'education', label: t('categories.education'), icon: 'solar:book-2-linear' }
  ];

  const priorities = [
    { key: 'low', label: 'Low Priority', color: 'default', icon: 'solar:arrow-down-linear' },
    { key: 'normal', label: 'Normal', color: 'primary', icon: 'solar:minus-linear' },
    { key: 'high', label: 'High Priority', color: 'warning', icon: 'solar:arrow-up-linear' }
  ];

  // Utility functions
  const handleAutoSave = useCallback(async () => {
    try {
      const formData = getValues();
      if (formData.title || formData.content) {
        await saveDraftMutation.mutateAsync({
          ...formData,
          id: initialData?.id,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [saveDraftMutation, getValues, initialData?.id]);

  // Media handling functions
  const handleFileSelect = useCallback((type: 'image' | 'video') => {
    if (type === 'image') {
      fileInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  }, []);

  const processSelectedFiles = useCallback((files: FileList, type: 'image' | 'video') => {
    const newFiles: MediaFile[] = [];
    
    Array.from(files).forEach((file) => {
      // Validate file size (max 100MB for video, 10MB for images)
      const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is ${type === 'video' ? '100MB' : '10MB'}`);
        return;
      }

      // Validate file type
      const validTypes = type === 'video' 
        ? ['video/mp4', 'video/webm', 'video/mov', 'video/avi']
        : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Please select a valid ${type} file.`);
        return;
      }

      const mediaFile: MediaFile = {
        file,
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random()}`,
        type,
        uploadProgress: 0,
        uploaded: false
      };

      newFiles.push(mediaFile);
    });

    setMediaFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileUpload = useCallback(async (files: FileList, type: 'image' | 'video') => {
    processSelectedFiles(files, type);
    
    // Start upload process
    setIsUploading(true);
    try {
      // Upload files sequentially or in parallel based on preference
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        return uploadMediaMutation.mutateAsync(formData);
      });

      await Promise.all(uploadPromises);
      toast.success(`Successfully uploaded ${files.length} ${type}(s)`);
    } catch (error) {
      toast.error(`Failed to upload ${type}s. Please try again.`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [processSelectedFiles, uploadMediaMutation]);

  const removeMediaFile = useCallback((id: string) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const updateMediaCaption = useCallback((id: string, caption: string) => {
    setMediaFiles(prev => prev.map(file => 
      file.id === id ? { ...file, caption } : file
    ));
  }, []);

  const updateMediaAltText = useCallback((id: string, altText: string) => {
    setMediaFiles(prev => prev.map(file => 
      file.id === id ? { ...file, altText } : file
    ));
  }, []);

  // Tag handling functions
  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (!trimmedTag) return;

    const currentTags = getValues('tags');
    if (currentTags.includes(trimmedTag)) {
      console.warn('Tag already exists');
      return;
    }

    if (currentTags.length >= 10) {
      console.warn('Maximum 10 tags allowed');
      return;
    }

    setValue('tags', [...currentTags, trimmedTag], { shouldValidate: true });
    setTagInput('');
  }, [tagInput, getValues, setValue]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    const currentTags = getValues('tags');
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
  }, [getValues, setValue]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  // Poll handling functions
  const addPollOption = useCallback(() => {
    if (pollOptions.length >= 6) {
      console.warn('Maximum 6 poll options allowed');
      return;
    }
    setPollOptions(prev => [...prev, { id: Date.now().toString(), text: '' }]);
  }, [pollOptions.length]);

  const removePollOption = useCallback((id: string) => {
    if (pollOptions.length <= 2) {
      console.warn('Minimum 2 poll options required');
      return;
    }
    setPollOptions(prev => prev.filter(option => option.id !== id));
  }, [pollOptions.length]);

  const updatePollOption = useCallback((id: string, text: string) => {
    setPollOptions(prev => prev.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  }, []);

  // Link preview functionality
  const fetchLinkPreview = useCallback(async (url: string) => {
    try {
      // This would typically call your backend API to fetch link metadata
      // For now, we'll simulate the response
      const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const preview = await response.json();
        setLinkPreview(preview);
      }
    } catch (error) {
      console.error('Failed to fetch link preview:', error);
    }
  }, []);

  // Form submission handlers
  const onSubmit = async (data: BroadcastFormData) => {
    try {
      // Prepare post data
      const postData = {
        ...data,
        tags: [...data.tags, ...extractHashtags(data.content)],
        readTime: calculateReadTime(data.content),
        wordCount: data.content.trim().split(/\s+/).length
      };

      // Add media data based on post type
      if (mediaFiles.length > 0) {
        postData.media = {
          type: watchedType === 'video' ? 'video' : watchedType === 'gallery' ? 'gallery' : 'image',
          files: mediaFiles.map(f => f.file),
          urls: mediaFiles.filter(f => f.url).map(f => f.url),
          captions: mediaFiles.map(f => f.caption).filter(Boolean),
          altTexts: mediaFiles.map(f => f.altText).filter(Boolean)
        };
      }

      // Add poll data
      if (watchedType === 'poll') {
        const validOptions = pollOptions.filter(option => option.text.trim());
        if (validOptions.length < 2) {
          setError('root', { message: 'Poll must have at least 2 options' });
          return;
        }
        
        postData.poll = {
          question: data.title,
          options: validOptions.map(option => option.text.trim()),
          duration: 24 // Default 24 hours
        };
      }

      // Add link data
      if (watchedType === 'link' && linkPreview) {
        postData.media = {
          type: 'link',
          linkData: linkPreview
        };
      }

      await createPostMutation.mutateAsync(postData);
      
      try {
        toast.success('Post published successfully!');
      } catch (e) {
        console.log('Post published successfully!');
      }
      onPublish(postData);
      handleClose();
      
    } catch (error: any) {
      console.error('Failed to publish post:', error);
      
      // Handle specific errors
      if (error.response?.data?.message) {
        console.error('Error:', error.response.data.message);
      } else if (error.message) {
        console.error('Error:', error.message);
      } else {
        console.error('Failed to publish post. Please try again.');
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
      console.log('Draft saved successfully!');
      onSaveDraft(draftData);
    } catch (error) {
      console.error('Failed to save draft:', error);
      console.error('Failed to save draft. Please try again.');
    }
  };

  const handleClose = useCallback(() => {
    // Clean up previews
    mediaFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    reset();
    setMediaFiles([]);
    setPollOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
    setLinkPreview(null);
    setTagInput('');
    setActiveTab('content');
    setUploadProgress(0);
    onClose();
  }, [mediaFiles, reset, onClose]);

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
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'image')}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'video')}
      />

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: className,
          backdrop: 'bg-black/50 backdrop-blur-sm',
          wrapper: 'pointer-events-auto',
          body: 'py-6',
          header: 'border-b border-divider',
          footer: 'border-t border-divider'
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-2 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <Icon icon="solar:pen-new-square-linear" className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-foreground text-xl font-semibold">
                    {initialData ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <p className="text-foreground-500 text-sm">
                    {t('description')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Tooltip content="Auto-save drafts">
                  <Switch
                    isSelected={autoSave}
                    onValueChange={setAutoSave}
                    size="sm"
                    startContent={<Icon icon="solar:diskette-linear" className="h-3 w-3" />}
                  />
                </Tooltip>
                
                <Tooltip content="Advanced Options">
                  <Button
                    variant="flat"
                    size="sm"
                    onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    startContent={<Icon icon="solar:settings-linear" className="h-4 w-4" />}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Progress indicator */}
            {isUploading && (
              <Progress
                value={uploadProgress}
                color="primary"
                size="sm"
                label="Uploading media..."
                showValueLabel
              />
            )}
          </ModalHeader>

          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                variant="underlined"
                classNames={{
                  tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-12",
                  tabContent: "group-data-[selected=true]:text-primary"
                }}
              >
                <Tab 
                  key="content" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:document-text-linear" className="h-4 w-4" />
                      Content
                    </div>
                  }
                >
                  <div className="space-y-6 py-4">
                    {/* Post Type Selection */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {postTypes.map((type) => (
                        <Controller
                          key={type.key}
                          name="type"
                          control={control}
                          render={({ field }) => (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                isPressable
                                isHoverable
                                className={`cursor-pointer transition-all ${
                                  field.value === type.key
                                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                    : ''
                                }`}
                                onPress={() => field.onChange(type.key)}
                              >
                                <CardBody className="p-3 text-center">
                                  <Icon
                                    icon={type.icon}
                                    className={`mx-auto h-6 w-6 mb-2 ${
                                      field.value === type.key ? 'text-primary' : 'text-foreground-500'
                                    }`}
                                  />
                                  <p className={`text-sm font-medium ${
                                    field.value === type.key ? 'text-primary' : 'text-foreground'
                                  }`}>
                                    {type.label}
                                  </p>
                                </CardBody>
                              </Card>
                            </motion.div>
                          )}
                        />
                      ))}
                    </div>

                    {/* Title */}
                    <Controller
                      name="title"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          label="Title"
                          placeholder="Enter an engaging title..."
                          startContent={<Icon icon="solar:text-field-linear" className="h-4 w-4" />}
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          description={`${field.value?.length || 0}/200 characters`}
                          classNames={{
                            input: "text-lg"
                          }}
                        />
                      )}
                    />

                    {/* Category and Priority */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Controller
                        name="category"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Select
                            {...field}
                            label="Category"
                            placeholder="Select a category"
                            isInvalid={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(keys) => {
                              const selected = Array.from(keys)[0] as string;
                              field.onChange(selected);
                            }}
                          >
                            {categories.map((category) => (
                              <SelectItem
                                key={category.key}
                                startContent={<Icon icon={category.icon} className="h-4 w-4" />}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />

                      <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Priority"
                            placeholder="Select priority"
                            selectedKeys={[field.value]}
                            onSelectionChange={(keys) => {
                              const selected = Array.from(keys)[0] as string;
                              field.onChange(selected);
                            }}
                          >
                            {priorities.map((priority) => (
                              <SelectItem
                                key={priority.key}
                                startContent={<Icon icon={priority.icon} className="h-4 w-4" />}
                              >
                                {priority.label}
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />
                    </div>

                    {/* Content */}
                    <Controller
                      name="content"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Textarea
                          {...field}
                          label="Content"
                          placeholder="Share your thoughts, insights, or story..."
                          minRows={8}
                          maxRows={20}
                          description={`${wordCount} words • ${readTime} min read`}
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                </Tab>

                <Tab
                  key="media"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:gallery-linear" className="h-4 w-4" />
                      Media
                      {mediaFiles.length > 0 && (
                        <Badge content={mediaFiles.length} color="primary" size="sm" />
                      )}
                    </div>
                  }
                >
                  <div className="space-y-6 py-4">
                    {/* Media Upload Controls */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="flat"
                        color="primary"
                        onPress={() => handleFileSelect('image')}
                        startContent={<Icon icon="solar:camera-linear" className="h-4 w-4" />}
                        isDisabled={isUploading}
                      >
                        Add Images
                      </Button>
                      
                      <Button
                        variant="flat"
                        color="secondary"
                        onPress={() => handleFileSelect('video')}
                        startContent={<Icon icon="solar:videocamera-linear" className="h-4 w-4" />}
                        isDisabled={isUploading}
                      >
                        Add Video
                      </Button>
                    </div>

                    {/* Media Preview Grid */}
                    <AnimatePresence>
                      {mediaFiles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        >
                          {mediaFiles.map((file) => (
                            <motion.div
                              key={file.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                            >
                              <Card>
                                <CardBody className="p-3">
                                  <div className="relative mb-3">
                                    {file.type === 'image' ? (
                                      <Image
                                        src={file.preview}
                                        alt={file.altText || 'Preview'}
                                        className="h-32 w-full object-cover"
                                        radius="sm"
                                      />
                                    ) : (
                                      <div className="relative h-32 w-full">
                                        <video
                                          src={file.preview}
                                          className="h-full w-full object-cover rounded-sm"
                                          controls={false}
                                          muted
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-sm">
                                          <Icon icon="solar:play-linear" className="h-8 w-8 text-white" />
                                        </div>
                                      </div>
                                    )}
                                    
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      color="danger"
                                      variant="solid"
                                      className="absolute -top-2 -right-2"
                                      onPress={() => removeMediaFile(file.id)}
                                    >
                                      <Icon icon="solar:close-linear" className="h-3 w-3" />
                                    </Button>

                                    {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-sm">
                                        <Progress
                                          value={file.uploadProgress}
                                          color="primary"
                                          size="sm"
                                          className="w-3/4"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <Input
                                    size="sm"
                                    placeholder="Add caption..."
                                    value={file.caption || ''}
                                    onValueChange={(value) => updateMediaCaption(file.id, value)}
                                    className="mb-2"
                                  />
                                  
                                  <Input
                                    size="sm"
                                    placeholder="Alt text for accessibility..."
                                    value={file.altText || ''}
                                    onValueChange={(value) => updateMediaAltText(file.id, value)}
                                  />
                                </CardBody>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Poll Options (only for poll type) */}
                    {watchedType === 'poll' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Poll Options</h4>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={addPollOption}
                            startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
                            isDisabled={pollOptions.length >= 6}
                          >
                            Add Option
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {pollOptions.map((option, index) => (
                            <div key={option.id} className="flex gap-2">
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option.text}
                                onValueChange={(value) => updatePollOption(option.id, value)}
                                startContent={
                                  <span className="text-foreground-500 text-sm">
                                    {index + 1}.
                                  </span>
                                }
                              />
                              
                              {pollOptions.length > 2 && (
                                <Button
                                  isIconOnly
                                  size="sm"
                                  color="danger"
                                  variant="flat"
                                  onPress={() => removePollOption(option.id)}
                                >
                                  <Icon icon="solar:trash-bin-minimalistic-linear" className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Link Preview (only for link type) */}
                    {watchedType === 'link' && (
                      <div className="space-y-4">
                        <Input
                          label="Link URL"
                          placeholder="https://example.com"
                          onValueChange={fetchLinkPreview}
                          startContent={<Icon icon="solar:link-linear" className="h-4 w-4" />}
                        />

                        {linkPreview && (
                          <Card>
                            <CardBody className="p-4">
                              <div className="flex gap-4">
                                {linkPreview.image && (
                                  <Image
                                    src={linkPreview.image}
                                    alt={linkPreview.title}
                                    className="h-20 w-20 object-cover"
                                    radius="sm"
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-semibold line-clamp-2">{linkPreview.title}</h4>
                                  <p className="text-foreground-600 text-sm line-clamp-2 mb-1">
                                    {linkPreview.description}
                                  </p>
                                  <p className="text-foreground-500 text-xs">{linkPreview.domain}</p>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab
                  key="tags"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:hashtag-linear" className="h-4 w-4" />
                      Tags
                      {watchedTags.length > 0 && (
                        <Badge content={watchedTags.length} color="primary" size="sm" />
                      )}
                    </div>
                  }
                >
                  <div className="space-y-6 py-4">
                    {/* Tag Input */}
                    <div className="flex gap-2">
                      <Input
                        label="Add Tags"
                        placeholder="Enter tag and press Enter"
                        value={tagInput}
                        onValueChange={setTagInput}
                        onKeyDown={handleKeyPress}
                        startContent={<Icon icon="solar:hashtag-linear" className="h-4 w-4" />}
                        description={`${watchedTags.length}/10 tags`}
                      />
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={handleAddTag}
                        isDisabled={!tagInput.trim() || watchedTags.length >= 10}
                      >
                        Add
                      </Button>
                    </div>

                    {/* Tags Display */}
                    {watchedTags.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Current Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {watchedTags.map((tag, index) => (
                            <Chip
                              key={index}
                              onClose={() => handleRemoveTag(tag)}
                              variant="flat"
                              color="primary"
                              startContent={<Icon icon="solar:hashtag-linear" className="h-3 w-3" />}
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Tags Suggestions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Popular Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {['javascript', 'react', 'nextjs', 'typescript', 'css', 'design', 'ui-ux'].map((tag) => (
                          <Chip
                            key={tag}
                            variant="bordered"
                            className="cursor-pointer"
                            onClick={() => {
                              if (!watchedTags.includes(tag) && watchedTags.length < 10) {
                                setValue('tags', [...watchedTags, tag], { shouldValidate: true });
                              }
                            }}
                          >
                            #{tag}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab>

                {showAdvancedOptions && (
                  <Tab
                    key="advanced"
                    title={
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:settings-linear" className="h-4 w-4" />
                        Advanced
                      </div>
                    }
                  >
                    <div className="space-y-6 py-4">
                      {/* Visibility Settings */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Privacy & Visibility</h4>
                        
                        <Controller
                          name="visibility"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Who can see this post?"
                              selectedKeys={[field.value]}
                              onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                field.onChange(selected);
                              }}
                            >
                              <SelectItem key="public" startContent={<Icon icon="solar:global-linear" className="h-4 w-4" />}>
                                Public - Everyone can see
                              </SelectItem>
                              <SelectItem key="followers" startContent={<Icon icon="solar:users-group-rounded-linear" className="h-4 w-4" />}>
                                Followers only
                              </SelectItem>
                              <SelectItem key="private" startContent={<Icon icon="solar:lock-linear" className="h-4 w-4" />}>
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
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Allow Comments</p>
                                  <p className="text-foreground-500 text-sm">Let people comment on your post</p>
                                </div>
                                <Switch
                                  isSelected={field.value}
                                  onValueChange={field.onChange}
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="allowSharing"
                            control={control}
                            render={({ field }) => (
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Allow Sharing</p>
                                  <p className="text-foreground-500 text-sm">Let people share your post</p>
                                </div>
                                <Switch
                                  isSelected={field.value}
                                  onValueChange={field.onChange}
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="contentWarning"
                            control={control}
                            render={({ field }) => (
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Content Warning</p>
                                  <p className="text-foreground-500 text-sm">Mark if content might be sensitive</p>
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
                      </div>

                      <Divider />

                      {/* Schedule Publishing */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Publishing Options</h4>
                        
                        <Controller
                          name="scheduleDate"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="datetime-local"
                              label="Schedule for later (optional)"
                              placeholder="Select date and time"
                              startContent={<Icon icon="solar:calendar-linear" className="h-4 w-4" />}
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                              onValueChange={(value) => {
                                field.onChange(value ? new Date(value) : undefined);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </Tab>
                )}
              </Tabs>

              {/* Preview Section */}
              <Divider />
              
              <div className="space-y-4">
                <h4 className="text-foreground flex items-center gap-2 font-semibold">
                  <Icon icon="solar:eye-linear" className="h-4 w-4" />
                  Preview
                </h4>

                <Card className="bg-default-50">
                  <CardBody className="p-4">
                    <div className="bg-background rounded-lg border p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar size="sm" />
                        <div>
                          <p className="text-foreground text-sm font-semibold">Your Name</p>
                          <p className="text-foreground-500 text-xs">@username • now</p>
                        </div>
                      </div>

                      {watchedTitle && (
                        <h3 className="text-foreground mb-2 font-bold">{watchedTitle}</h3>
                      )}

                      <p className="text-foreground-700 mb-3 text-sm">
                        {watchedContent || 'Your content will appear here...'}
                      </p>

                      {/* Media Preview */}
                      {mediaFiles.length > 0 && (
                        <div className="mb-3">
                          {mediaFiles.length === 1 ? (
                            mediaFiles[0].type === 'image' ? (
                              <Image
                                src={mediaFiles[0].preview}
                                alt={mediaFiles[0].altText || 'Preview'}
                                className="h-48 w-full object-cover"
                                radius="sm"
                              />
                            ) : (
                              <video
                                src={mediaFiles[0].preview}
                                className="h-48 w-full object-cover rounded-sm"
                                controls
                                muted
                              />
                            )
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {mediaFiles.slice(0, 4).map((file) => (
                                <div key={file.id} className="relative">
                                  {file.type === 'image' ? (
                                    <Image
                                      src={file.preview}
                                      alt={file.altText || 'Preview'}
                                      className="h-24 w-full object-cover"
                                      radius="sm"
                                    />
                                  ) : (
                                    <video
                                      src={file.preview}
                                      className="h-24 w-full object-cover rounded-sm"
                                      muted
                                    />
                                  )}
                                  {mediaFiles.length > 4 && file === mediaFiles[3] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-sm">
                                      <span className="text-white font-semibold">
                                        +{mediaFiles.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags Preview */}
                      {watchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {watchedTags.slice(0, 3).map((tag, index) => (
                            <Chip key={index} size="sm" variant="flat">
                              #{tag}
                            </Chip>
                          ))}
                          {watchedTags.length > 3 && (
                            <Chip size="sm" variant="flat">
                              +{watchedTags.length - 3} more
                            </Chip>
                          )}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </form>
          </ModalBody>

          <ModalFooter className="pt-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="flat"
                  onPress={handleSaveDraft}
                  isLoading={isSavingDraft}
                  startContent={
                    !isSavingDraft && <Icon icon="solar:diskette-linear" className="h-4 w-4" />
                  }
                >
                  {tCommon('save')} Draft
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="light" onPress={handleClose}>
                  {tCommon('cancel')}
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit(onSubmit)}
                  isLoading={isPublishing}
                  isDisabled={!isValid || isUploading}
                  startContent={
                    !isPublishing && <Icon icon="solar:send-square-linear" className="h-4 w-4" />
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
