'use client';

import React, { useState, useRef, useCallback } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Select,
  SelectItem,
  Switch,
  Tabs,
  Tab,
  Textarea,
  useDisclosure,
  Slider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: number;
  thumbnail?: string;
  duration?: number;
}

interface Poll {
  question: string;
  options: string[];
  duration: number; // hours
  allowMultiple: boolean;
}

interface PostDraft {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video' | 'image' | 'poll' | 'quote';
  subcast?: string;
  tags: string[];
  media: MediaFile[];
  poll?: Poll;
  scheduledAt?: string;
  visibility: 'public' | 'followers' | 'subcast';
  allowComments: boolean;
  allowSharing: boolean;
  isNSFW: boolean;
  isDraft: boolean;
}

interface ContentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish?: (post: PostDraft) => void;
  onSaveDraft?: (post: PostDraft) => void;
  initialDraft?: Partial<PostDraft>;
  className?: string;
}

const POST_TYPES = [
  { key: 'article', label: 'Article', icon: 'solar:document-text-linear', description: 'Write a detailed article or blog post' },
  { key: 'image', label: 'Image', icon: 'solar:gallery-linear', description: 'Share images with captions' },
  { key: 'video', label: 'Video', icon: 'solar:videocamera-record-linear', description: 'Upload or embed videos' },
  { key: 'poll', label: 'Poll', icon: 'solar:chart-2-linear', description: 'Create interactive polls' },
  { key: 'quote', label: 'Quote', icon: 'solar:quote-down-linear', description: 'Share inspiring quotes' }
];

const SUBCASTS = [
  { key: 'ai-innovation', label: 'AI Innovation', icon: 'solar:cpu-linear' },
  { key: 'design-trends', label: 'Design Trends', icon: 'solar:palette-linear' },
  { key: 'dev-life', label: 'Developer Life', icon: 'solar:code-square-linear' },
  { key: 'startup-stories', label: 'Startup Stories', icon: 'solar:rocket-linear' },
  { key: 'marketing-mastery', label: 'Marketing Mastery', icon: 'solar:megaphone-linear' }
];

const SUGGESTED_TAGS = [
  'AI', 'Machine Learning', 'React', 'TypeScript', 'Design', 'UX', 'Startup', 'Marketing',
  'Programming', 'Web Development', 'Mobile', 'Cloud', 'DevOps', 'Business', 'Freelance'
];

