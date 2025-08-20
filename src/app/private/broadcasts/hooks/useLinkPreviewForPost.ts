import { useMemo } from 'react';

import type { LinkMetadata } from '../components/ui/LinkPreview';

import { useLinkPreview } from './useLinkPreview';

/**
 * Optimized hook for link previews in posts
 * Combines content and dedicated link efficiently
 */
export const useLinkPreviewForPost = (
  content: string = '',
  dedicatedLink?: string
): { linkPreviews: LinkMetadata[]; isLoading: boolean } => {
  // Memoize the combined text to prevent unnecessary re-processing
  const combinedText = useMemo(() => {
    const contentText = content || '';
    const linkText = dedicatedLink?.trim() || '';
    
    // Only combine if there's a dedicated link and it's not already in content
    if (linkText && !contentText.includes(linkText)) {
      return `${contentText} ${linkText}`;
    }
    
    return contentText;
  }, [content, dedicatedLink]);

  // Use the optimized useLinkPreview hook
  const { linkPreviews, isLoading } = useLinkPreview(combinedText);

  return {
    linkPreviews,
    isLoading
  };
};
