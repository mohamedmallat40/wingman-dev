import { z } from 'zod';
import type { MediaFile } from '@/components/ui/file-upload/MediaUpload';
import type { BroadcastPost } from '../../../types';

// Enhanced schema with comprehensive validation
export const createBroadcastSchema = z.object({
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

export type BroadcastFormData = z.infer<typeof createBroadcastSchema>;

export interface ContentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (post: Partial<BroadcastPost>) => void;
  onSaveDraft: (draft: Partial<BroadcastPost>) => void;
  initialData?: Partial<BroadcastPost>;
  className?: string;
}

// Keep the old name as alias for backward compatibility
export type EnhancedContentCreatorProps = ContentCreatorProps;

export interface ContentTabProps {
  control: any;
  errors: any;
  availableTopics: any[];
  topicsLoading: boolean;
  watchedContent: string;
  wordCount: number;
  readTime: number;
}

export interface MediaTabProps {
  mediaFiles: MediaFile[];
  setMediaFiles: (files: MediaFile[]) => void;
  isUploading: boolean;
}

export interface AdvancedTabProps {
  control: any;
}

export interface PreviewSectionProps {
  watchedTitle: string;
  watchedContent: string;
  watchedTopics: string[];
  watchedSkills: string[];
  availableTopics: any[];
  mediaFiles: MediaFile[];
  setMediaFiles: (files: MediaFile[]) => void;
  wordCount: number;
  readTime: number;
  profileLoading: boolean;
  currentUser: any;
}

export interface FooterActionsProps {
  onSaveDraft: () => void;
  onClearForm: () => void;
  onClose: () => void;
  onSubmit: () => void;
  isSavingDraft: boolean;
  isPublishing: boolean;
  isValid: boolean;
  isUploading: boolean;
  isDirty: boolean;
  hasFormChanges?: boolean;
  persistedFormData: any;
  initialData?: Partial<BroadcastPost>;
  isEditMode?: boolean;
}