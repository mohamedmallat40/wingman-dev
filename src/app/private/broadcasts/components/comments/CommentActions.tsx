'use client';

import React from 'react';

import type { CommentAction, CommentActionsProps } from '../../types/comments';

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
        className={`hover:bg-default-100 flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
          comment.isLiked ? 'text-danger' : 'text-default-500 hover:text-danger'
        }`}
      >
        <Icon
          icon={comment.isLiked ? 'solar:heart-bold' : 'solar:heart-linear'}
          className='h-4 w-4'
        />
        <span className='font-medium'>{comment.isLiked ? 'Liked' : 'Like'}</span>
        {(comment.likesCount || 0) > 0 && <span className='text-xs'>({comment.likesCount})</span>}
      </button>

      {/* Reply button */}
      {showReplyButton && (
        <button
          onClick={() => handleAction('reply')}
          className='text-default-500 hover:text-primary hover:bg-primary/10 flex items-center gap-1 rounded-md px-2 py-1 transition-colors'
        >
          <Icon icon='solar:chat-round-linear' className='h-4 w-4' />
          <span className='font-medium'>Reply</span>
        </button>
      )}
    </div>
  );
};
