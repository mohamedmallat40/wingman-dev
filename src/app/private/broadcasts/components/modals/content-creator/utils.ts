// Utility functions
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Error translation helper
export const getErrorMessage = (
  error: any,
  tErrors: any
): { title: string; description: string } => {
  // Check if it's a network error
  if (!navigator.onLine) {
    return {
      title: tErrors('offline'),
      description: tErrors('offline')
    };
  }

  // Handle HTTP status codes
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return {
        title: tErrors('badRequest'),
        description: tErrors('badRequest')
      };
    case 401:
      return {
        title: tErrors('unauthorized'),
        description: tErrors('unauthorized')
      };
    case 403:
      return {
        title: tErrors('forbidden'),
        description: tErrors('forbidden')
      };
    case 404:
      return {
        title: tErrors('notFound'),
        description: tErrors('notFound')
      };
    case 408:
      return {
        title: tErrors('timeout'),
        description: tErrors('timeout')
      };
    case 413:
      return {
        title: tErrors('contentTooLong'),
        description: tErrors('contentTooLong')
      };
    case 422:
      return {
        title: tErrors('invalidData'),
        description: tErrors('invalidData')
      };
    case 429:
      return {
        title: tErrors('tooManyRequests'),
        description: tErrors('tooManyRequests')
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        title: tErrors('serverError'),
        description: tErrors('serverError')
      };
    default:
      // Check for specific error context
      if (error?.message?.includes('network') || error?.code === 'NETWORK_ERROR') {
        return {
          title: tErrors('networkError'),
          description: tErrors('networkError')
        };
      }

      // Generic fallback
      return {
        title: tErrors('internalError'),
        description: tErrors('internalError')
      };
  }
};
