import type { MediaFile } from '@/components/ui/file-upload/MediaUpload';
import type { BroadcastPost } from '../../../types';

import { z } from 'zod';

// URL validation regex - more permissive to handle real-world URLs
const urlRegex =
  /^https?:\/\/(?:[\w.-])+(?:\:[0-9]+)?(?:\/(?:[\w\/_@~!$&'()*+,;=:-])*(?:\?(?:[\w&=%@~!$'()*+,;:-])*)?(?:\#(?:[\w@~!$&'()*+,;=:-])*)?)?$/;

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
  link: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true; // Allow empty string
        return urlRegex.test(val);
      },
      {
        message: 'Please enter a valid URL (must start with http:// or https://)'
      }
    ),
  skills: z.array(z.string()).max(10, 'Maximum 10 skills allowed'),
  topics: z.array(z.string()).max(3, 'Maximum 3 topics allowed'),
  visibility: z.enum(['public', 'private', 'followers']),
  allowComments: z.boolean(),
  allowSharing: z.boolean(),
  scheduleDate: z.date().optional(),
  thumbnailAlt: z.string().optional(),
  contentWarning: z.boolean(),
  sensitive: z.boolean()
});

export type BroadcastFormData = z.infer<typeof createBroadcastSchema>;

export interface ContentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish?: (post: Partial<BroadcastPost>) => void | Promise<void>; // Made optional since it's not actually called
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
  watchedLink: string;
  wordCount: number;
  readTime: number;
}

export interface MediaTabProps {
  mediaFiles: MediaFile[];
  setMediaFiles: (files: MediaFile[] | ((prev: MediaFile[]) => MediaFile[])) => void;
  isUploading: boolean;
}

export interface AdvancedTabProps {
  control: any;
}

export interface PreviewSectionProps {
  watchedTitle: string;
  watchedContent: string;
  watchedLink: string;
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
