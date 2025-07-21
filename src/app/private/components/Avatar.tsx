'use client';

import { API_ROUTES } from '@/lib/api-routes';
import { Avatar as HerouiAvatar } from '@heroui/avatar';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import useProfile from '@root/modules/profile/hooks/useProfile';
import React from 'react';

const Avatar = () => {
    const { profile, logout, isLoading } = useProfile();

    if (isLoading) {
        return (
            <div className='flex items-center gap-3'>
                <Skeleton className='w-16 h-4 rounded-lg' />
                <Skeleton className='w-8 h-8 rounded-full' />
            </div>
        );
    }

    return (
        <Dropdown placement='bottom-end'>
            <DropdownTrigger>
                <motion.div
                    className='flex items-center gap-3 p-1 rounded-lg hover:bg-content2/50 transition-colors cursor-pointer'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className='hidden sm:flex flex-col items-end'>
                        <span className='text-sm font-semibold capitalize text-foreground'>
                            {profile?.firstName} {profile?.lastName}
                        </span>
                        <span className='text-tiny text-foreground-500 truncate max-w-24'>
                            {profile?.email}
                        </span>
                    </div>

                    <HerouiAvatar
                        isBordered
                        as='button'
                        className='transition-transform hover:scale-110 ring-2 ring-primary-100 dark:ring-primary-900'
                        color='primary'
                        name={`${profile?.firstName} ${profile?.lastName}` || 'User'}
                        size='sm'
                        src={API_ROUTES.profile.image(profile?.profileImage)}
                        showFallback
                        fallback={
                            <Icon
                                icon='solar:user-linear'
                                className='text-primary-500'
                                width={16}
                            />
                        }
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
                    isReadOnly
                >
                    <div className='flex items-center gap-3'>
                        <HerouiAvatar
                            src={API_ROUTES.profile.image(profile?.profileImage)}
                            name={`${profile?.firstName} ${profile?.lastName}`}
                            size='md'
                            className='ring-2 ring-primary-100'
                        />
                        <div className='flex flex-col'>
                            <p className='font-semibold text-foreground'>
                                {profile?.firstName} {profile?.lastName}
                            </p>
                            <p className='text-sm text-foreground-500'>{profile?.email}</p>
                        </div>
                    </div>
                </DropdownItem>

                <DropdownItem
                    key='settings'
                    startContent={<Icon icon='solar:settings-linear' className='text-lg' />}
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
                    onClick={logout}
                >
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>)
}

export default Avatar
