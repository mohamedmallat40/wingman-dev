'use client';

import React from 'react';

import { Avatar as HerouiAvatar } from '@heroui/avatar';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { getBaseUrl } from '@/lib/utils/utilities';

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
          className='hover:bg-content2/50 hover:shadow-small flex cursor-pointer items-center gap-4 rounded-xl p-2 transition-all duration-200'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className='hidden min-w-0 flex-col items-end sm:flex'>
            <span className='text-foreground text-sm font-semibold tracking-tight capitalize'>
              {profile?.firstName || ''} {profile?.lastName || ''}
            </span>
            <span className='text-tiny text-foreground-500 max-w-48 truncate font-medium'>
              {profile?.email || ''}
            </span>
          </div>

          <HerouiAvatar
            isBordered
            as='button'
            className='ring-primary/20 hover:ring-primary/40 ring-offset-background shadow-medium hover:shadow-large ring-2 ring-offset-2 transition-all duration-300 hover:scale-110'
            color='primary'
            name={`${profile?.firstName || ''} ${profile?.lastName || ''}` || 'User'}
            size='sm'
            src={
              profile?.profileImage ? `${getBaseUrl()}/upload/${profile.profileImage}` : undefined
            }
            showFallback
            fallback={
              <div className='from-primary/20 to-secondary/20 flex h-full w-full items-center justify-center bg-gradient-to-br'>
                <Icon icon='solar:user-bold' className='text-primary' width={18} />
              </div>
            }
          />
        </motion.div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Profile Actions'
        variant='flat'
        className='w-80 p-2'
        disallowEmptySelection
      >
        <DropdownItem
          key='profile'
          className='hover:bg-primary/10 h-16 gap-3 rounded-lg opacity-100'
          textValue='Profile info'
          onPress={() => {
            router.push('/private/profile');
          }}
        >
          <div className='flex items-center gap-3'>
            <HerouiAvatar
              src={
                profile?.profileImage ? `${getBaseUrl()}/upload/${profile.profileImage}` : undefined
              }
              name={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
              size='md'
              className='ring-primary/20 ring-offset-background shadow-medium ring-2 ring-offset-1'
              showFallback
              fallback={
                <div className='from-primary/20 to-secondary/20 flex h-full w-full items-center justify-center bg-gradient-to-br'>
                  <Icon icon='solar:user-bold' className='text-primary' width={20} />
                </div>
              }
            />
            <div className='flex min-w-0 flex-1 flex-col'>
              <p className='text-foreground font-semibold'>
                {profile?.firstName || ''} {profile?.lastName || ''}
              </p>
              <p className='text-foreground-500 truncate text-sm'>{profile?.email || ''}</p>
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
