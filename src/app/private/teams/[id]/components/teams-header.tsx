import React, { use } from 'react';

import { Avatar, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { getAvailabilityConfig, mapUserType } from '@/app/private/talent-pool/components';
import { getBaseUrl } from '@/lib/utils/utilities';

import { type Group } from '../types';
import { AVAILABILITY_COLORS, TEAM_COLORS } from './constants';

interface TeamDetailsHeaderProperties {
  team: Group;
  onBack: () => void;
  onEdit: () => void;
  onJoin: () => void;
  onConnectToOwner: () => void;
}

const getTeamColorClass = (color: string): string => {
  const colorConfig = TEAM_COLORS.find((c) => c.name.toLowerCase() === color.toLowerCase());
  return colorConfig?.class || 'bg-gray-500';
};

const getAvailabilityColor = (
  status: string
): 'secondary' | 'primary' | 'warning' | 'success' | 'danger' | 'default' => {
  const colorMap: Record<
    string,
    'secondary' | 'primary' | 'warning' | 'success' | 'danger' | 'default'
  > = {
    available: 'success',
    busy: 'warning',
    unavailable: 'danger'
  };
  return colorMap[status] || 'default';
};
export const TeamDetailsHeader: React.FC<TeamDetailsHeaderProperties> = ({
  team,
  onBack,
  onEdit,
  onJoin,
  onConnectToOwner
}) => {
  // Check if current user is the team owner (you'll need to implement getCurrentUser)
  const currentUserId = 'current-user-id'; // Replace with actual current user ID
  const isOwner = team.owner.id === currentUserId;
  const t = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='rounded-2xl border border-gray-200/80 bg-white/70 p-8 shadow-lg backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/70'
    >
      {/* Back Button */}
      <div className='mb-6'>
        <Button
          variant='light'
          size='sm'
          startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
          onPress={onBack}
          className='text-gray-600 hover:text-gray-900'
        >
          Back to Teams
        </Button>
      </div>

      {/* Main Header Content */}
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        {/* Team Info */}
        <div className='flex flex-col items-start gap-2'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-3'>
              <Icon icon='solar:users-group-rounded-bold' className='h-8 w-8' />
              <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {team.groupName}
              </h1>
              <Chip size='sm' variant='flat' className={getTeamColorClass(team.color)}>
                {Array.isArray(team.members) ? team.members.length : team.members} member
                {(Array.isArray(team.members) ? team.members.length : team.members) === 1
                  ? ''
                  : 's'}
              </Chip>
            </div>
          </div>

          {/* Team Details */}
          <div className=''>
            {/* Owner Information */}
            <div className='mb-3 flex items-center gap-3'>
              <Avatar
                src={
                  team.owner.profileImage
                    ? `${getBaseUrl()}/upload/${team.owner.profileImage}`
                    : undefined
                }
                name={`${team.owner.firstName} ${team.owner.lastName}`}
                size='sm'
                className='flex-shrink-0 dark:text-gray-100'
              />
              <div>
                <div className='flex items-center gap-3'>
                  <p className='font-medium text-gray-900 dark:text-gray-100'>
                    {team.owner.firstName} {team.owner.lastName}
                  </p>
                  <Chip
                    size='sm'
                    color={getAvailabilityColor(team.owner.statusAviability)}
                    variant='flat'
                    className='capitalize'
                  >
                    {t(getAvailabilityConfig(team.owner.statusAviability as any).labelKey)}
                  </Chip>
                </div>
                <p className='text-sm text-gray-600'>{mapUserType(team.owner.profession, t)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3 lg:w-auto lg:flex-col lg:items-stretch'>
          {isOwner ? (
            <Button
              color='primary'
              variant='flat'
              startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
              onPress={onEdit}
              className='transition-all duration-200 hover:shadow-md'
              size='md'
            >
              Edit Team
            </Button>
          ) : (
            <>
              <Button
                color='secondary'
                variant='flat'
                startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
                onPress={onConnectToOwner}
                className='transition-all duration-200 hover:shadow-md'
                size='md'
              >
                Connect to Owner
              </Button>
              <Button
                color='primary'
                variant='flat'
                startContent={
                  <Icon icon='solar:users-group-two-rounded-linear' className='h-4 w-4' />
                }
                onPress={onJoin}
                className='transition-all duration-200 hover:shadow-md'
                size='md'
              >
                Join Team
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
