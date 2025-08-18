'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { CommentInputProps } from '../../types/comments';

import { Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { motion } from 'framer-motion';

import { getImageUrl } from '@/lib/utils/utilities';

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  onCancel,
  placeholder = 'Add a comment...',
  autoFocus = false,
  className = '',
  enableMentions = true,
  enableRichText = false,
  isLoading = false,
  maxLength = 2000,
  initialValue = '',
  showCancel = false
}) => {
  const { profile: currentUser } = useBasicProfile();

  const [content, setContent] = useState(initialValue);
  const [mentions, setMentions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Character count and validation
  const charCount = content.length;
  const isValid = content.trim().length > 0 && charCount <= maxLength;
  const isNearLimit = charCount > maxLength * 0.8;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [content]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit with Enter (not Ctrl+Enter)
    if (e.key === 'Enter' && !e.shiftKey && isValid) {
      e.preventDefault();
      handleSubmit();
    }
    // Allow Shift+Enter for new lines
  };

  // Handle submit
  const handleSubmit = () => {
    if (!isValid || isLoading) return;

    onSubmit(content.trim(), mentions.length > 0 ? mentions : undefined);

    // Reset form if not in edit mode
    if (!showCancel) {
      setContent('');
      setMentions([]);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setContent('');
      setMentions([]);
    }
  };

  return (
    <div className={`${className}`}>
      {/* Main Input */}
      <div className='flex items-start gap-3'>
        {/* Avatar */}
        <Avatar
          src={currentUser?.profileImage ? getImageUrl(currentUser.profileImage) : undefined}
          name={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'User'}
          size='sm'
          className='h-8 w-8 flex-shrink-0'
          showFallback
          fallback={<Icon icon='solar:user-linear' className='text-default-500 h-4 w-4' />}
        />

        {/* Input Area */}
        <div className='flex-1'>
          {/* Textarea */}
          <div className='relative'>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isLoading}
              className='placeholder-default-400 w-full resize-none border-0 bg-transparent text-sm leading-5 focus:ring-0 focus:outline-none'
              rows={1}
              style={{
                minHeight: '20px',
                maxHeight: '100px'
              }}
            />
          </div>

          {/* Actions Row - only show when focused or has content */}
          {(isFocused || content.trim().length > 0 || showCancel) && (
            <div className='mt-2 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                {enableMentions && (
                  <button
                    type='button'
                    className='text-default-500 hover:text-default-700 transition-colors'
                  >
                    <Icon icon='solar:at-linear' className='h-4 w-4' />
                  </button>
                )}

                {/* Character count */}
                <span
                  className={`text-xs transition-colors ${
                    isNearLimit
                      ? 'text-orange-500'
                      : charCount > maxLength
                        ? 'text-red-500'
                        : 'text-default-400'
                  }`}
                >
                  {charCount}/{maxLength}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                {showCancel && (
                  <button
                    type='button'
                    onClick={handleCancel}
                    disabled={isLoading}
                    className='text-default-500 hover:text-default-700 text-xs font-medium transition-colors'
                  >
                    Cancel
                  </button>
                )}

                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  className={`text-xs font-semibold transition-colors ${
                    isValid && !isLoading
                      ? 'text-blue-500 hover:text-blue-600'
                      : 'text-default-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Posting...' : showCancel ? 'Update' : 'Post'}
                </button>
              </div>
            </div>
          )}

          {/* Keyboard shortcut hint */}
          {isFocused && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='mt-1'
            >
              <p className='text-default-400 text-xs'>
                Press{' '}
                <kbd className='bg-default-100 text-default-600 rounded px-1 py-0.5 font-mono text-xs'>
                  Enter
                </kbd>{' '}
                to post •{' '}
                <kbd className='bg-default-100 text-default-600 rounded px-1 py-0.5 font-mono text-xs'>
                  Shift
                </kbd>
                +
                <kbd className='bg-default-100 text-default-600 rounded px-1 py-0.5 font-mono text-xs'>
                  Enter
                </kbd>{' '}
                for new line
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
