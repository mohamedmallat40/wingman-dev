import { useCallback, useEffect, useState } from 'react';

import type { LinkMetadata } from '../components/ui/LinkPreview';

import { linkPreviewService } from '../services/linkPreview.service';

interface UseLinkPreviewForPostReturn {
  linkPreviews: LinkMetadata[];
  isLoading: boolean;
}

// URL regex to detect links in text
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const useLinkPreviewForPost = (
  content: string,
  dedicatedLink?: string
): UseLinkPreviewForPostReturn => {
  const [linkPreviews, setLinkPreviews] = useState<LinkMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processUrls = useCallback(async (text: string, link?: string) => {
    // Collect URLs from both sources
    const urlsFromContent = text.match(URL_REGEX) || [];
    const allUrls = [...urlsFromContent];

    // Add dedicated link if provided and not already in content
    if (link && link.trim() && !allUrls.includes(link)) {
      allUrls.push(link);
    }

    if (allUrls.length === 0) {
      setLinkPreviews([]);
      return;
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(allUrls)];

    setIsLoading(true);

    try {
      const metadataPromises = uniqueUrls.map((url) => linkPreviewService.fetchMetadata(url));
      const metadataResults = await Promise.all(metadataPromises);

      const validMetadata = metadataResults.filter(Boolean) as LinkMetadata[];

      setLinkPreviews(validMetadata);
    } catch (error) {
      console.error('Error processing URLs for post:', error);
      setLinkPreviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    processUrls(content, dedicatedLink);
  }, [content, dedicatedLink, processUrls]);

  return {
    linkPreviews,
    isLoading
  };
};
