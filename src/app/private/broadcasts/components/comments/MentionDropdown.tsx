'use client';

import React from 'react';
import { Avatar, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { NetworkUser } from '../../services/networkService';
import { getImageUrl } from '@/lib/utils/utilities';

interface MentionDropdownProps {
  users: NetworkUser[];
  selectedIndex: number;
  isLoading?: boolean;
  onSelect: (user: NetworkUser) => void;
  position: { top: number; left: number };
}

export const MentionDropdown: React.FC<MentionDropdownProps> = ({
  users,
  selectedIndex,
  isLoading = false,
  onSelect,
  position
}) => {
  if (users.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card
      className="min-w-64 max-w-80 shadow-large border-default-200"
    >
      <CardBody className="p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <Icon 
              icon="solar:loading-linear" 
              className="h-5 w-5 animate-spin text-primary" 
            />
            <span className="ml-2 text-sm text-foreground-500">Searching...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-3 text-sm text-foreground-500">
            No users found
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary/10 ring-1 ring-primary/20'
                    : 'hover:bg-default-100'
                }`}
                onClick={() => onSelect(user)}
              >
                <Avatar
                  src={user.profileImage ? getImageUrl(user.profileImage) : undefined}
                  name={`${user.firstName} ${user.lastName}`}
                  size="sm"
                  className="flex-shrink-0"
                  showFallback
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 text-xs font-semibold">
                      {user.firstName[0]?.toUpperCase()}{user.lastName[0]?.toUpperCase()}
                    </div>
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </span>
                    {user.userName && (
                      <span className="text-xs text-foreground-400">
                        @{user.userName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-500">
                    <span className="truncate">
                      {user.profession === 'FULL_TIME_FREELANCER' ? 'Freelancer' : 
                       user.profession === 'PART_TIME_FREELANCER' ? 'Part-time Freelancer' :
                       user.profession}
                    </span>
                    {user.city && user.region && (
                      <span className="text-foreground-400">•</span>
                    )}
                    {user.city && user.region && (
                      <span className="truncate">
                        {user.city}, {user.region}
                      </span>
                    )}
                  </div>
                </div>
                {index === selectedIndex && (
                  <Icon 
                    icon="solar:check-circle-bold" 
                    className="h-4 w-4 text-primary flex-shrink-0" 
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Instructions */}
        {users.length > 0 && !isLoading && (
          <div className="border-t border-default-200 mt-2 pt-2">
            <p className="text-xs text-foreground-400 text-center">
              Press <kbd className="px-1 py-0.5 bg-default-200 rounded text-xs">↵</kbd> to select, 
              <kbd className="px-1 py-0.5 bg-default-200 rounded text-xs ml-1">↑↓</kbd> to navigate
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};