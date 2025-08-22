import { useTranslations } from 'next-intl';

/**
 * Hook to get translated validation messages for broadcast forms
 */
export function useValidationMessages() {
  const t = useTranslations('broadcasts.create.validation');

  return {
    titleRequired: t('titleRequired'),
    titleMinLength10: t('titleMinLength10'),
    titleMaxLength: t('titleMaxLength'),
    contentRequired: t('contentRequired'),
    contentMinLength20: t('contentMinLength20'),
    contentMaxLength: t('contentMaxLength'),
    skillEmpty: t('skillEmpty'),
    skillsMaxCount: t('skillsMaxCount'),
    topicEmpty: t('topicEmpty'),
    topicsRequired: t('topicsRequired'),
    topicsMaxCount: t('topicsMaxCount'),
    invalidUserId: t('invalidUserId'),
    taggedUsersMaxCount: t('taggedUsersMaxCount'),
    scheduleFutureDate: t('scheduleFutureDate'),
    thumbnailAltMaxLength: t('thumbnailAltMaxLength'),
    invalidUrl: t('invalidUrl')
  };
}

/**
 * Static validation messages for use in Zod schemas
 * Note: These are fallback messages in English for server-side validation
 */
export const VALIDATION_MESSAGES = {
  titleRequired: 'Title is required',
  titleMinLength10: 'Title must be at least 10 characters',
  titleMaxLength: 'Title cannot exceed 200 characters',
  contentRequired: 'Content is required',
  contentMinLength20: 'Content must be at least 20 characters',
  contentMaxLength: 'Content cannot exceed 10,000 characters',
  skillEmpty: 'Skill cannot be empty',
  skillsMaxCount: 'Maximum 10 skills allowed',
  topicEmpty: 'Topic cannot be empty',
  topicsRequired: 'At least one topic is required',
  topicsMaxCount: 'Maximum 3 topics allowed',
  invalidUserId: 'Invalid user ID',
  taggedUsersMaxCount: 'Maximum 20 users can be tagged',
  scheduleFutureDate: 'Schedule date must be in the future',
  thumbnailAltMaxLength: 'Thumbnail alt text cannot exceed 200 characters',
  invalidUrl: 'Please enter a valid URL (must start with http:// or https://)'
} as const;