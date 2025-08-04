'use client';

import React from 'react';

import { Avatar as HerouiAvatar } from '@heroui/avatar';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { API_ROUTES } from '@/lib/api-routes';

const Avatar = () => {
  const { profile, logout, isLoading } = useBasicProfile();
  const router = useRouter();
  if (isLoading) {
    return (
      <div className='flex items-center gap-3'>
        <Skeleton className='h-4 w-16 rounded-lg' />
        <Skeleton className='h-8 w-8 rounded-full' />
      </div>
    );
  }

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <motion.div
          className='hover:bg-content2/50 flex cursor-pointer items-center gap-3 rounded-lg p-1 transition-colors'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className='hidden flex-col items-end sm:flex'>
            <span className='text-foreground text-sm font-semibold capitalize'>
              {profile.firstName} {profile.lastName}
            </span>
            <span className='text-tiny text-foreground-500 max-w-24 truncate'>{profile.email}</span>
          </div>

          <HerouiAvatar
            isBordered
            as='button'
            className='ring-primary-100 dark:ring-primary-900 ring-2 transition-transform hover:scale-110'
            color='primary'
            name={`${profile.firstName} ${profile.lastName}` || 'User'}
            size='sm'
            src={`${API_ROUTES.profile.image}${profile.profileImage}`}
            showFallback
            fallback={<Icon icon='solar:user-linear' className='text-primary-500' width={16} />}
          />
        </motion.div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Profile Actions'
        variant='flat'
        className='w-64'
        disallowEmptySelection
      >
        <DropdownItem
          key='profile'
          className='h-16 gap-3 opacity-100'
          textValue='Profile info'
          onPress={() => {
            router.push(`/private/profile?id=${profile.id}`);
          }}
        >
          <div className='flex items-center gap-3'>
            <HerouiAvatar
              src={`${API_ROUTES.profile.image}${profile.profileImage}`}
              name={`${profile.firstName} ${profile.lastName}`}
              size='md'
              className='ring-primary-100 ring-2'
            />
            <div className='flex flex-col'>
              <p className='text-foreground font-semibold'>
                {profile.firstName} {profile.lastName}
              </p>
              <p className='text-foreground-500 text-sm'>{profile.email}</p>
            </div>
          </div>
        </DropdownItem>

        <DropdownItem
          key='settings'
          startContent={<Icon icon='solar:settings-linear' className='text-lg' />}
          onPress={() => {
            router.push('/private/settings');
          }}
        >
          My Settings
        </DropdownItem>

        <DropdownItem
          key='team_settings'
          startContent={<Icon icon='solar:users-group-rounded-linear' className='text-lg' />}
        >
          Team Settings
        </DropdownItem>

        <DropdownItem
          key='analytics'
          startContent={<Icon icon='solar:chart-2-linear' className='text-lg' />}
        >
          Analytics
        </DropdownItem>

        <DropdownItem
          key='system'
          startContent={<Icon icon='solar:server-linear' className='text-lg' />}
        >
          System
        </DropdownItem>

        <DropdownItem
          key='configurations'
          startContent={<Icon icon='solar:widget-add-linear' className='text-lg' />}
        >
          Configurations
        </DropdownItem>

        <DropdownItem
          key='help_and_feedback'
          startContent={<Icon icon='solar:question-circle-linear' className='text-lg' />}
        >
          Help & Feedback
        </DropdownItem>

        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          startContent={<Icon icon='solar:logout-2-linear' className='text-lg' />}
          onPress={logout}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Avatar;
