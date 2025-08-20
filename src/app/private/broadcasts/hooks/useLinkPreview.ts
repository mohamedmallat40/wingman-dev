import { useCallback, useEffect, useState } from 'react';

import type { LinkMetadata } from '../components/ui/LinkPreview';

import { linkPreviewService } from '../services/linkPreview.service';

interface UseLinkPreviewReturn {
  linkPreviews: LinkMetadata[];
  isLoading: boolean;
  removeLinkPreview: (url: string) => void;
  clearAllPreviews: () => void;
}

// URL regex to detect links in text
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const useLinkPreview = (content: string): UseLinkPreviewReturn => {
  const [linkPreviews, setLinkPreviews] = useState<LinkMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetadata = async (url: string): Promise<LinkMetadata | null> => {
    return await linkPreviewService.fetchMetadata(url);
  };

  const processUrls = useCallback(
    async (text: string) => {
      const urls = text.match(URL_REGEX);
      if (!urls) {
        setLinkPreviews([]);
        return;
      }

      // Remove duplicates and filter out already processed URLs
      const uniqueUrls = [...new Set(urls)];

      setLinkPreviews((currentPreviews) => {
        const currentUrls = currentPreviews.map((preview) => preview.url);
        const newUrls = uniqueUrls.filter((url) => !currentUrls.includes(url));

        if (newUrls.length === 0) {
          // Remove previews for URLs that are no longer in the content
          const validPreviews = currentPreviews.filter((preview) => uniqueUrls.includes(preview.url));
          return validPreviews.length !== currentPreviews.length ? validPreviews : currentPreviews;
        }

        // Process new URLs asynchronously
        setIsLoading(true);

        Promise.all(newUrls.map((url) => fetchMetadata(url)))
          .then((metadataResults) => {
            const validMetadata = metadataResults.filter(Boolean) as LinkMetadata[];

            setLinkPreviews((prev) => {
              const filtered = prev.filter((preview) => uniqueUrls.includes(preview.url));
              return [...filtered, ...validMetadata];
            });
          })
          .catch((error) => {
            console.error('Error processing URLs:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });

        // Return current previews while processing new ones
        return currentPreviews.filter((preview) => uniqueUrls.includes(preview.url));
      });
    },
    [] // Remove linkPreviews dependency to prevent infinite loop
  );

  // Debounced effect to process URLs when content changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      processUrls(content);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [content, processUrls]);

  const removeLinkPreview = useCallback((url: string) => {
    setLinkPreviews((prev) => prev.filter((preview) => preview.url !== url));
  }, []);

  const clearAllPreviews = useCallback(() => {
    setLinkPreviews([]);
    linkPreviewService.clearCache();
  }, []);

  return {
    linkPreviews,
    isLoading,
    removeLinkPreview,
    clearAllPreviews
  };
};
