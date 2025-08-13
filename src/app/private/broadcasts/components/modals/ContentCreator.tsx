'use client';

import React, { useMemo, useState } from 'react';

import type { CreatePostData } from '../../services/broadcast.service';

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
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { useCreatePost, useSaveDraft } from '../../hooks';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { type BroadcastPost } from '../../types';
import { calculateReadTime, extractHashtags, generatePostId } from '../../utils/broadcast-utils';

interface ContentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (post: Partial<BroadcastPost>) => void;
  onSaveDraft: (draft: Partial<BroadcastPost>) => void;
  initialData?: Partial<BroadcastPost>;
  className?: string;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({
  isOpen,
  onClose,
  onPublish,
  onSaveDraft,
  initialData,
  className = ''
}) => {
  const { preferences } = useBroadcastStore();
  const createPostMutation = useCreatePost();
  const saveDraftMutation = useSaveDraft();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    type: (initialData?.type as CreatePostData['type']) || 'article',
    category: initialData?.category || '',
    priority: (initialData?.priority as CreatePostData['priority']) || 'normal',
    tags: initialData?.tags || [],
    topicId: initialData?.topic?.id || undefined
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [linkData, setLinkData] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);
  const [pollData, setPollData] = useState<{
    question: string;
    options: string[];
  } | null>(null);

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const postTypes = [
    { key: 'article', label: 'Article', icon: 'solar:document-text-linear' },
    { key: 'video', label: 'Video', icon: 'solar:videocamera-linear' },
    { key: 'image', label: 'Image', icon: 'solar:camera-linear' },
    { key: 'poll', label: 'Poll', icon: 'solar:chart-2-linear' },
    { key: 'quote', label: 'Quote', icon: 'solar:quote-up-linear' },
    { key: 'link', label: 'Link', icon: 'solar:link-linear' }
  ];

  const categories = [
    'Technology',
    'Design',
    'Business',
    'Marketing',
    'Development',
    'AI & ML',
    'Startup',
    'Career',
    'Remote Work',
    'Productivity'
  ];

  const priorities = [
    { key: 'low', label: 'Low Priority', color: 'default' },
    { key: 'normal', label: 'Normal', color: 'primary' },
    { key: 'high', label: 'High Priority', color: 'warning' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.type === 'poll' && !pollData?.question) {
      newErrors.poll = 'Poll question is required';
    }

    if (formData.type === 'link' && !linkData?.url) {
      newErrors.link = 'Link URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    try {
      const postData: CreatePostData = {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: [...formData.tags, ...extractHashtags(formData.content)],
        priority: formData.priority,
        topicId: formData.topicId
      };

      // Add media data based on post type
      if (mediaFiles.length > 0) {
        postData.media = {
          type: formData.type === 'video' ? 'video' : 'image',
          files: mediaFiles
        };
      }

      if (linkData && formData.type === 'link') {
        postData.media = {
          type: 'link',
          linkData
        };
      }

      if (pollData && formData.type === 'poll') {
        postData.poll = {
          question: pollData.question,
          options: pollData.options,
          duration: 24 // Default 24 hours
        };
      }

      await createPostMutation.mutateAsync(postData);

      if (onPublish) {
        onPublish(postData as any);
      }

      handleClose();
    } catch (error) {
      console.error('Failed to publish post:', error);
      // Error handling is done by the mutation
    }
  };

  const handleSaveDraft = async () => {
    try {
      const draftData = {
        ...formData,
        id: initialData?.id,
        timestamp: new Date().toISOString()
      };

      await saveDraftMutation.mutateAsync(draftData);

      if (onSaveDraft) {
        onSaveDraft(draftData as any);
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      type: 'article',
      category: '',
      priority: 'normal',
      tags: []
    });
    setTagInput('');
    onClose();
  };

  // Memoize form validation to prevent infinite re-renders
  const isFormValid = useMemo(() => {
    return (
      formData.title.trim() !== '' &&
      formData.content.trim() !== '' &&
      formData.category !== '' &&
      (formData.type !== 'poll' || pollData?.question) &&
      (formData.type !== 'link' || linkData?.url)
    );
  }, [
    formData.title,
    formData.content,
    formData.category,
    formData.type,
    pollData?.question,
    linkData?.url
  ]);

  const wordCount = formData.content.trim().split(/\s+/).length;
  const readTime = calculateReadTime(formData.content);
  const isPublishing = createPostMutation.isPending;
  const isSavingDraft = saveDraftMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='4xl'
      scrollBehavior='inside'
      classNames={{
        base: className,
        backdrop: 'bg-black/50 backdrop-blur-sm',
        wrapper: 'pointer-events-auto',
        body: 'py-6'
      }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-2 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
              <Icon icon='solar:pen-new-square-linear' className='text-primary h-6 w-6' />
            </div>
            <div>
              <h2 className='text-foreground text-xl font-semibold'>Create New Post</h2>
              <p className='text-foreground-500 text-sm'>Share your thoughts with the community</p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className='space-y-6'>
            {/* Post Type & Priority */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Select
                label='Post Type'
                placeholder='Select post type'
                selectedKeys={[formData.type]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleInputChange('type', selected);
                }}
                startContent={
                  <Icon
                    icon={
                      postTypes.find((p) => p.key === formData.type)?.icon ||
                      'solar:document-linear'
                    }
                    className='h-4 w-4'
                  />
                }
              >
                {postTypes.map((type) => (
                  <SelectItem
                    key={type.key}
                    startContent={<Icon icon={type.icon} className='h-4 w-4' />}
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label='Priority'
                placeholder='Select priority'
                selectedKeys={[formData.priority]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleInputChange('priority', selected);
                }}
              >
                {priorities.map((priority) => (
                  <SelectItem key={priority.key}>{priority.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Title */}
            <Input
              label='Title'
              placeholder='Enter an engaging title...'
              value={formData.title}
              onValueChange={(value) => handleInputChange('title', value)}
              startContent={<Icon icon='solar:text-field-linear' className='h-4 w-4' />}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              classNames={{
                input: 'text-lg'
              }}
            />

            {/* Category */}
            <Select
              label='Category'
              placeholder='Select a category'
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleInputChange('category', selected);
              }}
              isInvalid={!!errors.category}
              errorMessage={errors.category}
            >
              {categories.map((category) => (
                <SelectItem key={category}>{category}</SelectItem>
              ))}
            </Select>

            {/* Content */}
            <Textarea
              label='Content'
              placeholder='Share your thoughts, insights, or story...'
              value={formData.content}
              onValueChange={(value) => handleInputChange('content', value)}
              minRows={8}
              maxRows={20}
              description={`${wordCount} words • ${readTime} min read`}
              isInvalid={!!errors.content}
              errorMessage={errors.content}
            />

            {/* Tags */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <Input
                  label='Add Tags'
                  placeholder='Enter tag and press Enter'
                  value={tagInput}
                  onValueChange={setTagInput}
                  onKeyDown={handleKeyPress}
                  startContent={<Icon icon='solar:hashtag-linear' className='h-4 w-4' />}
                />
                <Button
                  color='primary'
                  variant='flat'
                  onPress={handleAddTag}
                  isDisabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      onClose={() => handleRemoveTag(tag)}
                      variant='flat'
                      color='primary'
                    >
                      #{tag}
                    </Chip>
                  ))}
                </div>
              )}
            </div>

            <Divider />

            {/* Preview */}
            <div className='bg-default-50 rounded-lg p-4'>
              <h4 className='text-foreground mb-3 flex items-center gap-2 font-semibold'>
                <Icon icon='solar:eye-linear' className='h-4 w-4' />
                Preview
              </h4>

              <div className='bg-background rounded-lg border p-4'>
                <div className='mb-3 flex items-center gap-3'>
                  <Avatar size='sm' />
                  <div>
                    <p className='text-foreground text-sm font-semibold'>Your Name</p>
                    <p className='text-foreground-500 text-xs'>@username • now</p>
                  </div>
                </div>

                {formData.title && (
                  <h3 className='text-foreground mb-2 font-bold'>{formData.title}</h3>
                )}

                <p className='text-foreground-700 mb-3 text-sm'>
                  {formData.content || 'Your content will appear here...'}
                </p>

                {formData.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {formData.tags.slice(0, 3).map((tag, index) => (
                      <Chip key={index} size='sm' variant='flat'>
                        #{tag}
                      </Chip>
                    ))}
                    {formData.tags.length > 3 && (
                      <Chip size='sm' variant='flat'>
                        +{formData.tags.length - 3} more
                      </Chip>
                    )}
                  </div>
                )}
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
                Save Draft
              </Button>
            </div>

            <div className='flex gap-2'>
              <Button variant='light' onPress={handleClose}>
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handlePublish}
                isLoading={isPublishing}
                isDisabled={!isFormValid}
                startContent={
                  !isPublishing && <Icon icon='solar:send-square-linear' className='h-4 w-4' />
                }
              >
                Publish Post
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContentCreator;
