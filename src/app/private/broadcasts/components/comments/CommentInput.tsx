'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { CommentInputProps } from '../../types/comments';

import { Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { motion } from 'framer-motion';

import { getImageUrl } from '@/lib/utils/utilities';
import { useMentions } from '../../hooks/useMentions';
import { MentionDropdown } from './MentionDropdown';

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
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mention functionality
  const {
    isSearching,
    suggestions,
    selectedIndex,
    findMentionMatch,
    searchUsers,
    selectUser,
    navigateUp,
    navigateDown,
    getSelectedUser,
    closeSuggestions
  } = useMentions();

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
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart || 0;
    
    setContent(newValue);
    setCursorPosition(newCursorPosition);

    // Check for mention trigger
    if (enableMentions) {
      const mentionMatch = findMentionMatch(newValue, newCursorPosition);
      if (mentionMatch) {
        searchUsers(mentionMatch.query);
      } else {
        closeSuggestions();
      }
    }
  };

  // Handle cursor position change
  const handleCursorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.target.selectionStart || 0);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle mention navigation
    if (suggestions.length > 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateUp();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateDown();
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const selectedUser = getSelectedUser();
        if (selectedUser) {
          const mentionMatch = findMentionMatch(content, cursorPosition);
          if (mentionMatch) {
            const result = selectUser(selectedUser, content, mentionMatch);
            setContent(result.newText);
            setTaggedUsers(prev => [...prev, ...result.taggedUsers]);
            
            // Set cursor position after mention
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
                setCursorPosition(result.newCursorPosition);
              }
            }, 0);
          }
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSuggestions();
        return;
      }
    }

    // Submit with Enter (not Ctrl+Enter) - only if no suggestions
    if (e.key === 'Enter' && !e.shiftKey && suggestions.length === 0 && isValid) {
      e.preventDefault();
      handleSubmit();
    }
    // Allow Shift+Enter for new lines
  };

  // Handle submit
  const handleSubmit = () => {
    if (!isValid || isLoading) return;

    onSubmit(content.trim(), taggedUsers.length > 0 ? taggedUsers : undefined);

    // Reset form if not in edit mode
    if (!showCancel) {
      setContent('');
      setTaggedUsers([]);
      closeSuggestions();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setContent('');
      setTaggedUsers([]);
      closeSuggestions();
    }
  };

  // Calculate mention dropdown position
  const getMentionDropdownPosition = useCallback(() => {
    if (!textareaRef.current || !containerRef.current) {
      return { top: 0, left: 0 };
    }

    const textarea = textareaRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Create a temporary div to measure text dimensions
    const div = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    div.style.font = style.font;
    div.style.fontSize = style.fontSize;
    div.style.lineHeight = style.lineHeight;
    div.style.padding = style.padding;
    div.style.border = style.border;
    div.style.whiteSpace = 'pre-wrap';
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.width = style.width;
    
    const mentionMatch = findMentionMatch(content, cursorPosition);
    if (mentionMatch) {
      div.textContent = content.substring(0, mentionMatch.index);
      document.body.appendChild(div);
      
      const textHeight = div.offsetHeight;
      const textWidth = div.offsetWidth;
      
      document.body.removeChild(div);
      
      return {
        top: textHeight + 32, // Add some offset
        left: Math.min(textWidth, containerRect.width - 280) // Ensure dropdown fits
      };
    }

    return { top: 32, left: 0 };
  }, [content, cursorPosition, findMentionMatch]);

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
        <div className='flex-1' ref={containerRef}>
          {/* Textarea */}
          <div className='relative'>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onSelect={handleCursorChange}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                // Delay blur to allow dropdown clicks
                setTimeout(() => {
                  if (!containerRef.current?.contains(document.activeElement)) {
                    setIsFocused(false);
                    closeSuggestions();
                  }
                }, 200);
              }}
              placeholder={placeholder}
              disabled={isLoading}
              className='placeholder-default-400 w-full resize-none border-0 bg-transparent text-sm leading-5 focus:ring-0 focus:outline-none'
              rows={1}
              style={{
                minHeight: '20px',
                maxHeight: '100px'
              }}
            />

            {/* Mention Dropdown - positioned directly under input */}
            {enableMentions && (suggestions.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 mt-1 z-50">
                <MentionDropdown
                  users={suggestions}
                  selectedIndex={selectedIndex}
                  isLoading={isSearching}
                  onSelect={(user) => {
                    const mentionMatch = findMentionMatch(content, cursorPosition);
                    if (mentionMatch) {
                      const result = selectUser(user, content, mentionMatch);
                      setContent(result.newText);
                      setTaggedUsers(prev => [...prev, ...result.taggedUsers]);
                      
                      // Focus back to textarea and set cursor
                      setTimeout(() => {
                        if (textareaRef.current) {
                          textareaRef.current.focus();
                          textareaRef.current.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
                          setCursorPosition(result.newCursorPosition);
                        }
                      }, 0);
                    }
                  }}
                  position={{ top: 0, left: 0 }} // Not needed anymore since we position with CSS
                />
              </div>
            )}
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