export default function ContentCreator({
  isOpen,
  onClose,
  onPublish,
  onSaveDraft,
  initialDraft,
  className = ''
}: ContentCreatorProps) {
  const t = useTranslations('broadcasts.creator');
  
  const [draft, setDraft] = useState<PostDraft>({
    id: initialDraft?.id || Date.now().toString(),
    title: initialDraft?.title || '',
    content: initialDraft?.content || '',
    type: initialDraft?.type || 'article',
    subcast: initialDraft?.subcast || '',
    tags: initialDraft?.tags || [],
    media: initialDraft?.media || [],
    scheduledAt: initialDraft?.scheduledAt || '',
    visibility: initialDraft?.visibility || 'public',
    allowComments: initialDraft?.allowComments ?? true,
    allowSharing: initialDraft?.allowSharing ?? true,
    isNSFW: initialDraft?.isNSFW || false,
    isDraft: initialDraft?.isDraft ?? true,
    poll: initialDraft?.poll || {
      question: '',
      options: ['', ''],
      duration: 24,
      allowMultiple: false
    }
  });

  const [activeTab, setActiveTab] = useState('content');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count and reading time
  React.useEffect(() => {
    const words = draft.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // Assuming 200 words per minute
  }, [draft.content]);

  const updateDraft = (updates: Partial<PostDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaFile: MediaFile = {
        id: Date.now().toString() + i,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      updateDraft({
        media: [...draft.media, mediaFile]
      });
    }

    setIsUploading(false);
    setUploadProgress(0);
  }, [draft.media]);

  const removeMedia = (mediaId: string) => {
    updateDraft({
      media: draft.media.filter(m => m.id !== mediaId)
    });
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !draft.tags.includes(trimmedTag)) {
      updateDraft({
        tags: [...draft.tags, trimmedTag]
      });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    updateDraft({
      tags: draft.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addPollOption = () => {
    if (draft.poll && draft.poll.options.length < 4) {
      updateDraft({
        poll: {
          ...draft.poll,
          options: [...draft.poll.options, '']
        }
      });
    }
  };

  const removePollOption = (index: number) => {
    if (draft.poll && draft.poll.options.length > 2) {
      updateDraft({
        poll: {
          ...draft.poll,
          options: draft.poll.options.filter((_, i) => i !== index)
        }
      });
    }
  };

  const updatePollOption = (index: number, value: string) => {
    if (draft.poll) {
      const newOptions = [...draft.poll.options];
      newOptions[index] = value;
      updateDraft({
        poll: {
          ...draft.poll,
          options: newOptions
        }
      });
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate publishing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const publishedPost = {
      ...draft,
      isDraft: false,
      scheduledAt: draft.scheduledAt || new Date().toISOString()
    };
    
    onPublish?.(publishedPost);
    setIsPublishing(false);
    onClose();
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(draft);
  };

  const getCharacterLimit = () => {
    switch (draft.type) {
      case 'quote':
        return 280;
      case 'article':
        return 10000;
      default:
        return 2000;
    }
  };

  const characterLimit = getCharacterLimit();
  const isOverLimit = draft.content.length > characterLimit;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0"
      }}
    >
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader className="flex items-center justify-between border-b border-default-200 pb-4">
              <div className="flex items-center gap-3">
                <Icon icon="solar:pen-new-square-linear" className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">Create Post</h2>
                  <p className="text-sm text-foreground-500">
                    Share your thoughts with the community
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="flat"
                  size="sm"
                  startContent={<Icon icon="solar:diskette-linear" className="h-4 w-4" />}
                  onPress={handleSaveDraft}
                >
                  Save Draft
                </Button>
                <Button variant="light" onPress={onModalClose}>
                  Cancel
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Post Type Selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Post Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {POST_TYPES.map((type) => (
                        <Card
                          key={type.key}
                          isPressable
                          className={`cursor-pointer transition-all ${
                            draft.type === type.key
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                              : 'border-default-200 hover:border-primary/50'
                          }`}
                          onPress={() => updateDraft({ type: type.key as any })}
                        >
                          <CardBody className="p-4 text-center">
                            <Icon
                              icon={type.icon}
                              className={`h-6 w-6 mx-auto mb-2 ${
                                draft.type === type.key ? 'text-primary' : 'text-default-400'
                              }`}
                            />
                            <h3 className="text-sm font-medium">{type.label}</h3>
                            <p className="text-xs text-foreground-500 mt-1">
                              {type.description}
                            </p>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <Input
                      label="Title"
                      placeholder="Give your post a compelling title..."
                      value={draft.title}
                      onValueChange={(value) => updateDraft({ title: value })}
                      classNames={{
                        input: "text-lg font-medium"
                      }}
                    />
                  </div>

                  {/* Content Tabs */}
                  <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    variant="underlined"
                  >
                    <Tab key="content" title="Content">
                      <div className="space-y-4 pt-4">
                        {/* Content Editor */}
                        <div>
                          <Textarea
                            ref={contentRef}
                            placeholder={
                              draft.type === 'quote'
                                ? 'Share an inspiring quote...'
                                : draft.type === 'article'
                                  ? 'Write your article content...'
                                  : 'What\'s on your mind?'
                            }
                            value={draft.content}
                            onValueChange={(value) => updateDraft({ content: value })}
                            minRows={8}
                            maxRows={20}
                            classNames={{
                              input: "text-base leading-relaxed"
                            }}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4 text-sm text-foreground-500">
                              <span>{wordCount} words</span>
                              {readingTime > 0 && <span>{readingTime} min read</span>}
                            </div>
                            <div className={`text-sm ${isOverLimit ? 'text-danger' : 'text-foreground-500'}`}>
                              {draft.content.length}/{characterLimit}
                            </div>
                          </div>
                          {isOverLimit && (
                            <p className="text-xs text-danger mt-1">
                              Content exceeds the character limit for this post type.
                            </p>
                          )}
                        </div>

                        {/* Poll Creator */}
                        {draft.type === 'poll' && (
                          <Card className="border-default-200">
                            <CardBody className="p-4">
                              <h3 className="text-sm font-medium mb-4">Poll Settings</h3>
                              <div className="space-y-4">
                                <Input
                                  label="Poll Question"
                                  placeholder="What would you like to ask?"
                                  value={draft.poll?.question || ''}
                                  onValueChange={(value) => updateDraft({
                                    poll: { ...draft.poll!, question: value }
                                  })}
                                />
                                
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Options</label>
                                  <div className="space-y-2">
                                    {draft.poll?.options.map((option, index) => (
                                      <div key={index} className="flex gap-2">
                                        <Input
                                          placeholder={`Option ${index + 1}`}
                                          value={option}
                                          onValueChange={(value) => updatePollOption(index, value)}
                                        />
                                        {draft.poll!.options.length > 2 && (
                                          <Button
                                            isIconOnly
                                            variant="light"
                                            color="danger"
                                            onPress={() => removePollOption(index)}
                                          >
                                            <Icon icon="solar:trash-bin-minimalistic-linear" className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  {draft.poll!.options.length < 4 && (
                                    <Button
                                      variant="flat"
                                      size="sm"
                                      className="mt-2"
                                      startContent={<Icon icon="solar:add-circle-linear" className="h-4 w-4" />}
                                      onPress={addPollOption}
                                    >
                                      Add Option
                                    </Button>
                                  )}
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <label className="text-sm font-medium mb-2 block">
                                      Duration: {draft.poll?.duration || 24} hours
                                    </label>
                                    <Slider
                                      size="sm"
                                      step={1}
                                      minValue={1}
                                      maxValue={168}
                                      value={draft.poll?.duration || 24}
                                      onChange={(value) => updateDraft({
                                        poll: { ...draft.poll!, duration: value as number }
                                      })}
                                      className="max-w-md"
                                    />
                                  </div>
                                  <Switch
                                    size="sm"
                                    isSelected={draft.poll?.allowMultiple || false}
                                    onValueChange={(checked) => updateDraft({
                                      poll: { ...draft.poll!, allowMultiple: checked }
                                    })}
                                  >
                                    <span className="text-sm">Multiple choice</span>
                                  </Switch>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        )}
                      </div>
                    </Tab>

                    <Tab key="media" title="Media">
                      <div className="space-y-4 pt-4">
                        {/* Media Upload */}
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                            className="hidden"
                          />
                          
                          <Card
                            isPressable
                            className="border-2 border-dashed border-default-300 hover:border-primary"
                            onPress={() => fileInputRef.current?.click()}
                          >
                            <CardBody className="p-8 text-center">
                              <Icon icon="solar:cloud-upload-linear" className="h-12 w-12 text-default-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium mb-2">Upload Media</h3>
                              <p className="text-sm text-foreground-500 mb-4">
                                Drag and drop files here or click to browse
                              </p>
                              <p className="text-xs text-foreground-400">
                                Supports images, videos, and documents up to 50MB
                              </p>
                            </CardBody>
                          </Card>

                          {isUploading && (
                            <div className="mt-4">
                              <Progress
                                value={uploadProgress}
                                color="primary"
                                className="mb-2"
                              />
                              <p className="text-sm text-foreground-500">
                                Uploading... {uploadProgress}%
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Media Preview */}
                        {draft.media.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-3">Attached Media</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {draft.media.map((media) => (
                                <Card key={media.id} className="relative">
                                  <CardBody className="p-0">
                                    {media.type === 'image' ? (
                                      <img
                                        src={media.url}
                                        alt={media.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                      />
                                    ) : media.type === 'video' ? (
                                      <video
                                        src={media.url}
                                        className="w-full h-32 object-cover rounded-lg"
                                        controls
                                      />
                                    ) : (
                                      <div className="w-full h-32 bg-default-100 rounded-lg flex items-center justify-center">
                                        <Icon icon="solar:document-linear" className="h-8 w-8 text-default-400" />
                                      </div>
                                    )}
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      color="danger"
                                      variant="solid"
                                      className="absolute top-2 right-2"
                                      onPress={() => removeMedia(media.id)}
                                    >
                                      <Icon icon="solar:close-circle-bold" className="h-4 w-4" />
                                    </Button>
                                  </CardBody>
                                  <div className="p-2">
                                    <p className="text-xs text-foreground-500 truncate">
                                      {media.name}
                                    </p>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Tab>

                    <Tab key="settings" title="Settings">
                      <div className="space-y-6 pt-4">
                        {/* Subcast Selection */}
                        <div>
                          <Select
                            label="Subcast"
                            placeholder="Choose a subcast (optional)"
                            selectedKeys={draft.subcast ? [draft.subcast] : []}
                            onSelectionChange={(keys) => updateDraft({ subcast: Array.from(keys)[0] as string })}
                          >
                            {SUBCASTS.map((subcast) => (
                              <SelectItem
                                key={subcast.key}
                                startContent={<Icon icon={subcast.icon} className="h-4 w-4" />}
                              >
                                {subcast.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Tags</label>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a tag..."
                                value={tagInput}
                                onValueChange={setTagInput}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag(tagInput);
                                  }
                                }}
                              />
                              <Button
                                onPress={() => addTag(tagInput)}
                                isDisabled={!tagInput.trim()}
                              >
                                Add
                              </Button>
                            </div>

                            {draft.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {draft.tags.map((tag) => (
                                  <Chip
                                    key={tag}
                                    onClose={() => removeTag(tag)}
                                    variant="flat"
                                    color="primary"
                                    size="sm"
                                  >
                                    {tag}
                                  </Chip>
                                ))}
                              </div>
                            )}

                            <div>
                              <p className="text-xs text-foreground-500 mb-2">Suggested tags:</p>
                              <div className="flex flex-wrap gap-2">
                                {SUGGESTED_TAGS.filter(tag => !draft.tags.includes(tag)).slice(0, 8).map((tag) => (
                                  <Chip
                                    key={tag}
                                    variant="bordered"
                                    size="sm"
                                    className="cursor-pointer hover:bg-primary/10"
                                    onClick={() => addTag(tag)}
                                  >
                                    {tag}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visibility & Options */}
                        <div className="space-y-4">
                          <Select
                            label="Visibility"
                            selectedKeys={[draft.visibility]}
                            onSelectionChange={(keys) => updateDraft({ visibility: Array.from(keys)[0] as any })}
                          >
                            <SelectItem key="public">Public</SelectItem>
                            <SelectItem key="followers">Followers only</SelectItem>
                            <SelectItem key="subcast">Subcast members only</SelectItem>
                          </Select>

                          <div className="space-y-3">
                            <Switch
                              isSelected={draft.allowComments}
                              onValueChange={(checked) => updateDraft({ allowComments: checked })}
                            >
                              Allow comments
                            </Switch>
                            <Switch
                              isSelected={draft.allowSharing}
                              onValueChange={(checked) => updateDraft({ allowSharing: checked })}
                            >
                              Allow sharing
                            </Switch>
                            <Switch
                              isSelected={draft.isNSFW}
                              onValueChange={(checked) => updateDraft({ isNSFW: checked })}
                            >
                              Mark as NSFW
                            </Switch>
                          </div>
                        </div>

                        {/* Scheduling */}
                        <div>
                          <Input
                            type="datetime-local"
                            label="Schedule for later (optional)"
                            value={draft.scheduledAt}
                            onValueChange={(value) => updateDraft({ scheduledAt: value })}
                          />
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>

                {/* Sidebar Preview */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-0">
                    <CardBody className="p-4">
                      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Icon icon="solar:eye-linear" className="h-4 w-4" />
                        Preview
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Preview Card */}
                        <Card className="border-default-200">
                          <CardBody className="p-4">
                            {/* Author */}
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar
                                src="https://i.pravatar.cc/150?img=9"
                                size="sm"
                              />
                              <div>
                                <p className="text-sm font-medium">You</p>
                                <p className="text-xs text-foreground-500">Just now</p>
                              </div>
                            </div>

                            {/* Content */}
                            {draft.title && (
                              <h4 className="text-base font-semibold mb-2 line-clamp-2">
                                {draft.title}
                              </h4>
                            )}
                            
                            {draft.content && (
                              <p className="text-sm text-foreground-600 mb-3 line-clamp-3">
                                {draft.content}
                              </p>
                            )}

                            {/* Tags */}
                            {draft.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {draft.tags.slice(0, 3).map((tag) => (
                                  <Chip key={tag} size="sm" variant="flat" className="text-xs">
                                    {tag}
                                  </Chip>
                                ))}
                                {draft.tags.length > 3 && (
                                  <span className="text-xs text-foreground-400">
                                    +{draft.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Media preview */}
                            {draft.media.length > 0 && (
                              <div className="bg-default-100 rounded-lg p-3 mb-3">
                                <p className="text-xs text-foreground-500">
                                  {draft.media.length} media file{draft.media.length > 1 ? 's' : ''} attached
                                </p>
                              </div>
                            )}

                            {/* Poll preview */}
                            {draft.type === 'poll' && draft.poll?.question && (
                              <div className="border border-default-200 rounded-lg p-3 mb-3">
                                <p className="text-sm font-medium mb-2">{draft.poll.question}</p>
                                <div className="space-y-1">
                                  {draft.poll.options.filter(opt => opt.trim()).map((option, index) => (
                                    <div key={index} className="text-xs bg-default-100 rounded px-2 py-1">
                                      {option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Engagement */}
                            <div className="flex items-center gap-4 text-xs text-foreground-500">
                              <span className="flex items-center gap-1">
                                <Icon icon="solar:heart-linear" className="h-3 w-3" />
                                0
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="solar:chat-round-linear" className="h-3 w-3" />
                                0
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="solar:share-linear" className="h-3 w-3" />
                                0
                              </span>
                            </div>
                          </CardBody>
                        </Card>

                        {/* Post Stats */}
                        <div className="text-xs text-foreground-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="capitalize">{draft.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Word count:</span>
                            <span>{wordCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reading time:</span>
                            <span>{readingTime} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Character count:</span>
                            <span className={isOverLimit ? 'text-danger' : ''}>
                              {draft.content.length}/{characterLimit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-default-200">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    color={draft.visibility === 'public' ? 'success' : 'warning'}
                    variant="flat"
                  >
                    {draft.visibility}
                  </Chip>
                  {draft.scheduledAt && (
                    <Chip size="sm" color="primary" variant="flat">
                      Scheduled
                    </Chip>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="flat" onPress={onModalClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={handlePublish}
                    isLoading={isPublishing}
                    isDisabled={!draft.title.trim() || !draft.content.trim() || isOverLimit}
                    startContent={
                      !isPublishing && (
                        <Icon icon="solar:rocket-linear" className="h-4 w-4" />
                      )
                    }
                  >
                    {isPublishing ? 'Publishing...' : draft.scheduledAt ? 'Schedule' : 'Publish'}
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
