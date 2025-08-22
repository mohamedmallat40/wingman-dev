'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Textarea } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useMentions } from '../../hooks/useMentions';
import { MentionDropdown } from '../comments/MentionDropdown';

interface MentionsTextareaProps {
  /** The current text value */
  value: string;
  /** Callback when text changes, optionally with tagged user IDs */
  onChange: (value: string, taggedUsers?: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum rows to display */
  minRows?: number;
  /** Maximum rows to display */
  maxRows?: number;
  /** Whether the input is in an invalid state */
  isInvalid?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Description text below the input */
  description?: string;
  /** Optional CSS class name */
  className?: string;
  /** Custom class names for styling */
  classNames?: {
    inputWrapper?: string;
    input?: string;
  };
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether to enable mention functionality */
  enableMentions?: boolean;
  /** Callback when tagged users change */
  onTaggedUsersChange?: (userIds: string[]) => void;
}

/**
 * Enhanced textarea component with mention functionality
 * 
 * @description Provides a textarea with @mention support, including user search,
 * dropdown positioning, keyboard navigation, and accessibility features.
 * 
 * @example
 * ```tsx
 * <MentionsTextarea
 *   value={content}
 *   onChange={(value, taggedUsers) => setContent(value)}
 *   onTaggedUsersChange={(userIds) => setTaggedUsers(userIds)}
 *   placeholder="Share your thoughts..."
 *   enableMentions={true}
 * />
 * ```
 */
export const MentionsTextarea: React.FC<MentionsTextareaProps> = ({
  value,
  onChange,
  placeholder,
  minRows = 10,
  maxRows = 25,
  isInvalid,
  errorMessage,
  description,
  className,
  classNames,
  disabled,
  enableMentions = true,
  onTaggedUsersChange
}) => {
  const t = useTranslations('broadcasts.ui');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
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

  // Handle value change with mentions detection
  const handleValueChange = (newValue: string) => {
    onChange(newValue, taggedUsers.length > 0 ? taggedUsers : undefined);

    // Use a timeout to get the cursor position after React updates
    setTimeout(() => {
      const newCursorPosition = textareaRef.current?.selectionStart || newValue.length;
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
    }, 0);
  };

  // Handle focus events to track cursor position
  const handleFocus = () => {
    const newCursorPosition = textareaRef.current?.selectionStart || 0;
    setCursorPosition(newCursorPosition);
  };

  // Calculate dropdown position based on cursor location using textarea-caret-position
  const getDropdownPosition = useMemo(() => {
    if (!textareaRef.current) {
      return { top: 0, left: 0 };
    }

    const textarea = textareaRef.current;
    const mentionMatch = findMentionMatch(value, cursorPosition);
    
    if (!mentionMatch) {
      return { top: 0, left: 0 };
    }

    // Get the computed style of the textarea
    const style = window.getComputedStyle(textarea);
    const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.2;
    
    // Calculate which line the @ is on
    const textBeforeAt = value.substring(0, mentionMatch.index);
    const lines = textBeforeAt.split('\n');
    const currentLineNumber = lines.length - 1;
    
    // Calculate approximate position
    const paddingTop = parseInt(style.paddingTop) || 0;
    const paddingLeft = parseInt(style.paddingLeft) || 0;
    
    // Position dropdown at the start of the line where @ appears
    const top = paddingTop + (currentLineNumber * lineHeight) + lineHeight;
    const left = paddingLeft;
    
    return { top, left };
  }, [value, cursorPosition, findMentionMatch]);

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
          const mentionMatch = findMentionMatch(value, cursorPosition);
          if (mentionMatch) {
            const result = selectUser(selectedUser, value, mentionMatch);
            const newTaggedUsers = [...taggedUsers, ...result.taggedUsers];
            setTaggedUsers(newTaggedUsers);
            onChange(result.newText, newTaggedUsers);
            
            // Notify parent of tagged users change
            if (onTaggedUsersChange) {
              onTaggedUsersChange(newTaggedUsers);
            }
            
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
  };

  return (
    <div className={className} ref={containerRef}>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onValueChange={handleValueChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={handleFocus}
          onBlur={() => {
            // Delay blur to allow dropdown clicks
            setTimeout(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                closeSuggestions();
              }
            }, 200);
          }}
          placeholder={placeholder}
          minRows={minRows}
          maxRows={maxRows}
          isInvalid={isInvalid}
          errorMessage={errorMessage}
          description={description}
          disabled={disabled}
          classNames={classNames}
          aria-label={placeholder || t('textareaWithMentions')}
          aria-describedby={enableMentions ? 'mention-instructions' : undefined}
          role="textbox"
          aria-multiline="true"
          aria-expanded={suggestions.length > 0}
          aria-haspopup={enableMentions ? 'listbox' : undefined}
        />

        {/* Mention Dropdown */}
        {enableMentions && (suggestions.length > 0 || isSearching) && (
          <div 
            className="absolute z-50"
            style={{
              top: `${getDropdownPosition.top}px`,
              left: `${getDropdownPosition.left}px`
            }}
            role="listbox"
            aria-label={t('mentionSuggestions')}
          >
              <MentionDropdown
                users={suggestions}
                selectedIndex={selectedIndex}
                isLoading={isSearching}
                onSelect={(user) => {
                  const mentionMatch = findMentionMatch(value, cursorPosition);
                  if (mentionMatch) {
                    const result = selectUser(user, value, mentionMatch);
                    const newTaggedUsers = [...taggedUsers, ...result.taggedUsers];
                    setTaggedUsers(newTaggedUsers);
                    onChange(result.newText, newTaggedUsers);
                    
                    // Notify parent of tagged users change
                    if (onTaggedUsersChange) {
                      onTaggedUsersChange(newTaggedUsers);
                    }
                    
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
                position={getDropdownPosition}
              />
            </div>
          )}
      </div>
    </div>
  );
};