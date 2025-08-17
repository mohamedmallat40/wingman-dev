'use client';

import React from 'react';

import type { CommentActionsProps, CommentAction } from '../../types/comments';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSmartCountFormat } from '../../utils/timeFormatting';

export const CommentActions: React.FC<CommentActionsProps> = ({
  comment,
  onAction,
  showReplyButton = true,
  showEditButton = true,
  showDeleteButton = true,
  className = ''
}) => {
  const handleAction = (action: CommentAction) => {
    onAction(action);
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Like button */}
      <button
        onClick={() => handleAction('like')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors hover:bg-default-100 ${
          comment.isLiked ? 'text-danger' : 'text-default-500 hover:text-danger'
        }`}
      >
        <Icon 
          icon={comment.isLiked ? "solar:heart-bold" : "solar:heart-linear"}
          className="h-4 w-4"
        />
        <span className="font-medium">
          {comment.isLiked ? 'Liked' : 'Like'}
        </span>
        {(comment.likesCount || 0) > 0 && (
          <span className="text-xs">({comment.likesCount})</span>
        )}
      </button>

      {/* Reply button */}
      {showReplyButton && (
        <button
          onClick={() => handleAction('reply')}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-default-500 hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Icon icon="solar:chat-round-linear" className="h-4 w-4" />
          <span className="font-medium">Reply</span>
        </button>
      )}
    </div>
  );
};