'use client'
import { API_ROUTES } from '@/lib/api-routes'
import { Avatar as HerouiAvatar } from '@heroui/avatar'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import useProfile from '@root/modules/profile/hooks/useProfile'
import React from 'react'

const Avatar = () => {
    const {profile,logout}=useProfile()
    return (
        <Dropdown placement='bottom-end'>
            <DropdownTrigger>
                <div className='flex gap-4'>
                 <span className='whitespace-nowrap min-w-16 font-semibold capitalize'>  
                {profile?.firstName}  {profile?.lastName}
                </span> 
                <HerouiAvatar
                    isBordered
                    as='button'
                    className='transition-transform'
                    color='secondary'
                    name={`${profile?.firstName}  ${profile?.lastName}`|| 'Zoey'}
                    size='sm'
                    src={API_ROUTES.profile.image(profile?.profileImage) }
                />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label='Profile Actions' variant='flat'>
                <DropdownItem key='profile' className='h-14 gap-2'>
                    <p className='font-semibold'>Signed in as</p>
                    <p className='font-semibold'>{profile?.email}</p>
                </DropdownItem>
                <DropdownItem key='settings'>My Settings</DropdownItem>
                <DropdownItem key='team_settings'>Team Settings</DropdownItem>
                <DropdownItem key='analytics'>Analytics</DropdownItem>
                <DropdownItem key='system'>System</DropdownItem>
                <DropdownItem key='configurations'>Configurations</DropdownItem>
                <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem>
                <DropdownItem key='logout' color='danger' onClick={logout}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>)
}

export default Avatar