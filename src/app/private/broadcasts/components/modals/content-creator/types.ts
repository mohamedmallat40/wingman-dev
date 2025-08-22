import type { MediaFile } from '@/components/ui/file-upload/MediaUpload';
import type { BroadcastPost } from '../../../types';
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { User } from '@/types/user';

import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../../../utils/validation-messages';

/**
 * URL validation regex - more permissive to handle real-world URLs
 * Supports both HTTP and HTTPS protocols with various URL patterns
 */
const urlRegex =
  /^https?:\/\/(?:[\w.-])+(?:\:[0-9]+)?(?:\/(?:[\w\/_@~!$&'()*+,;=:-])*(?:\?(?:[\w&=%@~!$'()*+,;:-])*)?(?:\#(?:[\w@~!$&'()*+,;=:-])*)?)?$/;

/**
 * Enhanced Zod schema for broadcast creation with comprehensive validation
 * Includes validation for title, content, links, skills, topics, and other fields
 */
export const createBroadcastSchema = z.object({
  title: z
    .string()
    .min(1, VALIDATION_MESSAGES.titleRequired)
    .min(10, VALIDATION_MESSAGES.titleMinLength10)
    .max(200, VALIDATION_MESSAGES.titleMaxLength),
  content: z
    .string()
    .min(1, VALIDATION_MESSAGES.contentRequired)
    .min(20, VALIDATION_MESSAGES.contentMinLength20)
    .max(10000, VALIDATION_MESSAGES.contentMaxLength),
  link: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true; // Allow empty string
        return urlRegex.test(val);
      },
      {
        message: VALIDATION_MESSAGES.invalidUrl
      }
    ),
  skills: z
    .array(z.string().min(1, VALIDATION_MESSAGES.skillEmpty))
    .max(10, VALIDATION_MESSAGES.skillsMaxCount)
    .optional()
    .default([]),
  topics: z
    .array(z.string().min(1, VALIDATION_MESSAGES.topicEmpty))
    .min(1, VALIDATION_MESSAGES.topicsRequired)
    .max(3, VALIDATION_MESSAGES.topicsMaxCount),
  taggedUsers: z
    .array(z.string().uuid(VALIDATION_MESSAGES.invalidUserId))
    .max(20, VALIDATION_MESSAGES.taggedUsersMaxCount)
    .optional()
    .default([]),
  visibility: z.enum(['public', 'private', 'followers']),
  allowComments: z.boolean(),
  allowSharing: z.boolean(),
  scheduleDate: z
    .date()
    .refine(
      (date) => !date || date > new Date(),
      VALIDATION_MESSAGES.scheduleFutureDate
    )
    .optional(),
  thumbnailAlt: z
    .string()
    .max(200, VALIDATION_MESSAGES.thumbnailAltMaxLength)
    .optional(),
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


export interface Topic {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface ContentTabProps {
  control: Control<BroadcastFormData>;
  errors: FieldErrors<BroadcastFormData>;
  availableTopics: Topic[];
  topicsLoading: boolean;
  watchedContent: string;
  watchedLink: string;
  wordCount: number;
  readTime: number;
  setValue?: UseFormSetValue<BroadcastFormData>;
  watchedTaggedUsers?: string[];
}

export interface MediaTabProps {
  mediaFiles: MediaFile[];
  setMediaFiles: (files: MediaFile[] | ((prev: MediaFile[]) => MediaFile[])) => void;
  isUploading: boolean;
}

export interface AdvancedTabProps {
  control: Control<BroadcastFormData>;
}

export interface PreviewSectionProps {
  watchedTitle: string;
  watchedContent: string;
  watchedLink: string;
  watchedTopics: string[];
  watchedSkills: string[];
  availableTopics: Topic[];
  mediaFiles: MediaFile[];
  setMediaFiles: (files: MediaFile[]) => void;
  wordCount: number;
  readTime: number;
  profileLoading: boolean;
  currentUser: User | null;
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
  persistedFormData: BroadcastFormData;
  initialData?: Partial<BroadcastPost>;
  isEditMode?: boolean;
}
