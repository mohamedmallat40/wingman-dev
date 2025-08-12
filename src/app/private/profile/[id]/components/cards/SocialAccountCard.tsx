'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { type SocialAccount } from '../../types';
import { ActionButtons } from '../ActionButtons';

interface SocialAccountCardProps {
  account: SocialAccount;
  isOwnProfile: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SocialAccountCard: React.FC<SocialAccountCardProps> = ({
  account,
  isOwnProfile,
  onEdit,
  onDelete
}) => {
  const platformDetails = {
    linkedin: { icon: 'solar:linkedin-linear', color: 'text-blue-600', bg: 'bg-blue-50' },
    github: { icon: 'solar:code-square-linear', color: 'text-gray-800', bg: 'bg-gray-50' },
    twitter: { icon: 'solar:twitter-linear', color: 'text-blue-400', bg: 'bg-blue-50' },
    instagram: { icon: 'solar:instagram-linear', color: 'text-pink-600', bg: 'bg-pink-50' },
    facebook: { icon: 'solar:facebook-linear', color: 'text-blue-700', bg: 'bg-blue-50' },
    youtube: { icon: 'solar:youtube-linear', color: 'text-red-600', bg: 'bg-red-50' },
    tiktok: { icon: 'solar:music-note-linear', color: 'text-black', bg: 'bg-gray-50' },
    behance: { icon: 'solar:palette-linear', color: 'text-blue-500', bg: 'bg-blue-50' },
    dribbble: { icon: 'solar:basketball-linear', color: 'text-pink-500', bg: 'bg-pink-50' },
    medium: { icon: 'solar:pen-new-square-linear', color: 'text-green-600', bg: 'bg-green-50' },
    portfolio: { icon: 'solar:folder-open-linear', color: 'text-purple-600', bg: 'bg-purple-50' },
    other: { icon: 'solar:link-linear', color: 'text-default-600', bg: 'bg-default-50' }
  };

  const details = platformDetails[account.platform as keyof typeof platformDetails] || platformDetails.other;

  return (
    <div className="relative group">
      <a
        href={account.url}
        target='_blank'
        rel='noopener noreferrer'
        className={`${details.bg} hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 rounded-lg p-3 text-center hover:shadow-sm relative block`}
      >
        <Icon icon={details.icon} className={`h-6 w-6 ${details.color}`} />
        <div>
          <p className='text-tiny font-medium text-foreground'>
            {account.displayName || account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
          </p>
          <p className='text-tiny text-foreground-500'>@{account.username}</p>
        </div>
      </a>
      
      {isOwnProfile && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ActionButtons
            showEdit
            showDelete
            onEdit={onEdit}
            onDelete={onDelete}
            editTooltip={`Edit ${account.platform} account`}
            deleteTooltip={`Delete ${account.platform} account`}
            size="sm"
            variant="flat"
          />
        </div>
      )}
    </div>
  );
};
