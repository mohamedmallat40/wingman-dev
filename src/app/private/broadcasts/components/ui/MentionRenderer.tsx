'use client';

import React from 'react';

interface MentionRendererProps {
  /** The text content to render with mentions */
  content: string;
  /** Optional CSS class name for the container */
  className?: string;
}

/**
 * Renders text content with styled inline mentions
 * 
 * @description Converts @FirstName LastName patterns (max 2 words) to styled spans.
 * Includes error handling to fallback to plain text if mention parsing fails.
 * 
 * @example
 * ```tsx
 * <MentionRenderer 
 *   content="Hello @John Doe, how are you?" 
 *   className="my-content"
 * />
 * ```
 */
export const MentionRenderer: React.FC<MentionRendererProps> = ({
  content,
  className = ''
}) => {
  // Regular expression to match @FirstName LastName patterns (max 2 words)
  const mentionRegex = /@([A-Za-z]+(?:\s+[A-Za-z]+)?)/g;

  // Split content by mentions and render with styles
  const renderContentWithMentions = (text: string) => {
    try {
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = mentionRegex.exec(text)) !== null) {
        // Add text before mention
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }

        // Add styled mention
        parts.push(
          <span
            key={`mention-${match.index}`}
            className="text-primary-600 font-medium hover:text-primary-700 cursor-pointer transition-colors"
            role="button"
            tabIndex={0}
            aria-label={`Mention ${match[1]}`}
          >
            @{match[1]}
          </span>
        );

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts;
    } catch (error) {
      // Fallback to plain text if mention parsing fails
      console.error('Error parsing mentions:', error);
      return [text];
    }
  };

  return (
    <div className={className}>
      {renderContentWithMentions(content)}
    </div>
  );
};